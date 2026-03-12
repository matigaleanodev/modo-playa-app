import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { provideRouter } from '@angular/router';
import { HomePage } from './home.page';
import { LodgingsResourceService } from 'src/app/lodgings/services/lodgings-resource.service';
import {
  InfiniteScrollCustomEvent,
  RangeCustomEvent,
  SearchbarCustomEvent,
} from '@ionic/angular';
import {
  Lodging,
  LodgingAmenity,
  LodgingType,
  PriceUnit,
} from 'src/app/lodgings/models/lodging.model';

describe('HomePage', () => {
  let component: HomePage;
  let fixture: ComponentFixture<HomePage>;
  const lodgingMock: Lodging = {
    id: 'lodging-1',
    title: 'Cabana Sur',
    description: 'Descripcion',
    location: 'Paseo 110',
    city: 'Villa Gesell',
    type: LodgingType.CABIN,
    price: 100000,
    priceUnit: PriceUnit.NIGHT,
    maxGuests: 4,
    bedrooms: 2,
    bathrooms: 1,
    minNights: 2,
    amenities: [LodgingAmenity.WIFI, LodgingAmenity.POOL],
    mainImage: 'https://example.com/lodging-1/default-hero.webp',
    images: [
      'https://example.com/lodging-1/default-original.webp',
      'https://example.com/lodging-1/gallery-original.webp',
    ],
    mediaImages: [
      {
        imageId: 'image-1',
        isDefault: true,
        createdAt: '2026-03-12T10:00:00.000Z',
        url: 'https://example.com/lodging-1/default-original.webp',
        variants: {
          thumb: 'https://example.com/lodging-1/default-thumb.webp',
          card: 'https://example.com/lodging-1/default-card.webp',
          hero: 'https://example.com/lodging-1/default-hero.webp',
        },
      },
    ],
  };
  const lodgingBeach: Lodging = {
    ...lodgingMock,
    id: 'lodging-2',
    title: 'Refugio Norte',
    location: 'Avenida Costanera',
    city: 'Mar Azul',
    maxGuests: 6,
    price: 150000,
    amenities: [LodgingAmenity.WIFI],
    mainImage: 'https://example.com/lodging-2/default-hero.webp',
    images: [
      'https://example.com/lodging-2/default-original.webp',
      'https://example.com/lodging-2/gallery-original.webp',
    ],
    mediaImages: [
      {
        imageId: 'image-2',
        isDefault: true,
        createdAt: '2026-03-12T10:15:00.000Z',
        url: 'https://example.com/lodging-2/default-original.webp',
        variants: {
          thumb: 'https://example.com/lodging-2/default-thumb.webp',
          card: 'https://example.com/lodging-2/default-card.webp',
          hero: 'https://example.com/lodging-2/default-hero.webp',
        },
      },
    ],
  };
  const lodgingsResourceMock = {
    lodgings: signal<Lodging[]>([lodgingMock]),
    favoriteIds: signal<Set<string>>(new Set()),
    isLoading: signal(false),
    isLoadingMore: signal(false),
    hasMore: signal(false),
    error: signal<string | null>(null),
    search: signal(''),
    loadFavorites: jasmine.createSpy('loadFavorites').and.resolveTo(undefined),
    loadInitialLodgings: jasmine
      .createSpy('loadInitialLodgings')
      .and.resolveTo(undefined),
    setSearch: jasmine.createSpy('setSearch').and.resolveTo(undefined),
    loadNextLodgingsPage: jasmine
      .createSpy('loadNextLodgingsPage')
      .and.resolveTo(undefined),
    toggleFavorite: jasmine.createSpy('toggleFavorite').and.resolveTo(undefined),
    toLodgingDetail: jasmine.createSpy('toLodgingDetail'),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomePage],
      providers: [
        provideRouter([]),
        {
          provide: LodgingsResourceService,
          useValue: lodgingsResourceMock,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HomePage);
    component = fixture.componentInstance;
    lodgingsResourceMock.toLodgingDetail.calls.reset();
    lodgingsResourceMock.toggleFavorite.calls.reset();
    lodgingsResourceMock.loadFavorites.calls.reset();
    lodgingsResourceMock.loadInitialLodgings.calls.reset();
    lodgingsResourceMock.setSearch.calls.reset();
    lodgingsResourceMock.loadNextLodgingsPage.calls.reset();
    lodgingsResourceMock.error.set(null);
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería renderizar cards de alojamientos', () => {
    const cards = fixture.nativeElement.querySelectorAll('app-lodging-card');
    expect(cards.length).toBe(component.lodgingsFiltered().length);
  });

  it('deberia renderizar bloque de error cuando el recurso informa una falla', () => {
    lodgingsResourceMock.error.set('No pudimos cargar los alojamientos.');
    lodgingsResourceMock.lodgings.set([]);
    fixture.detectChanges();

    const statusCard = fixture.nativeElement.querySelector(
      'app-public-state-card',
    );

    expect(statusCard?.textContent).toContain('No pudimos cargar los alojamientos.');
  });

  it('deberia navegar al detalle del alojamiento', () => {
    component.toLodgingDetail(component.lodgingsRaw()[0]);

    expect(lodgingsResourceMock.toLodgingDetail).toHaveBeenCalledWith(
      component.lodgingsRaw()[0],
    );
  });

  it('deberia cargar favoritos y primera pagina al entrar', async () => {
    lodgingsResourceMock.lodgings.set([]);

    await component.ionViewWillEnter();

    expect(lodgingsResourceMock.loadFavorites).toHaveBeenCalled();
    expect(lodgingsResourceMock.loadInitialLodgings).toHaveBeenCalled();
  });

  it('no deberia recargar primera pagina si ya hay alojamientos', async () => {
    lodgingsResourceMock.lodgings.set([lodgingMock]);

    await component.ionViewWillEnter();

    expect(lodgingsResourceMock.loadFavorites).toHaveBeenCalled();
    expect(lodgingsResourceMock.loadInitialLodgings).not.toHaveBeenCalled();
  });

  it('deberia informar favorito segun favoriteIds', () => {
    lodgingsResourceMock.favoriteIds.set(new Set([lodgingMock.id]));

    expect(component.isFavorite(lodgingMock.id)).toBeTrue();
    expect(component.isFavorite('otro-id')).toBeFalse();
  });

  it('deberia delegar toggleFavorite al recurso', async () => {
    await component.toggleFavorite(lodgingMock);

    expect(lodgingsResourceMock.toggleFavorite).toHaveBeenCalledWith(
      lodgingMock,
    );
  });

  it('deberia cargar siguiente pagina en infinite scroll', async () => {
    const completeSpy = jasmine.createSpy('complete').and.resolveTo(undefined);
    const event = {
      target: { complete: completeSpy, disabled: false },
    } as unknown as InfiniteScrollCustomEvent;

    await component.onInfiniteScroll(event);

    expect(lodgingsResourceMock.loadNextLodgingsPage).toHaveBeenCalled();
    expect(event.target.disabled).toBeTrue();
    expect(completeSpy).toHaveBeenCalled();
  });

  it('deberia buscar con backend y actualizar searchTerm', async () => {
    const event = {
      detail: { value: 'mar azul' },
    } as SearchbarCustomEvent;

    await component.onSearchInput(event as unknown as Event);

    expect(component.searchTerm()).toBe('mar azul');
    expect(lodgingsResourceMock.setSearch).toHaveBeenCalledWith('mar azul');
  });

  it('deberia reintentar la carga del catalogo con el termino actual', async () => {
    component.searchTerm.set('gesell');

    await component.retry();

    expect(lodgingsResourceMock.loadInitialLodgings).toHaveBeenCalledWith(
      'gesell',
    );
  });

  it('no deberia disparar busqueda si el termino no cambia', async () => {
    component.searchTerm.set('mar azul');
    const event = {
      detail: { value: '  mar azul  ' },
    } as SearchbarCustomEvent;

    await component.onSearchInput(event as unknown as Event);

    expect(lodgingsResourceMock.setSearch).not.toHaveBeenCalled();
  });

  it('deberia resolver busqueda local por ubicacion y ciudad', () => {
    lodgingsResourceMock.lodgings.set([lodgingMock, lodgingBeach]);
    component.searchTerm.set('costanera');

    expect(component.searchMatchedLodgings()).toEqual([lodgingBeach]);

    component.searchTerm.set('mar azul');

    expect(component.searchMatchedLodgings()).toEqual([lodgingBeach]);
  });

  it('deberia filtrar localmente por amenidades, precio y huespedes', () => {
    lodgingsResourceMock.lodgings.set([lodgingMock, lodgingBeach]);

    component.toggleAmenity(LodgingAmenity.POOL);
    component.onPriceRangeChange({
      detail: { value: { lower: 90000, upper: 120000 } },
    } as RangeCustomEvent as unknown as Event);
    component.increaseGuests();
    component.increaseGuests();
    component.increaseGuests();
    component.increaseGuests();

    expect(component.lodgingsFiltered()).toEqual([lodgingMock]);
  });

  it('deberia remover chips de filtros activos', () => {
    component.toggleAmenity(LodgingAmenity.WIFI);
    component.increaseGuests();

    const chips = component.activeFilters();
    component.removeFilter(chips[0]);
    component.removeFilter(chips[1]);

    expect(component.filters().amenities).toEqual([]);
    expect(component.filters().guests).toBeNull();
  });

  it('deberia abrir y cerrar el panel de filtros', () => {
    component.openFilters();
    expect(component.isFiltersOpen()).toBeTrue();

    component.closeFilters();
    expect(component.isFiltersOpen()).toBeFalse();
  });

  it('deberia limpiar todos los filtros activos', () => {
    component.toggleAmenity(LodgingAmenity.WIFI);
    component.onPriceRangeChange({
      detail: { value: { lower: 90000, upper: 120000 } },
    } as RangeCustomEvent as unknown as Event);
    component.increaseGuests();

    component.clearFilters();

    expect(component.filters()).toEqual({
      amenities: [],
      minPrice: null,
      maxPrice: null,
      guests: null,
    });
    expect(component.hasActiveFilters()).toBeFalse();
  });

  it('deberia resetear busqueda y filtros para volver al catalogo completo', async () => {
    component.searchTerm.set('mar azul');
    component.toggleAmenity(LodgingAmenity.WIFI);

    await component.resetSearchAndFilters();

    expect(component.searchTerm()).toBe('');
    expect(component.filters()).toEqual({
      amenities: [],
      minPrice: null,
      maxPrice: null,
      guests: null,
    });
    expect(lodgingsResourceMock.setSearch).toHaveBeenCalledWith('');
  });

  it('deberia renderizar el overlay propio de filtros cuando esta abierto', () => {
    component.openFilters();
    fixture.detectChanges();

    const overlay = fixture.nativeElement.querySelector('.filters-overlay');
    const heading = fixture.nativeElement.querySelector('.filter-section h3');

    expect(overlay).not.toBeNull();
    expect(heading?.textContent?.trim()).toBe('Comodidades');
  });
});
