import { CurrencyPipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import {
  IonButton,
  IonButtons,
  IonChip,
  IonContent,
  IonHeader,
  IonIcon,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonLabel,
  IonMenuButton,
  IonRange,
  IonSearchbar,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { LodgingCardComponent } from 'src/app/lodgings/components/lodging-card/lodging-card.component';
import { Lodging, LodgingAmenity } from 'src/app/lodgings/models/lodging.model';
import { LodgingsResourceService } from 'src/app/lodgings/services/lodgings-resource.service';
import { LodgingCardSkeletonComponent } from 'src/app/lodgings/components/lodging-card-skeleton/lodging-card-skeleton.component';
import {
  InfiniteScrollCustomEvent,
  RangeCustomEvent,
  SearchbarCustomEvent,
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import {
  add,
  close,
  optionsOutline,
  remove,
  trashOutline,
} from 'ionicons/icons';
import {
  ActiveFilterChip,
  HomeFilters,
  applyPriceRange,
  createDefaultHomeFilters,
  decreaseGuests,
  filterLodgings,
  getActiveFilters,
  getAmenityLabel,
  getPriceBounds,
  getPriceRangeValue,
  getSearchMatchedLodgings,
  increaseGuests,
  removeFilter,
  toggleAmenity,
} from './home-filters';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  imports: [
    CurrencyPipe,
    IonButton,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonChip,
    IonMenuButton,
    IonContent,
    IonIcon,
    IonInfiniteScroll,
    IonInfiniteScrollContent,
    IonLabel,
    IonRange,
    IonSearchbar,
    LodgingCardComponent,
    LodgingCardSkeletonComponent,
  ],
})
export class HomePage {
  private readonly lodgingsResource = inject(LodgingsResourceService);

  readonly lodgingsRaw = computed(() => this.lodgingsResource.lodgings());
  readonly favoriteIds = computed(() => this.lodgingsResource.favoriteIds());
  readonly isLoading = computed(() => this.lodgingsResource.isLoading());
  readonly isLoadingMore = computed(() => this.lodgingsResource.isLoadingMore());
  readonly hasMore = computed(() => this.lodgingsResource.hasMore());
  readonly error = computed(() => this.lodgingsResource.error());
  readonly searchTerm = signal('');
  readonly isFiltersOpen = signal(false);
  readonly filters = signal<HomeFilters>(createDefaultHomeFilters());
  readonly amenityOptions = Object.values(LodgingAmenity);
  readonly skeletonCards = Array.from({ length: 4 });
  readonly searchMatchedLodgings = computed(() => {
    return getSearchMatchedLodgings(this.lodgingsRaw(), this.searchTerm());
  });
  readonly lodgingsFiltered = computed(() => {
    return filterLodgings(this.searchMatchedLodgings(), this.filters());
  });
  readonly priceBounds = computed(() => getPriceBounds(this.searchMatchedLodgings()));
  readonly priceRangeValue = computed(() =>
    getPriceRangeValue(this.filters(), this.priceBounds()),
  );
  readonly activeFilters = computed<ActiveFilterChip[]>(() =>
    getActiveFilters(this.filters(), this.priceBounds()),
  );
  readonly activeFiltersCount = computed(() => this.activeFilters().length);
  readonly hasActiveFilters = computed(() => this.activeFiltersCount() > 0);
  readonly filtersButtonLabel = computed(() => {
    const count = this.activeFiltersCount();
    return count > 0 ? `Filtros (${count})` : 'Filtros';
  });

  constructor() {
    addIcons({
      add,
      close,
      optionsOutline,
      remove,
      trashOutline,
    });
  }

  async ionViewWillEnter(): Promise<void> {
    await this.lodgingsResource.loadFavorites();

    if (this.lodgingsRaw().length === 0) {
      await this.lodgingsResource.loadInitialLodgings(this.searchTerm());
    }
  }

  toLodgingDetail(lodging: Lodging): void {
    this.lodgingsResource.toLodgingDetail(lodging);
  }

  isFavorite(lodgingId: string): boolean {
    return this.favoriteIds().has(lodgingId);
  }

  async toggleFavorite(lodging: Lodging): Promise<void> {
    await this.lodgingsResource.toggleFavorite(lodging);
  }

  async onSearchInput(event: Event): Promise<void> {
    const searchbarEvent = event as SearchbarCustomEvent;
    const nextTerm = (searchbarEvent.detail.value ?? '').trim();

    if (nextTerm === this.searchTerm()) {
      return;
    }

    this.searchTerm.set(nextTerm);
    await this.lodgingsResource.setSearch(nextTerm);
  }

  openFilters(): void {
    this.isFiltersOpen.set(true);
  }

  closeFilters(): void {
    this.isFiltersOpen.set(false);
  }

  toggleAmenity(amenity: LodgingAmenity): void {
    this.filters.update((filters) => toggleAmenity(filters, amenity));
  }

  hasAmenitySelected(amenity: LodgingAmenity): boolean {
    return this.filters().amenities.includes(amenity);
  }

  onPriceRangeChange(event: Event): void {
    const rangeEvent = event as RangeCustomEvent;
    const value = rangeEvent.detail.value;

    if (typeof value === 'number') {
      return;
    }

    this.filters.update((filters) =>
      applyPriceRange(filters, value, this.priceBounds()),
    );
  }

  decreaseGuests(): void {
    this.filters.update((filters) => decreaseGuests(filters));
  }

  increaseGuests(): void {
    this.filters.update((filters) => increaseGuests(filters));
  }

  clearFilters(): void {
    this.filters.set(createDefaultHomeFilters());
  }

  removeFilter(chip: ActiveFilterChip): void {
    this.filters.update((filters) => removeFilter(filters, chip));
  }

  trackByAmenity(_index: number, amenity: LodgingAmenity): LodgingAmenity {
    return amenity;
  }

  async onInfiniteScroll(event: InfiniteScrollCustomEvent): Promise<void> {
    try {
      await this.lodgingsResource.loadNextLodgingsPage();
    } finally {
      event.target.disabled = !this.hasMore();
      await event.target.complete();
    }
  }

  getAmenityLabel(amenity: LodgingAmenity): string {
    return getAmenityLabel(amenity);
  }
}
