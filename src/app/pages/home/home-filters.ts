import { Lodging, LodgingAmenity } from 'src/app/lodgings/models/lodging.model';

export interface HomeFilters {
  amenities: LodgingAmenity[];
  minPrice: number | null;
  maxPrice: number | null;
  guests: number | null;
}

export type ActiveFilterChip =
  | { kind: 'amenity'; amenity: LodgingAmenity; label: string }
  | { kind: 'price'; label: string }
  | { kind: 'guests'; label: string };

export interface HomePriceBounds {
  min: number;
  max: number;
  step: number;
}

export interface HomePriceRangeValue {
  lower: number;
  upper: number;
}

const DEFAULT_PRICE_BOUNDS: HomePriceBounds = {
  min: 0,
  max: 300000,
  step: 5000,
};

const priceFormatter = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
  maximumFractionDigits: 0,
});

export function createDefaultHomeFilters(): HomeFilters {
  return {
    amenities: [],
    minPrice: null,
    maxPrice: null,
    guests: null,
  };
}

export function getAmenityLabel(amenity: LodgingAmenity): string {
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

export function getSearchMatchedLodgings(
  lodgings: Lodging[],
  searchTerm: string,
): Lodging[] {
  const normalizedSearch = normalizeText(searchTerm);

  if (!normalizedSearch) {
    return lodgings;
  }

  return lodgings.filter((lodging) =>
    [lodging.title, lodging.location, lodging.city].some((value) =>
      normalizeText(value).includes(normalizedSearch),
    ),
  );
}

export function filterLodgings(
  lodgings: Lodging[],
  filters: HomeFilters,
): Lodging[] {
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
}

export function getPriceBounds(lodgings: Lodging[]): HomePriceBounds {
  const prices = lodgings.map((lodging) => lodging.price);

  if (prices.length === 0) {
    return DEFAULT_PRICE_BOUNDS;
  }

  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const roundedMin = Math.max(0, Math.floor(min / 5000) * 5000);
  const roundedMax = Math.max(roundedMin + 5000, Math.ceil(max / 5000) * 5000);

  return { min: roundedMin, max: roundedMax, step: DEFAULT_PRICE_BOUNDS.step };
}

export function getPriceRangeValue(
  filters: HomeFilters,
  bounds: HomePriceBounds,
): HomePriceRangeValue {
  return {
    lower: filters.minPrice ?? bounds.min,
    upper: filters.maxPrice ?? bounds.max,
  };
}

export function getActiveFilters(
  filters: HomeFilters,
  bounds: HomePriceBounds,
): ActiveFilterChip[] {
  const chips: ActiveFilterChip[] = filters.amenities.map((amenity) => ({
    kind: 'amenity',
    amenity,
    label: getAmenityLabel(amenity),
  }));

  if (filters.minPrice !== null || filters.maxPrice !== null) {
    const minPrice = filters.minPrice ?? bounds.min;
    const maxPrice = filters.maxPrice ?? bounds.max;

    chips.push({
      kind: 'price',
      label: `${priceFormatter.format(minPrice)}-${priceFormatter.format(maxPrice)}`,
    });
  }

  if (filters.guests !== null) {
    chips.push({
      kind: 'guests',
      label: `${filters.guests} huésped${filters.guests === 1 ? '' : 'es'}`,
    });
  }

  return chips;
}

export function toggleAmenity(
  filters: HomeFilters,
  amenity: LodgingAmenity,
): HomeFilters {
  const amenities = filters.amenities.includes(amenity)
    ? filters.amenities.filter((item) => item !== amenity)
    : [...filters.amenities, amenity];

  return {
    ...filters,
    amenities,
  };
}

export function applyPriceRange(
  filters: HomeFilters,
  rangeValue: HomePriceRangeValue,
  bounds: HomePriceBounds,
): HomeFilters {
  return {
    ...filters,
    minPrice: rangeValue.lower <= bounds.min ? null : rangeValue.lower,
    maxPrice: rangeValue.upper >= bounds.max ? null : rangeValue.upper,
  };
}

export function decreaseGuests(filters: HomeFilters): HomeFilters {
  return {
    ...filters,
    guests:
      filters.guests === null || filters.guests <= 1 ? null : filters.guests - 1,
  };
}

export function increaseGuests(filters: HomeFilters): HomeFilters {
  return {
    ...filters,
    guests: (filters.guests ?? 0) + 1,
  };
}

export function removeFilter(
  filters: HomeFilters,
  chip: ActiveFilterChip,
): HomeFilters {
  if (chip.kind === 'amenity') {
    return toggleAmenity(filters, chip.amenity);
  }

  if (chip.kind === 'price') {
    return {
      ...filters,
      minPrice: null,
      maxPrice: null,
    };
  }

  return {
    ...filters,
    guests: null,
  };
}

function normalizeText(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}
