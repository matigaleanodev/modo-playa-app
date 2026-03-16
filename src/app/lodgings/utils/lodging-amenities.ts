import { addIcons } from 'ionicons';
import {
  carSportOutline,
  flameOutline,
  partlySunnyOutline,
  pawOutline,
  snowOutline,
  thermometerOutline,
  tvOutline,
  waterOutline,
  wifiOutline,
} from 'ionicons/icons';
import { LodgingAmenity } from '../models/lodging.model';

export interface LodgingAmenityPresentation {
  label: string;
  icon: string;
}

const AMENITY_PRESENTATION: Record<LodgingAmenity, LodgingAmenityPresentation> = {
  [LodgingAmenity.SEA_VIEW]: {
    label: 'Vista al mar',
    icon: 'partly-sunny-outline',
  },
  [LodgingAmenity.POOL]: {
    label: 'Piscina',
    icon: 'water-outline',
  },
  [LodgingAmenity.PARRILLA]: {
    label: 'Parrilla',
    icon: 'flame-outline',
  },
  [LodgingAmenity.WIFI]: {
    label: 'WiFi',
    icon: 'wifi-outline',
  },
  [LodgingAmenity.AIR_CONDITIONING]: {
    label: 'Aire acondicionado',
    icon: 'snow-outline',
  },
  [LodgingAmenity.HEATING]: {
    label: 'Calefacción',
    icon: 'thermometer-outline',
  },
  [LodgingAmenity.CABLE_TV]: {
    label: 'Cable TV',
    icon: 'tv-outline',
  },
  [LodgingAmenity.PETS_ALLOWED]: {
    label: 'Mascotas',
    icon: 'paw-outline',
  },
  [LodgingAmenity.GARAGE]: {
    label: 'Garage',
    icon: 'car-sport-outline',
  },
};

export function registerLodgingAmenityIcons(): void {
  addIcons({
    waterOutline,
    flameOutline,
    wifiOutline,
    snowOutline,
    thermometerOutline,
    tvOutline,
    pawOutline,
    carSportOutline,
    partlySunnyOutline,
  });
}

export function getLodgingAmenityPresentation(
  amenity: LodgingAmenity,
): LodgingAmenityPresentation {
  return AMENITY_PRESENTATION[amenity];
}

export function getLodgingAmenityLabel(amenity: LodgingAmenity): string {
  return getLodgingAmenityPresentation(amenity).label;
}

export function getLodgingAmenityIcon(amenity: LodgingAmenity): string {
  return getLodgingAmenityPresentation(amenity).icon;
}
