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

interface HomeFilters {
  amenities: LodgingAmenity[];
  minPrice: number | null;
  maxPrice: number | null;
  guests: number | null;
}

type ActiveFilterChip =
  | { kind: 'amenity'; amenity: LodgingAmenity; label: string }
  | { kind: 'price'; label: string }
  | { kind: 'guests'; label: string };

const DEFAULT_FILTERS = (): HomeFilters => ({
  amenities: [],
  minPrice: null,
  maxPrice: null,
  guests: null,
});

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
  readonly filters = signal<HomeFilters>(DEFAULT_FILTERS());
  readonly amenityOptions = Object.values(LodgingAmenity);
  readonly skeletonCards = Array.from({ length: 4 });
  readonly searchMatchedLodgings = computed(() => {
    const normalizedSearch = this.normalizeText(this.searchTerm());

    if (!normalizedSearch) {
      return this.lodgingsRaw();
    }

    return this.lodgingsRaw().filter((lodging) =>
      [lodging.title, lodging.location, lodging.city].some((value) =>
        this.normalizeText(value).includes(normalizedSearch),
      ),
    );
  });
  readonly lodgingsFiltered = computed(() => {
    const lodgings = this.searchMatchedLodgings();
    const filters = this.filters();

    return lodgings.filter((lodging) => {
      if (filters.guests && lodging.maxGuests < filters.guests) {
        return false;
      }

      if (filters.minPrice !== null && lodging.price < filters.minPrice) {
        return false;
      }

      if (filters.maxPrice !== null && lodging.price > filters.maxPrice) {
        return false;
      }

      if (filters.amenities.length > 0) {
        const hasAmenities = filters.amenities.every((amenity) =>
          lodging.amenities.includes(amenity),
        );

        if (!hasAmenities) {
          return false;
        }
      }

      return true;
    });
  });
  readonly priceBounds = computed(() => {
    const prices = this.searchMatchedLodgings().map((lodging) => lodging.price);

    if (prices.length === 0) {
      return { min: 0, max: 300000, step: 5000 };
    }

    const min = Math.min(...prices);
    const max = Math.max(...prices);
    const roundedMin = Math.max(0, Math.floor(min / 5000) * 5000);
    const roundedMax = Math.max(
      roundedMin + 5000,
      Math.ceil(max / 5000) * 5000,
    );

    return { min: roundedMin, max: roundedMax, step: 5000 };
  });
  readonly priceRangeValue = computed(() => {
    const bounds = this.priceBounds();
    const filters = this.filters();

    return {
      lower: filters.minPrice ?? bounds.min,
      upper: filters.maxPrice ?? bounds.max,
    };
  });
  readonly activeFilters = computed<ActiveFilterChip[]>(() => {
    const filters = this.filters();
    const chips: ActiveFilterChip[] = filters.amenities.map((amenity) => ({
      kind: 'amenity',
      amenity,
      label: this.getAmenityLabel(amenity),
    }));

    if (filters.minPrice !== null || filters.maxPrice !== null) {
      const bounds = this.priceBounds();
      const minPrice = filters.minPrice ?? bounds.min;
      const maxPrice = filters.maxPrice ?? bounds.max;

      chips.push({
        kind: 'price',
        label: `${this.formatPrice(minPrice)}-${this.formatPrice(maxPrice)}`,
      });
    }

    if (filters.guests !== null) {
      chips.push({
        kind: 'guests',
        label: `${filters.guests} huésped${filters.guests === 1 ? '' : 'es'}`,
      });
    }

    return chips;
  });
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
    this.filters.update((filters) => {
      const amenities = filters.amenities.includes(amenity)
        ? filters.amenities.filter((item) => item !== amenity)
        : [...filters.amenities, amenity];

      return {
        ...filters,
        amenities,
      };
    });
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

    const bounds = this.priceBounds();
    const nextMinPrice = value.lower <= bounds.min ? null : value.lower;
    const nextMaxPrice = value.upper >= bounds.max ? null : value.upper;

    this.filters.update((filters) => ({
      ...filters,
      minPrice: nextMinPrice,
      maxPrice: nextMaxPrice,
    }));
  }

  decreaseGuests(): void {
    this.filters.update((filters) => ({
      ...filters,
      guests:
        filters.guests === null || filters.guests <= 1 ? null : filters.guests - 1,
    }));
  }

  increaseGuests(): void {
    this.filters.update((filters) => ({
      ...filters,
      guests: (filters.guests ?? 0) + 1,
    }));
  }

  clearFilters(): void {
    this.filters.set(DEFAULT_FILTERS());
  }

  removeFilter(chip: ActiveFilterChip): void {
    if (chip.kind === 'amenity') {
      this.toggleAmenity(chip.amenity);
      return;
    }

    if (chip.kind === 'price') {
      this.filters.update((filters) => ({
        ...filters,
        minPrice: null,
        maxPrice: null,
      }));
      return;
    }

    this.filters.update((filters) => ({
      ...filters,
      guests: null,
    }));
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
    const labels: Record<LodgingAmenity, string> = {
      [LodgingAmenity.SEA_VIEW]: 'Vista al mar',
      [LodgingAmenity.POOL]: 'Piscina',
      [LodgingAmenity.PARRILLA]: 'Parrilla',
      [LodgingAmenity.WIFI]: 'WiFi',
      [LodgingAmenity.AIR_CONDITIONING]: 'Aire acondicionado',
      [LodgingAmenity.HEATING]: 'Calefacción',
      [LodgingAmenity.CABLE_TV]: 'Cable TV',
      [LodgingAmenity.PETS_ALLOWED]: 'Mascotas',
      [LodgingAmenity.GARAGE]: 'Garage',
    };

    return labels[amenity];
  }

  private formatPrice(price: number): string {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      maximumFractionDigits: 0,
    }).format(price);
  }

  private normalizeText(value: string): string {
    return value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim();
  }
}
