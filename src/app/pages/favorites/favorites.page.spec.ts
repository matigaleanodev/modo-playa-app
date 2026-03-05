import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { provideRouter } from '@angular/router';
import {
  Lodging,
  LodgingType,
  PriceUnit,
} from 'src/app/lodgings/models/lodging.model';
import { LodgingsResourceService } from 'src/app/lodgings/services/lodgings-resource.service';
import { FavoritesPage } from './favorites.page';

describe('FavoritesPage', () => {
  let component: FavoritesPage;
  let fixture: ComponentFixture<FavoritesPage>;
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
    favorites: signal<Lodging[]>([]),
    loadFavorites: jasmine.createSpy('loadFavorites').and.resolveTo(undefined),
    toLodgingDetail: jasmine.createSpy('toLodgingDetail'),
    toggleFavorite: jasmine.createSpy('toggleFavorite').and.resolveTo(undefined),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FavoritesPage],
      providers: [
        provideRouter([]),
        {
          provide: LodgingsResourceService,
          useValue: lodgingsResourceMock,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FavoritesPage);
    component = fixture.componentInstance;
    lodgingsResourceMock.loadFavorites.calls.reset();
    lodgingsResourceMock.toLodgingDetail.calls.reset();
    lodgingsResourceMock.toggleFavorite.calls.reset();
    lodgingsResourceMock.favorites.set([]);
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('deberia cargar favoritos al entrar', async () => {
    await component.ionViewWillEnter();

    expect(lodgingsResourceMock.loadFavorites).toHaveBeenCalled();
  });

  it('deberia delegar navegacion al detalle', () => {
    component.toLodgingDetail(lodgingMock);

    expect(lodgingsResourceMock.toLodgingDetail).toHaveBeenCalledWith(
      lodgingMock,
    );
  });

  it('deberia delegar toggleFavorite al recurso', async () => {
    await component.toggleFavorite(lodgingMock);

    expect(lodgingsResourceMock.toggleFavorite).toHaveBeenCalledWith(
      lodgingMock,
    );
  });

  it('deberia indicar hasFavorites cuando hay elementos', () => {
    lodgingsResourceMock.favorites.set([lodgingMock]);

    expect(component.hasFavorites()).toBeTrue();
  });

  it('deberia renderizar estado vacio cuando no hay favoritos', () => {
    fixture.detectChanges();

    const emptyState = fixture.nativeElement.querySelector('.empty-state');
    const cards = fixture.nativeElement.querySelectorAll('app-lodging-card');

    expect(emptyState).not.toBeNull();
    expect(cards.length).toBe(0);
  });

  it('deberia renderizar cards cuando hay favoritos', () => {
    lodgingsResourceMock.favorites.set([lodgingMock]);
    fixture.detectChanges();

    const emptyState = fixture.nativeElement.querySelector('.empty-state');
    const cards = fixture.nativeElement.querySelectorAll('app-lodging-card');

    expect(emptyState).toBeNull();
    expect(cards.length).toBe(1);
  });
});
