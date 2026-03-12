import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from 'src/environments/environment';
import {
  Lodging,
  LodgingAmenity,
  LodgingType,
  PaginatedResponse,
  PriceUnit,
} from '../models/lodging.model';
import { LodgingsService } from './lodgings.service';

describe('LodgingsService', () => {
  let service: LodgingsService;
  let httpMock: HttpTestingController;

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
    amenities: [LodgingAmenity.WIFI],
    mainImage: 'https://example.com/media/default-hero.webp',
    images: [
      'https://example.com/media/default-original.webp',
      'https://example.com/media/gallery-original.webp',
    ],
    mediaImages: [
      {
        imageId: 'image-1',
        isDefault: true,
        createdAt: '2026-03-12T10:00:00.000Z',
        url: 'https://example.com/media/default-original.webp',
        variants: {
          thumb: 'https://example.com/media/default-thumb.webp',
          card: 'https://example.com/media/default-card.webp',
          hero: 'https://example.com/media/default-hero.webp',
        },
      },
      {
        imageId: 'image-2',
        isDefault: false,
        createdAt: '2026-03-12T10:05:00.000Z',
        url: 'https://example.com/media/gallery-original.webp',
        variants: {
          thumb: 'https://example.com/media/gallery-thumb.webp',
          card: 'https://example.com/media/gallery-card.webp',
          hero: 'https://example.com/media/gallery-hero.webp',
        },
      },
    ],
  };

  const paginatedResponseMock: PaginatedResponse<Lodging> = {
    data: [lodgingMock],
    total: 1,
    page: 1,
    limit: 10,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LodgingsService, provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(LodgingsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('debería solicitar listado paginado con params válidos', () => {
    service
      .getPaginated({
        city: 'Villa Gesell',
        tag: ['mar', ''],
        minGuests: 2,
        search: '',
      })
      .subscribe();

    const req = httpMock.expectOne(
      `${environment.API_URL}/lodgings?city=Villa%20Gesell&tag=mar&minGuests=2`,
    );

    expect(req.request.method).toBe('GET');
    expect(req.request.params.getAll('tag')).toEqual(['mar']);
    expect(req.request.params.has('search')).toBeFalse();
    req.flush(paginatedResponseMock);
  });

  it('debería solicitar detalle por id', () => {
    service.getById('abc').subscribe();

    const req = httpMock.expectOne(`${environment.API_URL}/lodgings/abc`);
    expect(req.request.method).toBe('GET');
    req.flush(lodgingMock);
  });
});
