import { HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import {
  ActivatedRouteSnapshot,
  convertToParamMap,
  RedirectCommand,
  Router,
} from '@angular/router';
import { throwError } from 'rxjs';
import { NavService } from '@shared/services/nav/nav.service';
import { ToastrService } from '@shared/services/toastr/toastr.service';
import { LodgingsService } from '../services/lodgings.service';
import { lodgingResolver } from './lodging.resolver';

describe('lodgingResolver', () => {
  const lodgingsServiceMock = {
    getById: jasmine.createSpy('getById'),
  };
  const toastrMock = {
    danger: jasmine.createSpy('danger').and.resolveTo(undefined),
  };
  const navMock = {
    root: jasmine.createSpy('root'),
  };
  const routerMock = {
    parseUrl: jasmine.createSpy('parseUrl').and.returnValue('/home-url-tree'),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: LodgingsService, useValue: lodgingsServiceMock },
        { provide: ToastrService, useValue: toastrMock },
        { provide: NavService, useValue: navMock },
        { provide: Router, useValue: routerMock },
      ],
    });

    lodgingsServiceMock.getById.calls.reset();
    toastrMock.danger.calls.reset();
    navMock.root.calls.reset();
    routerMock.parseUrl.calls.reset();
  });

  it('deberia redirigir al home y mostrar toast si el alojamiento no existe', async () => {
    lodgingsServiceMock.getById.and.returnValue(
      throwError(
        () =>
          new HttpErrorResponse({
            status: 404,
            error: { code: 'LODGING_NOT_FOUND' },
          }),
      ),
    );

    const route = {
      paramMap: convertToParamMap({ id: 'invalid-id' }),
    } as ActivatedRouteSnapshot;

    const result = await TestBed.runInInjectionContext(() =>
      lodgingResolver(route, {} as never),
    );

    expect(toastrMock.danger).toHaveBeenCalledWith(
      'El alojamiento que buscabas ya no está disponible.',
    );
    expect(navMock.root).toHaveBeenCalledWith('/home');
    expect(routerMock.parseUrl).toHaveBeenCalledWith('/home');
    expect(result instanceof RedirectCommand).toBeTrue();
  });
});
