import { TestBed, fakeAsync, flushMicrotasks } from '@angular/core/testing';
import { installMatchMediaMock } from '@shared/mocks/browser/match-media.mock';
import { StorageServiceMock } from '@shared/mocks/storage/storage-service.mock';
import { StorageService } from '../storage/storage.service';
import { ThemeService } from './theme.service';

describe('ThemeService', () => {
  let service: ThemeService;
  let storageMock: StorageServiceMock;
  const rootElement = document.documentElement;
  let matchMediaController = installMatchMediaMock();

  beforeEach(() => {
    storageMock = new StorageServiceMock();
    rootElement.classList.remove('ion-palette-dark');
    matchMediaController = installMatchMediaMock(false);

    TestBed.configureTestingModule({
      providers: [{ provide: StorageService, useValue: storageMock }],
    });
  });

  afterEach(() => {
    rootElement.classList.remove('ion-palette-dark');
    matchMediaController.restore();
  });

  it('debería iniciar en system cuando no hay valor en storage', fakeAsync(() => {
    service = TestBed.inject(ThemeService);
    flushMicrotasks();

    expect(service.currentTheme()).toBe('system');
    expect(rootElement.classList.contains('ion-palette-dark')).toBeFalse();
  }));

  it('debería aplicar tema guardado en storage', fakeAsync(() => {
    storageMock.withTheme('dark');

    service = TestBed.inject(ThemeService);
    flushMicrotasks();

    expect(service.currentTheme()).toBe('dark');
    expect(rootElement.classList.contains('ion-palette-dark')).toBeTrue();
  }));

  it('debería guardar y aplicar tema al cambiar manualmente', fakeAsync(() => {
    service = TestBed.inject(ThemeService);
    flushMicrotasks();

    service.setTheme('dark');
    flushMicrotasks();

    expect(service.currentTheme()).toBe('dark');
    expect(storageMock.setItemSpy).toHaveBeenCalledWith('theme', 'dark');
    expect(rootElement.classList.contains('ion-palette-dark')).toBeTrue();
  }));

  it('debería reaccionar al cambio del sistema cuando el tema es system', fakeAsync(() => {
    service = TestBed.inject(ThemeService);
    flushMicrotasks();

    expect(rootElement.classList.contains('ion-palette-dark')).toBeFalse();

    matchMediaController.dispatch(true);
    expect(rootElement.classList.contains('ion-palette-dark')).toBeTrue();
  }));
});
