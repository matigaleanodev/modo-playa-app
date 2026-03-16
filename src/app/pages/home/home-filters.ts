import {
  Lodging,
  LodgingAmenity,
  LodgingType,
} from 'src/app/lodgings/models/lodging.model';

export interface HomeFilters {
  amenities: LodgingAmenity[];
  city: string | null;
  type: LodgingType | null;
  minPrice: number | null;
  maxPrice: number | null;
  minBedrooms: number | null;
  minBathrooms: number | null;
  minDistanceToBeach: number | null;
  maxDistanceToBeach: number | null;
  guests: number | null;
  availableFrom: string | null;
  availableTo: string | null;
}

export type ActiveFilterChip =
  | { kind: 'amenity'; amenity: LodgingAmenity; label: string }
  | { kind: 'city'; label: string }
  | { kind: 'type'; label: string }
  | { kind: 'price'; label: string }
  | { kind: 'bedrooms'; label: string }
  | { kind: 'bathrooms'; label: string }
  | { kind: 'distance'; label: string }
  | { kind: 'guests'; label: string }
  | { kind: 'availability'; label: string };

export interface HomePriceBounds {
  min: number;
  max: number;
  step: number;
}

export interface HomePriceRangeValue {
  lower: number;
  upper: number;
}

export interface HomeDistanceBounds {
  min: number;
  max: number;
  step: number;
}

const DEFAULT_PRICE_BOUNDS: HomePriceBounds = {
  min: 0,
  max: 300000,
  step: 5000,
};

const DEFAULT_DISTANCE_BOUNDS: HomeDistanceBounds = {
  min: 0,
  max: 3000,
  step: 50,
};

const priceFormatter = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
  maximumFractionDigits: 0,
});

export function createDefaultHomeFilters(): HomeFilters {
  return {
    amenities: [],
    city: null,
    type: null,
    minPrice: null,
    maxPrice: null,
    minBedrooms: null,
    minBathrooms: null,
    minDistanceToBeach: null,
    maxDistanceToBeach: null,
    guests: null,
    availableFrom: null,
    availableTo: null,
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

export function getLodgingTypeLabel(type: LodgingType): string {
  const labels: Record<LodgingType, string> = {
    [LodgingType.CABIN]: 'Cabaña',
    [LodgingType.APARTMENT]: 'Departamento',
    [LodgingType.HOUSE]: 'Casa',
  };

  return labels[type];
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
    if (filters.city && lodging.city !== filters.city) {
      return false;
    }

    if (filters.type && lodging.type !== filters.type) {
      return false;
    }

    if (filters.guests && lodging.maxGuests < filters.guests) {
      return false;
    }

    if (filters.minBedrooms && lodging.bedrooms < filters.minBedrooms) {
      return false;
    }

    if (filters.minBathrooms && lodging.bathrooms < filters.minBathrooms) {
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

    if (
      (filters.minDistanceToBeach !== null || filters.maxDistanceToBeach !== null) &&
      lodging.distanceToBeach === undefined
    ) {
      return false;
    }

    if (
      filters.minDistanceToBeach !== null &&
      lodging.distanceToBeach !== undefined &&
      lodging.distanceToBeach < filters.minDistanceToBeach
    ) {
      return false;
    }

    if (
      filters.maxDistanceToBeach !== null &&
      lodging.distanceToBeach !== undefined &&
      lodging.distanceToBeach > filters.maxDistanceToBeach
    ) {
      return false;
    }

    if (
      filters.availableFrom &&
      filters.availableTo &&
      hasAvailabilityConflict(
        lodging.occupiedRanges ?? [],
        filters.availableFrom,
        filters.availableTo,
      )
    ) {
      return false;
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

export function getDistanceBounds(lodgings: Lodging[]): HomeDistanceBounds {
  const distances = lodgings
    .map((lodging) => lodging.distanceToBeach)
    .filter((distance): distance is number => distance !== undefined);

  if (distances.length === 0) {
    return DEFAULT_DISTANCE_BOUNDS;
  }

  const min = Math.max(0, Math.floor(Math.min(...distances) / 50) * 50);
  const max = Math.max(min + 50, Math.ceil(Math.max(...distances) / 50) * 50);

  return { min, max, step: DEFAULT_DISTANCE_BOUNDS.step };
}

export function getDistanceRangeValue(
  filters: HomeFilters,
  bounds: HomeDistanceBounds,
): HomePriceRangeValue {
  return {
    lower: filters.minDistanceToBeach ?? bounds.min,
    upper: filters.maxDistanceToBeach ?? bounds.max,
  };
}

export function getActiveFilters(
  filters: HomeFilters,
  bounds: HomePriceBounds,
  distanceBounds: HomeDistanceBounds,
): ActiveFilterChip[] {
  const chips: ActiveFilterChip[] = filters.amenities.map((amenity) => ({
    kind: 'amenity',
    amenity,
    label: getAmenityLabel(amenity),
  }));

  if (filters.city) {
    chips.push({
      kind: 'city',
      label: filters.city,
    });
  }

  if (filters.type) {
    chips.push({
      kind: 'type',
      label: getLodgingTypeLabel(filters.type),
    });
  }

  if (filters.minPrice !== null || filters.maxPrice !== null) {
    const minPrice = filters.minPrice ?? bounds.min;
    const maxPrice = filters.maxPrice ?? bounds.max;

    chips.push({
      kind: 'price',
      label: `${priceFormatter.format(minPrice)}-${priceFormatter.format(maxPrice)}`,
    });
  }

  if (filters.minBedrooms !== null) {
    chips.push({
      kind: 'bedrooms',
      label: `${filters.minBedrooms}+ dorm.`,
    });
  }

  if (filters.minBathrooms !== null) {
    chips.push({
      kind: 'bathrooms',
      label: `${filters.minBathrooms}+ baño${filters.minBathrooms === 1 ? '' : 's'}`,
    });
  }

  if (
    filters.minDistanceToBeach !== null ||
    filters.maxDistanceToBeach !== null
  ) {
    chips.push({
      kind: 'distance',
      label: formatDistanceRange(filters, distanceBounds),
    });
  }

  if (filters.guests !== null) {
    chips.push({
      kind: 'guests',
      label: `${filters.guests} huésped${filters.guests === 1 ? '' : 'es'}`,
    });
  }

  if (filters.availableFrom && filters.availableTo) {
    chips.push({
      kind: 'availability',
      label: `${formatShortDate(filters.availableFrom)}-${formatShortDate(filters.availableTo)}`,
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

export function applyDistanceRange(
  filters: HomeFilters,
  rangeValue: HomePriceRangeValue,
  bounds: HomeDistanceBounds,
): HomeFilters {
  return {
    ...filters,
    minDistanceToBeach:
      rangeValue.lower <= bounds.min ? null : rangeValue.lower,
    maxDistanceToBeach:
      rangeValue.upper >= bounds.max ? null : rangeValue.upper,
  };
}

export function setCityFilter(filters: HomeFilters, city: string | null): HomeFilters {
  return {
    ...filters,
    city,
  };
}

export function setTypeFilter(
  filters: HomeFilters,
  type: LodgingType | null,
): HomeFilters {
  return {
    ...filters,
    type,
  };
}

export function setMinBedrooms(
  filters: HomeFilters,
  minBedrooms: number | null,
): HomeFilters {
  return {
    ...filters,
    minBedrooms,
  };
}

export function setMinBathrooms(
  filters: HomeFilters,
  minBathrooms: number | null,
): HomeFilters {
  return {
    ...filters,
    minBathrooms,
  };
}

export function setAvailabilityDate(
  filters: HomeFilters,
  field: 'availableFrom' | 'availableTo',
  value: string | null,
): HomeFilters {
  const nextFilters: HomeFilters = {
    ...filters,
    [field]: value,
  };

  if (nextFilters.availableFrom && nextFilters.availableTo) {
    const fromValue = toUtcDateValue(nextFilters.availableFrom);
    const toValue = toUtcDateValue(nextFilters.availableTo);

    if (fromValue > toValue) {
      if (field === 'availableFrom') {
        nextFilters.availableTo = nextFilters.availableFrom;
      } else {
        nextFilters.availableFrom = nextFilters.availableTo;
      }
    }
  }

  return nextFilters;
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

  if (chip.kind === 'city') {
    return {
      ...filters,
      city: null,
    };
  }

  if (chip.kind === 'type') {
    return {
      ...filters,
      type: null,
    };
  }

  if (chip.kind === 'bedrooms') {
    return {
      ...filters,
      minBedrooms: null,
    };
  }

  if (chip.kind === 'bathrooms') {
    return {
      ...filters,
      minBathrooms: null,
    };
  }

  if (chip.kind === 'distance') {
    return {
      ...filters,
      minDistanceToBeach: null,
      maxDistanceToBeach: null,
    };
  }

  if (chip.kind === 'availability') {
    return {
      ...filters,
      availableFrom: null,
      availableTo: null,
    };
  }

  return {
    ...filters,
    guests: null,
  };
}

function formatDistanceRange(
  filters: HomeFilters,
  bounds: HomeDistanceBounds,
): string {
  const lower = filters.minDistanceToBeach;
  const upper = filters.maxDistanceToBeach;

  if (lower !== null && upper !== null) {
    return `${lower} m-${upper} m`;
  }

  if (upper !== null) {
    return `Hasta ${upper} m`;
  }

  return `Desde ${lower ?? bounds.min} m`;
}

function hasAvailabilityConflict(
  occupiedRanges: Array<{ from: string; to: string }>,
  availableFrom: string,
  availableTo: string,
): boolean {
  const selectedFrom = toUtcDateValue(availableFrom);
  const selectedTo = toUtcDateValue(availableTo);

  return occupiedRanges.some((range) => {
    const rangeFrom = toUtcDateValue(range.from);
    const rangeTo = toUtcDateValue(range.to);

    return rangeFrom <= selectedTo && rangeTo >= selectedFrom;
  });
}

function formatShortDate(value: string): string {
  const [year, month, day] = getDateOnlyValue(value).split('-');
  return `${day}/${month}/${year}`;
}

function toUtcDateValue(value: string): number {
  const [year, month, day] = getDateOnlyValue(value).split('-').map(Number);
  return Date.UTC(year, month - 1, day);
}

function getDateOnlyValue(value: string): string {
  return value.split('T')[0];
}

function normalizeText(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}
