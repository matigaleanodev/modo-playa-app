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
import { PublicStateCardComponent } from '@shared/components/public-state-card/public-state-card.component';
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
    PublicStateCardComponent,
  ],
})
export class HomePage {
  private readonly filtersSheetCloseThreshold = 96;
  private activeFiltersPointerId: number | null = null;
  private filtersSheetDragStartY: number | null = null;
  private readonly lodgingsResource = inject(LodgingsResourceService);

  readonly lodgingsRaw = computed(() => this.lodgingsResource.lodgings());
  readonly favoriteIds = computed(() => this.lodgingsResource.favoriteIds());
  readonly isLoading = computed(() => this.lodgingsResource.isLoading());
  readonly isLoadingMore = computed(() => this.lodgingsResource.isLoadingMore());
  readonly hasMore = computed(() => this.lodgingsResource.hasMore());
  readonly error = computed(() => this.lodgingsResource.error());
  readonly searchTerm = signal('');
  readonly isFiltersOpen = signal(false);
  readonly isDraggingFiltersSheet = signal(false);
  readonly filtersSheetOffset = signal(0);
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
  readonly hasSearchOrFilters = computed(() => {
    return Boolean(this.searchTerm()) || this.hasActiveFilters();
  });
  readonly filtersButtonLabel = computed(() => {
    const count = this.activeFiltersCount();
    return count > 0 ? `Filtros (${count})` : 'Filtros';
  });
  readonly filtersSheetTransform = computed(
    () => `translateY(${this.filtersSheetOffset()}px)`,
  );

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

  async retry(): Promise<void> {
    await this.lodgingsResource.loadInitialLodgings(this.searchTerm());
  }

  openFilters(): void {
    this.resetFiltersSheetDrag();
    this.isFiltersOpen.set(true);
  }

  closeFilters(): void {
    this.resetFiltersSheetDrag();
    this.isFiltersOpen.set(false);
  }

  onFiltersDragStart(event: PointerEvent): void {
    if (event.pointerType === 'mouse' && event.button !== 0) {
      return;
    }

    const dragZone = event.currentTarget;

    if (!(dragZone instanceof HTMLElement)) {
      return;
    }

    dragZone.setPointerCapture(event.pointerId);
    this.activeFiltersPointerId = event.pointerId;
    this.filtersSheetDragStartY = event.clientY;
    this.filtersSheetOffset.set(0);
    this.isDraggingFiltersSheet.set(true);
  }

  onFiltersDragMove(event: PointerEvent): void {
    if (
      !this.isDraggingFiltersSheet() ||
      this.activeFiltersPointerId !== event.pointerId ||
      this.filtersSheetDragStartY === null
    ) {
      return;
    }

    const nextOffset = Math.max(0, event.clientY - this.filtersSheetDragStartY);
    this.filtersSheetOffset.set(nextOffset);
  }

  onFiltersDragEnd(event: PointerEvent): void {
    if (this.activeFiltersPointerId !== event.pointerId) {
      return;
    }

    const dragZone = event.currentTarget;

    if (dragZone instanceof HTMLElement && dragZone.hasPointerCapture(event.pointerId)) {
      dragZone.releasePointerCapture(event.pointerId);
    }

    const shouldClose = this.filtersSheetOffset() >= this.filtersSheetCloseThreshold;

    this.resetFiltersSheetDrag();

    if (shouldClose) {
      this.closeFilters();
    }
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

  async resetSearchAndFilters(): Promise<void> {
    this.clearFilters();
    this.searchTerm.set('');
    await this.lodgingsResource.setSearch('');
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

  private resetFiltersSheetDrag(): void {
    this.activeFiltersPointerId = null;
    this.filtersSheetDragStartY = null;
    this.filtersSheetOffset.set(0);
    this.isDraggingFiltersSheet.set(false);
  }
}
