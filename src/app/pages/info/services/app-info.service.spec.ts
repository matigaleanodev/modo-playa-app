import { TestBed } from '@angular/core/testing';
import { environment } from 'src/environments/environment';
import { AppInfoService } from './app-info.service';

describe('AppInfoService', () => {
  let service: AppInfoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AppInfoService);
  });

  it('debería devolver la versión del environment en web', async () => {
    spyOn<any>(service, 'isNativePlatform').and.returnValue(false);

    await expectAsync(service.getAppVersion()).toBeResolvedTo(
      environment.appVersion,
    );
  });

  it('debería devolver la versión nativa en mobile', async () => {
    spyOn<any>(service, 'isNativePlatform').and.returnValue(true);
    spyOn<any>(service, 'readNativeAppVersion').and.resolveTo('9.9.9');

    await expectAsync(service.getAppVersion()).toBeResolvedTo('9.9.9');
  });

  it('debería usar fallback del environment si falla la lectura nativa', async () => {
    spyOn<any>(service, 'isNativePlatform').and.returnValue(true);
    spyOn<any>(service, 'readNativeAppVersion').and.rejectWith(
      new Error('native unavailable'),
    );

    await expectAsync(service.getAppVersion()).toBeResolvedTo(
      environment.appVersion,
    );
  });
});
