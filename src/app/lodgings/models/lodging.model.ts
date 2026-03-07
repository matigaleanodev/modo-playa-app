export enum LodgingAmenity {
  SEA_VIEW = 'sea_view',
  POOL = 'pool',
  PARRILLA = 'parrilla',
  WIFI = 'wifi',
  AIR_CONDITIONING = 'air_conditioning',
  HEATING = 'heating',
  CABLE_TV = 'cable_tv',
  PETS_ALLOWED = 'pets_allowed',
  GARAGE = 'garage',
}

export enum LodgingType {
  CABIN = 'cabin',
  APARTMENT = 'apartment',
  HOUSE = 'house',
}

export enum PriceUnit {
  NIGHT = 'night',
  WEEK = 'week',
  FORTNIGHT = 'fortnight',
}

export interface LodgingImageVariants {
  thumb: string;
  card: string;
  hero: string;
}

export interface LodgingImage {
  imageId: string;
  key: string;
  isDefault: boolean;
  width?: number;
  height?: number;
  bytes?: number;
  mime?: string;
  createdAt: string;
  url: string;
  variants?: LodgingImageVariants;
}

export interface AvailabilityRange {
  from: string;
  to: string;
}

export interface Lodging {
  id: string;
  title: string;
  description: string;
  location: string;
  city: string;
  type: LodgingType;
  price: number;
  priceUnit: PriceUnit;
  maxGuests: number;
  bedrooms: number;
  bathrooms: number;
  minNights: number;
  distanceToBeach?: number;
  amenities: LodgingAmenity[];
  mainImage: string;
  images: string[];
  mediaImages?: LodgingImage[];
  occupiedRanges?: AvailabilityRange[];
}

export interface PublicLodgingsQuery {
  page?: number;
  limit?: number;
  search?: string;
  tag?: string[];
  city?: string;
  minGuests?: number;
  minPrice?: number;
  maxPrice?: number;
  amenities?: LodgingAmenity[];
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}
