import { Storage } from '@ionic/storage-angular';

export interface IonicStorageMockContext {
  storageToken: jasmine.SpyObj<Storage>;
  map: Map<string, unknown>;
}

export function createIonicStorageMock(): IonicStorageMockContext {
  const map = new Map<string, unknown>();

  const createdStorage = {
    get: jasmine
      .createSpy('get')
      .and.callFake(async (key: string): Promise<unknown> => map.get(key)),
    set: jasmine
      .createSpy('set')
      .and.callFake(async (key: string, value: unknown): Promise<void> => {
        map.set(key, value);
      }),
    remove: jasmine
      .createSpy('remove')
      .and.callFake(async (key: string): Promise<void> => {
        map.delete(key);
      }),
    clear: jasmine.createSpy('clear').and.callFake(async (): Promise<void> => {
      map.clear();
    }),
  };

  const storageToken = jasmine.createSpyObj<Storage>('Storage', ['create']);
  storageToken.create.and.resolveTo(createdStorage as unknown as Storage);

  return { storageToken, map };
}
