import { DOCUMENT } from '@angular/common';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private readonly document = inject(DOCUMENT);

  private get storage(): Storage | null {
    return this.document.defaultView?.localStorage ?? null;
  }

  async getItem<T>(key: string): Promise<T | null> {
    const value = this.storage?.getItem(key) ?? null;

    if (value === null) {
      return null;
    }

    try {
      return JSON.parse(value) as T;
    } catch {
      return null;
    }
  }

  async setItem<T>(key: string, value: T): Promise<void> {
    this.storage?.setItem(key, JSON.stringify(value));
  }

  async removeItem(key: string): Promise<void> {
    this.storage?.removeItem(key);
  }

  async clear(): Promise<void> {
    this.storage?.clear();
  }
}
