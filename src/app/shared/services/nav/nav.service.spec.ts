import { TestBed } from '@angular/core/testing';
import { NavController } from '@ionic/angular/standalone';
import { NavService } from './nav.service';

describe('NavService', () => {
  let service: NavService;

  const navControllerMock = {
    navigateForward: jasmine.createSpy('navigateForward'),
    back: jasmine.createSpy('back'),
    navigateRoot: jasmine.createSpy('navigateRoot'),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        NavService,
        { provide: NavController, useValue: navControllerMock },
      ],
    });

    service = TestBed.inject(NavService);

    navControllerMock.navigateForward.calls.reset();
    navControllerMock.back.calls.reset();
    navControllerMock.navigateRoot.calls.reset();
  });

  it('deberia crearse correctamente', () => {
    expect(service).toBeTruthy();
  });

  it('deberia navegar hacia adelante con query params opcionales', () => {
    service.forward('/test');

    expect(navControllerMock.navigateForward).toHaveBeenCalledWith('/test', {
      queryParams: undefined,
      animated: true,
      animationDirection: 'forward',
    });
  });

  it('deberia volver hacia atras', () => {
    service.back();

    expect(navControllerMock.back).toHaveBeenCalled();
  });

  it('deberia navegar a root con replaceUrl', () => {
    service.root('/root');

    expect(navControllerMock.navigateRoot).toHaveBeenCalledWith('/root', {
      replaceUrl: true,
    });
  });

  it('deberia volver al home', () => {
    service.volverHome();

    expect(navControllerMock.navigateRoot).toHaveBeenCalledWith('/home', {
      replaceUrl: true,
    });
  });

  it('deberia navegar a search con query valida', () => {
    service.search('  playa  ');

    expect(navControllerMock.navigateForward).toHaveBeenCalledWith('/search', {
      queryParams: { q: 'playa' },
      animated: true,
      animationDirection: 'forward',
    });
  });

  it('no deberia navegar a search con query vacia', () => {
    service.search('   ');

    expect(navControllerMock.navigateForward).not.toHaveBeenCalled();
  });
});
