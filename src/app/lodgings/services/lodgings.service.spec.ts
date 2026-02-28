import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from 'src/environments/environment';
import { LodgingsService } from './lodgings.service';

describe('LodgingsService', () => {
  let service: LodgingsService;
  let httpMock: HttpTestingController;

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
    req.flush({ data: [], total: 0, page: 1, limit: 10 });
  });

  it('debería solicitar detalle por id', () => {
    service.getById('abc').subscribe();

    const req = httpMock.expectOne(`${environment.API_URL}/lodgings/abc`);
    expect(req.request.method).toBe('GET');
    req.flush({});
  });
});
