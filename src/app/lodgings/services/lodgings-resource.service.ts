import { computed, inject, Injectable, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import {
  Lodging,
  PaginatedResponse,
  PublicLodgingsQuery,
} from '../models/lodging.model';
import { LodgingsService } from './lodgings.service';
import { NavService } from '@shared/services/nav/nav.service';
import { StorageService } from '@shared/services/storage/storage.service';
import {
  getHomeLodgingsErrorMessage,
  getLoadMoreLodgingsErrorMessage,
} from '@shared/http/public-api-error';

const LODGINGS_PAGE_SIZE = 8;
const FAVORITE_LODGINGS_KEY = 'favorite_lodgings';

@Injectable({
  providedIn: 'root',
})
export class LodgingsResourceService {
  private readonly api = inject(LodgingsService);
  private readonly nav = inject(NavService);
  private readonly storage = inject(StorageService);

  readonly lodgings = signal<Lodging[]>([]);
  readonly selectedLodging = signal<Lodging | null>(null);
  readonly favorites = signal<Lodging[]>([]);

  readonly isLoading = signal(false);
  readonly isLoadingMore = signal(false);
  readonly hasMore = signal(true);
  readonly search = signal('');
  readonly error = signal<string | null>(null);

  private readonly currentPage = signal(1);
  private readonly total = signal(0);
  private readonly favoritesLoaded = signal(false);

  readonly favoriteIds = computed(
    () => new Set(this.favorites().map((lodging) => lodging.id)),
  );

  readonly favoritesCount = computed(() => this.favorites().length);

  async loadInitialLodgings(search = this.search()): Promise<void> {
    const normalizedSearch = this.normalizeSearch(search);

    this.isLoading.set(true);
    this.error.set(null);
    this.currentPage.set(1);
    this.search.set(normalizedSearch);

    try {
      const response = await firstValueFrom(
        this.api.getPaginated(
          this.buildPaginatedQuery({
            page: 1,
            search: normalizedSearch,
          }),
        ),
      );

      this.currentPage.set(response.page);
      this.total.set(response.total);
      this.lodgings.set(response.data);
      this.hasMore.set(this.shouldKeepLoading(response, response.data.length));
    } catch (error) {
      this.total.set(0);
      this.lodgings.set([]);
      this.hasMore.set(false);
      this.error.set(getHomeLodgingsErrorMessage(error));
    } finally {
      this.isLoading.set(false);
    }
  }

  async loadNextLodgingsPage(): Promise<void> {
    if (!this.hasMore() || this.isLoading() || this.isLoadingMore()) {
      return;
    }

    this.isLoadingMore.set(true);
    this.error.set(null);

    try {
      const nextPage = this.currentPage() + 1;
      const response = await firstValueFrom(
        this.api.getPaginated(
          this.buildPaginatedQuery({
            page: nextPage,
            search: this.search(),
          }),
        ),
      );

      this.currentPage.set(response.page);
      this.total.set(response.total);

      const merged = this.mergeUniqueLodgings(this.lodgings(), response.data);
      this.lodgings.set(merged);
      this.hasMore.set(this.shouldKeepLoading(response, merged.length));
    } catch (error) {
      this.error.set(getLoadMoreLodgingsErrorMessage(error));
    } finally {
      this.isLoadingMore.set(false);
    }
  }

  selectLodging(lodging: Lodging): void {
    this.selectedLodging.set(lodging);
  }

  async setSearch(search: string): Promise<void> {
    await this.loadInitialLodgings(search);
  }

  toLodgingDetail(lodging: Lodging): void {
    this.selectLodging(lodging);
    this.nav.forward(`/lodging/${lodging.id}`);
  }

  isFavorite(lodgingId: string): boolean {
    return this.favoriteIds().has(lodgingId);
  }

  async loadFavorites(force = false): Promise<void> {
    if (this.favoritesLoaded() && !force) {
      return;
    }

    const stored =
      (await this.storage.getItem<Lodging[]>(FAVORITE_LODGINGS_KEY)) ?? [];
    this.favorites.set(stored);
    this.favoritesLoaded.set(true);
  }

  async toggleFavorite(lodging: Lodging): Promise<void> {
    if (!this.favoritesLoaded()) {
      await this.loadFavorites();
    }

    const current = this.favorites();
    const exists = current.some((item) => item.id === lodging.id);
    const next = exists
      ? current.filter((item) => item.id !== lodging.id)
      : [lodging, ...current];

    this.favorites.set(next);
    await this.storage.setItem(FAVORITE_LODGINGS_KEY, next);
  }

  private shouldKeepLoading(
    response: PaginatedResponse<Lodging>,
    loadedCount: number,
  ): boolean {
    if (response.data.length === 0) {
      return false;
    }

    return loadedCount < response.total;
  }

  private mergeUniqueLodgings(
    current: Lodging[],
    incoming: Lodging[],
  ): Lodging[] {
    const byId = new Map<string, Lodging>();

    for (const lodging of current) {
      byId.set(lodging.id, lodging);
    }

    for (const lodging of incoming) {
      byId.set(lodging.id, lodging);
    }

    return Array.from(byId.values());
  }

  private buildPaginatedQuery(
    query: Pick<PublicLodgingsQuery, 'page' | 'search'>,
  ): PublicLodgingsQuery {
    const paginatedQuery: PublicLodgingsQuery = {
      page: query.page,
      limit: LODGINGS_PAGE_SIZE,
    };

    if (query.search) {
      paginatedQuery.search = query.search;
    }

    return paginatedQuery;
  }

  private normalizeSearch(search: string): string {
    return search.trim();
  }
}
