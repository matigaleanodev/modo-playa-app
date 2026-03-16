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
      this.syncFavoritesWithLodgings(response.data);
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
      this.syncFavoritesWithLodgings(response.data);
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

    const stored = await this.storage.getItem<Lodging[]>(FAVORITE_LODGINGS_KEY);
    const normalizedFavorites = this.normalizeFavoriteLodgings(stored);
    const reconciledFavorites = this.reconcileFavoritesWithLodgings(
      normalizedFavorites,
      this.lodgings(),
    );

    this.favorites.set(reconciledFavorites);
    this.favoritesLoaded.set(true);

    if (!this.areFavoriteCollectionsEqual(stored ?? [], reconciledFavorites)) {
      await this.persistFavorites(reconciledFavorites);
    }
  }

  async toggleFavorite(lodging: Lodging): Promise<void> {
    if (!this.favoritesLoaded()) {
      await this.loadFavorites();
    }

    const current = this.favorites();
    const exists = current.some((item) => item.id === lodging.id);
    const sanitizedLodging = this.sanitizeFavoriteLodging(lodging);
    const next = exists
      ? current.filter((item) => item.id !== lodging.id)
      : sanitizedLodging
        ? [sanitizedLodging, ...current]
        : current;

    this.favorites.set(next);
    await this.persistFavorites(next);
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

  private syncFavoritesWithLodgings(lodgings: Lodging[]): void {
    if (!this.favoritesLoaded() || lodgings.length === 0) {
      return;
    }

    const nextFavorites = this.reconcileFavoritesWithLodgings(
      this.favorites(),
      lodgings,
    );

    if (this.areFavoriteCollectionsEqual(this.favorites(), nextFavorites)) {
      return;
    }

    this.favorites.set(nextFavorites);
    void this.persistFavorites(nextFavorites);
  }

  private reconcileFavoritesWithLodgings(
    favorites: Lodging[],
    lodgings: Lodging[],
  ): Lodging[] {
    if (favorites.length === 0 || lodgings.length === 0) {
      return favorites;
    }

    const lodgingsById = new Map(
      lodgings
        .map((lodging) => this.sanitizeFavoriteLodging(lodging))
        .filter((lodging): lodging is Lodging => Boolean(lodging))
        .map((lodging) => [lodging.id, lodging]),
    );

    return favorites.map((favorite) => lodgingsById.get(favorite.id) ?? favorite);
  }

  private normalizeFavoriteLodgings(stored: Lodging[] | null): Lodging[] {
    if (!Array.isArray(stored)) {
      return [];
    }

    const favoritesById = new Map<string, Lodging>();

    for (const lodging of stored) {
      const sanitizedLodging = this.sanitizeFavoriteLodging(lodging);

      if (!sanitizedLodging) {
        continue;
      }

      favoritesById.set(sanitizedLodging.id, sanitizedLodging);
    }

    return Array.from(favoritesById.values());
  }

  private sanitizeFavoriteLodging(lodging: Lodging | null | undefined): Lodging | null {
    if (!lodging?.id || !lodging.title) {
      return null;
    }

    return {
      ...lodging,
      mainImage: lodging.mainImage?.trim() ?? '',
      images: this.sanitizeImageList(lodging.images),
      mediaImages: this.sanitizeMediaImages(lodging.mediaImages),
      occupiedRanges: lodging.occupiedRanges?.filter(
        (range) => Boolean(range?.from && range?.to),
      ),
    };
  }

  private sanitizeImageList(images: string[] | undefined): string[] {
    if (!Array.isArray(images)) {
      return [];
    }

    return images
      .filter((image): image is string => typeof image === 'string')
      .map((image) => image.trim())
      .filter(Boolean);
  }

  private sanitizeMediaImages(lodgingImages: Lodging['mediaImages']): Lodging['mediaImages'] {
    if (!Array.isArray(lodgingImages)) {
      return undefined;
    }

    const images = lodgingImages
      .filter((image) => Boolean(image?.imageId && image?.createdAt && image?.url))
      .map((image) => ({
        imageId: image.imageId,
        isDefault: Boolean(image.isDefault),
        width: image.width,
        height: image.height,
        createdAt: image.createdAt,
        url: image.url.trim(),
        variants: image.variants
          ? {
              thumb: image.variants.thumb,
              card: image.variants.card,
              hero: image.variants.hero,
            }
          : undefined,
      }))
      .filter((image) => Boolean(image.url));

    return images.length > 0 ? images : undefined;
  }

  private areFavoriteCollectionsEqual(
    current: Lodging[],
    next: Lodging[],
  ): boolean {
    return JSON.stringify(current) === JSON.stringify(next);
  }

  private async persistFavorites(favorites: Lodging[]): Promise<void> {
    await this.storage.setItem(FAVORITE_LODGINGS_KEY, favorites);
  }
}
