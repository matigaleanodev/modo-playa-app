import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { provideRouter } from '@angular/router';
import { HomePage } from './home.page';
import { LodgingsResourceService } from 'src/app/lodgings/services/lodgings-resource.service';
import { Lodging, LodgingType, PriceUnit } from 'src/app/lodgings/models/lodging.model';
import { InfiniteScrollCustomEvent } from '@ionic/angular';

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
    amenities: [],
    mainImage: 'https://example.com/main.webp',
    images: [],
  };
  const lodgingsResourceMock = {
    lodgings: signal<Lodging[]>([lodgingMock]),
    favoriteIds: signal<Set<string>>(new Set()),
    isLoading: signal(false),
    isLoadingMore: signal(false),
    hasMore: signal(false),
    loadFavorites: jasmine.createSpy('loadFavorites').and.resolveTo(undefined),
    loadInitialLodgings: jasmine
      .createSpy('loadInitialLodgings')
      .and.resolveTo(undefined),
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
    lodgingsResourceMock.loadNextLodgingsPage.calls.reset();
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería renderizar cards de alojamientos', () => {
    const cards = fixture.nativeElement.querySelectorAll('app-lodging-card');
    expect(cards.length).toBe(component.lodgings().length);
  });

  it('deberia navegar al detalle del alojamiento', () => {
    component.toLodgingDetail(component.lodgings()[0]);

    expect(lodgingsResourceMock.toLodgingDetail).toHaveBeenCalledWith(
      component.lodgings()[0],
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
});
