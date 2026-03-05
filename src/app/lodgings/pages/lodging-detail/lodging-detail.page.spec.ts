import { provideRouter } from '@angular/router';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LodgingDetailPage } from './lodging-detail.page';
import { LodgingsResourceService } from '../../services/lodgings-resource.service';
import {
  Lodging,
  LodgingAmenity,
  LodgingType,
  PriceUnit,
} from '../../models/lodging.model';

describe('LodgingDetailPage', () => {
  let component: LodgingDetailPage;
  let fixture: ComponentFixture<LodgingDetailPage>;
  const lodgingsResourceMock = {
    isFavorite: jasmine.createSpy('isFavorite').and.returnValue(false),
    loadFavorites: jasmine.createSpy('loadFavorites').and.resolveTo(undefined),
    toggleFavorite: jasmine.createSpy('toggleFavorite').and.resolveTo(undefined),
  };
  const lodgingMock: Lodging = {
    id: 'lodging-42',
    title: 'Casa de prueba',
    description: 'Descripcion de prueba',
    location: 'Calle 1',
    city: 'Villa Gesell',
    type: LodgingType.HOUSE,
    price: 120000,
    priceUnit: PriceUnit.NIGHT,
    maxGuests: 4,
    bedrooms: 2,
    bathrooms: 1,
    minNights: 2,
    distanceToBeach: 200,
    amenities: [LodgingAmenity.WIFI, LodgingAmenity.POOL],
    mainImage: 'https://example.com/main.webp',
    images: ['https://example.com/1.webp', 'https://example.com/main.webp'],
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LodgingDetailPage],
      providers: [
        provideRouter([]),
        {
          provide: LodgingsResourceService,
          useValue: lodgingsResourceMock,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LodgingDetailPage);
    component = fixture.componentInstance;
    lodgingsResourceMock.isFavorite.calls.reset();
    lodgingsResourceMock.loadFavorites.calls.reset();
    lodgingsResourceMock.toggleFavorite.calls.reset();
    fixture.componentRef.setInput('lodging', lodgingMock);
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería exponer imágenes secundarias en galería', () => {
    expect(component.galleryImages).toEqual(['https://example.com/1.webp']);
  });

  it('deberia cargar favoritos al entrar', async () => {
    await component.ionViewWillEnter();

    expect(lodgingsResourceMock.loadFavorites).toHaveBeenCalled();
  });

  it('deberia delegar toggleFavorite al recurso', async () => {
    await component.toggleFavorite();

    expect(lodgingsResourceMock.toggleFavorite).toHaveBeenCalledWith(
      lodgingMock,
    );
  });

  it('deberia consultar estado favorito para el alojamiento', () => {
    component.isFavorite();

    expect(lodgingsResourceMock.isFavorite).toHaveBeenCalledWith(lodgingMock.id);
  });
});
