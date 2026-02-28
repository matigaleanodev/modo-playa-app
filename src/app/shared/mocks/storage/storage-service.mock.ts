import { ThemeMode } from '@shared/services/theme/theme.service';

export class StorageServiceMock {
  readonly getItemSpy = jasmine.createSpy('getItem').and.resolveTo(null);
  readonly setItemSpy = jasmine.createSpy('setItem').and.resolveTo();
  readonly removeItemSpy = jasmine.createSpy('removeItem').and.resolveTo();
  readonly clearSpy = jasmine.createSpy('clear').and.resolveTo();

  getItem<T>(key: string): Promise<T | null> {
    return this.getItemSpy(key) as Promise<T | null>;
  }

  setItem<T>(key: string, value: T): Promise<void> {
    return this.setItemSpy(key, value) as Promise<void>;
  }

  removeItem(key: string): Promise<void> {
    return this.removeItemSpy(key) as Promise<void>;
  }

  clear(): Promise<void> {
    return this.clearSpy() as Promise<void>;
  }

  withTheme(theme: ThemeMode | null): void {
    this.getItemSpy.and.resolveTo(theme);
  }
}
