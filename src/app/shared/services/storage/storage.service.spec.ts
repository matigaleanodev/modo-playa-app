import { TestBed } from '@angular/core/testing';
import { Storage } from '@ionic/storage-angular';
import { createIonicStorageMock } from '@shared/mocks/storage/ionic-storage.mock';
import { StorageService } from './storage.service';

describe('StorageService', () => {
  let service: StorageService;
  let storageMock: ReturnType<typeof createIonicStorageMock>;

  beforeEach(() => {
    storageMock = createIonicStorageMock();
    TestBed.configureTestingModule({
      providers: [{ provide: Storage, useValue: storageMock.storageToken }],
    });

    service = TestBed.inject(StorageService);
  });

  it('debería inicializar storage una sola vez y obtener un valor', async () => {
    storageMock.map.set('key', 'value');

    const first = await service.getItem<string>('key');
    const second = await service.getItem<string>('key');

    expect(first).toBe('value');
    expect(second).toBe('value');
    expect(storageMock.storageToken.create).toHaveBeenCalledTimes(1);
  });

  it('debería guardar y remover valores', async () => {
    await service.setItem('newKey', 99);
    expect(storageMock.map.get('newKey')).toBe(99);

    await service.removeItem('newKey');
    expect(storageMock.map.has('newKey')).toBeFalse();
  });

  it('debería limpiar storage', async () => {
    storageMock.map.set('a', 1);
    storageMock.map.set('b', 2);

    await service.clear();

    expect(storageMock.map.size).toBe(0);
  });
});
