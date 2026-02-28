import { TestBed } from '@angular/core/testing';
import { ToastController } from '@ionic/angular/standalone';
import { ToastrService } from './toastr.service';

type ToastCreateOptionsAssert = {
  header?: string;
  icon?: string;
  message?: string;
  color?: string;
  duration?: number;
  position?: string;
};

describe('ToastrService', () => {
  let service: ToastrService;
  let toastControllerMock: jasmine.SpyObj<ToastController>;
  let toastOverlayMock: jasmine.SpyObj<HTMLIonToastElement>;

  beforeEach(() => {
    toastOverlayMock = jasmine.createSpyObj<HTMLIonToastElement>(
      'HTMLIonToastElement',
      ['present'],
    );
    toastOverlayMock.present.and.resolveTo();

    toastControllerMock = jasmine.createSpyObj<ToastController>(
      'ToastController',
      ['create'],
    );
    toastControllerMock.create.and.resolveTo(toastOverlayMock);

    TestBed.configureTestingModule({
      providers: [{ provide: ToastController, useValue: toastControllerMock }],
    });

    service = TestBed.inject(ToastrService);
  });

  it('debería mostrar toast danger con header default', async () => {
    await service.danger('fallo');

    const options = toastControllerMock.create.calls.mostRecent()
      .args[0] as ToastCreateOptionsAssert;

    expect(options.header).toBe('Error');
    expect(options.message).toBe('fallo');
    expect(options.icon).toBe('alert-circle-outline');
    expect(options.color).toBe('danger');
    expect(options.duration).toBe(2500);
    expect(options.position).toBe('top');
    expect(toastOverlayMock.present).toHaveBeenCalled();
  });

  it('debería mostrar toast success', async () => {
    await service.success('ok', 'Exito');

    const options = toastControllerMock.create.calls.mostRecent()
      .args[0] as ToastCreateOptionsAssert;
    expect(options.header).toBe('Exito');
    expect(options.icon).toBe('checkmark-circle-outline');
    expect(options.color).toBe('success');
  });

  it('debería mostrar toast warning e info', async () => {
    await service.warning('cuidado', 'Atencion');
    let options = toastControllerMock.create.calls.mostRecent()
      .args[0] as ToastCreateOptionsAssert;
    expect(options.icon).toBe('warning-outline');
    expect(options.color).toBe('warning');

    await service.info('dato', 'Info');
    options = toastControllerMock.create.calls.mostRecent()
      .args[0] as ToastCreateOptionsAssert;
    expect(options.icon).toBe('information-circle-outline');
    expect(options.color).toBe('secondary');
  });
});
