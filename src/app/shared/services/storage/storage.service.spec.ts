import { TestBed } from '@angular/core/testing';
import { StorageService } from './storage.service';

describe('StorageService', () => {
  let service: StorageService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});

    service = TestBed.inject(StorageService);
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('debería obtener un valor serializado', async () => {
    localStorage.setItem('key', JSON.stringify('value'));

    const first = await service.getItem<string>('key');
    const second = await service.getItem<string>('key');

    expect(first).toBe('value');
    expect(second).toBe('value');
  });

  it('debería guardar y remover valores', async () => {
    await service.setItem('newKey', 99);
    expect(localStorage.getItem('newKey')).toBe('99');

    await service.removeItem('newKey');
    expect(localStorage.getItem('newKey')).toBeNull();
  });

  it('debería limpiar storage', async () => {
    localStorage.setItem('a', JSON.stringify(1));
    localStorage.setItem('b', JSON.stringify(2));

    await service.clear();

    expect(localStorage.length).toBe(0);
  });

  it('debería devolver null si el valor persistido no es JSON válido', async () => {
    localStorage.setItem('broken', '{not-json');

    const value = await service.getItem('broken');

    expect(value).toBeNull();
  });
});
