import { provideRouter } from '@angular/router';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LodgingDetailPage } from './lodging-detail.page';
import {
  Lodging,
  LodgingAmenity,
  LodgingType,
  PriceUnit,
} from '../../models/lodging.model';

describe('LodgingDetailPage', () => {
  let component: LodgingDetailPage;
  let fixture: ComponentFixture<LodgingDetailPage>;
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
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(LodgingDetailPage);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('lodging', lodgingMock);
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería exponer imágenes secundarias en galería', () => {
    expect(component.galleryImages).toEqual(['https://example.com/1.webp']);
  });
});
