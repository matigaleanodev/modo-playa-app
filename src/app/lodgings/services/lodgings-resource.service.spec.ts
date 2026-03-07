import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { Lodging, LodgingType, PriceUnit } from '../models/lodging.model';
import { LodgingsService } from './lodgings.service';
import { LodgingsResourceService } from './lodgings-resource.service';
import { NavService } from '@shared/services/nav/nav.service';
import { StorageService } from '@shared/services/storage/storage.service';

describe('LodgingsResourceService', () => {
  let service: LodgingsResourceService;

  const lodgingA: Lodging = {
    id: 'a',
    title: 'Lodging A',
    description: 'Desc A',
    location: 'Loc A',
    city: 'City A',
    type: LodgingType.HOUSE,
    price: 100,
    priceUnit: PriceUnit.NIGHT,
    maxGuests: 2,
    bedrooms: 1,
    bathrooms: 1,
    minNights: 1,
    amenities: [],
    mainImage: 'a.webp',
    images: [],
  };

  const lodgingB: Lodging = {
    ...lodgingA,
    id: 'b',
    title: 'Lodging B',
  };

  const lodgingsServiceMock = {
    getPaginated: jasmine.createSpy('getPaginated'),
  };

  const navServiceMock = {
    forward: jasmine.createSpy('forward'),
  };

  const storageServiceMock = {
    getItem: jasmine.createSpy('getItem').and.resolveTo([]),
    setItem: jasmine.createSpy('setItem').and.resolveTo(undefined),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        LodgingsResourceService,
        { provide: LodgingsService, useValue: lodgingsServiceMock },
        { provide: NavService, useValue: navServiceMock },
        { provide: StorageService, useValue: storageServiceMock },
      ],
    });

    service = TestBed.inject(LodgingsResourceService);

    lodgingsServiceMock.getPaginated.calls.reset();
    navServiceMock.forward.calls.reset();
    storageServiceMock.getItem.calls.reset();
    storageServiceMock.setItem.calls.reset();
  });

  it('deberia cargar la primera pagina', async () => {
    lodgingsServiceMock.getPaginated.and.returnValue(
      of({
        data: [lodgingA],
        total: 2,
        page: 1,
        limit: 8,
      }),
    );

    await service.loadInitialLodgings();

    expect(service.lodgings()).toEqual([lodgingA]);
    expect(service.hasMore()).toBeTrue();
    expect(lodgingsServiceMock.getPaginated).toHaveBeenCalledWith({
      page: 1,
      limit: 8,
    });
  });

  it('deberia omitir search vacio al reiniciar listado', async () => {
    lodgingsServiceMock.getPaginated.and.returnValue(
      of({
        data: [lodgingA],
        total: 1,
        page: 1,
        limit: 8,
      }),
    );

    await service.setSearch('   ');

    expect(service.search()).toBe('');
    expect(lodgingsServiceMock.getPaginated).toHaveBeenCalledWith({
      page: 1,
      limit: 8,
    });
  });

  it('deberia reiniciar listado con search y reutilizarlo en la pagina siguiente', async () => {
    lodgingsServiceMock.getPaginated.and.returnValues(
      of({
        data: [lodgingA],
        total: 2,
        page: 1,
        limit: 8,
      }),
      of({
        data: [lodgingB],
        total: 2,
        page: 2,
        limit: 8,
      }),
    );

    await service.setSearch('  mar azul  ');
    await service.loadNextLodgingsPage();

    expect(service.search()).toBe('mar azul');
    expect(lodgingsServiceMock.getPaginated).toHaveBeenCalledWith({
      page: 1,
      limit: 8,
      search: 'mar azul',
    });
    expect(lodgingsServiceMock.getPaginated).toHaveBeenCalledWith({
      page: 2,
      limit: 8,
      search: 'mar azul',
    });
  });

  it('deberia cargar siguiente pagina y mergear resultados', async () => {
    lodgingsServiceMock.getPaginated.and.returnValues(
      of({
        data: [lodgingA],
        total: 2,
        page: 1,
        limit: 8,
      }),
      of({
        data: [lodgingB],
        total: 2,
        page: 2,
        limit: 8,
      }),
    );

    await service.loadInitialLodgings();
    await service.loadNextLodgingsPage();

    expect(service.lodgings()).toEqual([lodgingA, lodgingB]);
    expect(service.hasMore()).toBeFalse();
  });

  it('deberia seleccionar y navegar al detalle', () => {
    service.toLodgingDetail(lodgingA);

    expect(service.selectedLodging()).toEqual(lodgingA);
    expect(navServiceMock.forward).toHaveBeenCalledWith('/lodging/a');
  });

  it('deberia cargar favoritos desde storage', async () => {
    storageServiceMock.getItem.and.resolveTo([lodgingA]);

    await service.loadFavorites();

    expect(storageServiceMock.getItem).toHaveBeenCalled();
    expect(service.isFavorite(lodgingA.id)).toBeTrue();
  });

  it('no deberia recargar favoritos si ya fueron cargados', async () => {
    storageServiceMock.getItem.and.resolveTo([lodgingA]);

    await service.loadFavorites();
    await service.loadFavorites();

    expect(storageServiceMock.getItem).toHaveBeenCalledTimes(1);
  });

  it('deberia forzar recarga de favoritos cuando force es true', async () => {
    storageServiceMock.getItem.and.returnValues(
      Promise.resolve([lodgingA]),
      Promise.resolve([lodgingB]),
    );

    await service.loadFavorites();
    await service.loadFavorites(true);

    expect(storageServiceMock.getItem).toHaveBeenCalledTimes(2);
    expect(service.favorites()).toEqual([lodgingB]);
  });

  it('deberia alternar favorito y persistirlo', async () => {
    storageServiceMock.getItem.and.resolveTo([]);

    await service.toggleFavorite(lodgingA);
    expect(service.favoritesCount()).toBe(1);
    expect(storageServiceMock.setItem).toHaveBeenCalledTimes(1);

    await service.toggleFavorite(lodgingA);
    expect(service.favoritesCount()).toBe(0);
    expect(storageServiceMock.setItem).toHaveBeenCalledTimes(2);
  });

  it('deberia cargar favoritos antes de alternar si aun no se cargaron', async () => {
    storageServiceMock.getItem.and.resolveTo([lodgingB]);

    await service.toggleFavorite(lodgingA);

    expect(storageServiceMock.getItem).toHaveBeenCalledTimes(1);
    expect(service.favorites()).toEqual([lodgingA, lodgingB]);
  });
});
