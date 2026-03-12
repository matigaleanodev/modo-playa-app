import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from 'src/environments/environment';
import { DestinationsService } from './destinations.service';

describe('DestinationsService', () => {
  let service: DestinationsService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DestinationsService, provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(DestinationsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('deberia solicitar el listado de destinos', () => {
    service.getDestinations().subscribe();

    const req = httpMock.expectOne(`${environment.API_URL}/destinations`);
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });

  it('deberia solicitar el contexto de un destino por id', () => {
    service.getContextByDestinationId('pampas').subscribe();

    const req = httpMock.expectOne(`${environment.API_URL}/destinations/pampas/context`);
    expect(req.request.method).toBe('GET');
    req.flush({
      destinationId: 'pampas',
      destination: 'Mar de las Pampas',
      timezone: 'America/Argentina/Buenos_Aires',
      weather: { temperature: 27, windSpeed: 14, weatherCode: 3 },
      forecast: [],
      sun: { sunrise: '06:12', sunset: '20:05' },
    });
  });
});
