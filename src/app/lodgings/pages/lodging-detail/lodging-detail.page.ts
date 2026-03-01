import { CurrencyPipe, Location } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonFooter,
  IonHeader,
  IonIcon,
  IonMenuButton,
  IonText,
  IonToolbar,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  carSportOutline,
  ellipsisHorizontal,
  flameOutline,
  homeOutline,
  leafOutline,
  logoWhatsapp,
  mailOutline,
  moonOutline,
  peopleOutline,
  snowOutline,
  waterOutline,
  wifiOutline,
} from 'ionicons/icons';
import {
  Lodging,
  LodgingAmenity,
  LodgingType,
  PriceUnit,
} from '../../models/lodging.model';

interface LodgingFacility {
  icon: string;
  label: string;
}

interface LodgingContact {
  email?: string;
  whatsapp?: string;
}

type LodgingDetailInput = Lodging & {
  contact?: LodgingContact;
};

@Component({
  selector: 'app-lodging-detail',
  templateUrl: './lodging-detail.page.html',
  styleUrls: ['./lodging-detail.page.scss'],
  imports: [
    CurrencyPipe,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonMenuButton,
    IonContent,
    IonFooter,
    IonIcon,
    IonButton,
    IonText,
  ],
})
export class LodgingDetailPage {
  readonly lodging = input.required<LodgingDetailInput>();

  readonly facilities = computed<LodgingFacility[]>(() =>
    this.lodging()
      .amenities.map((amenity) => this.mapAmenity(amenity))
      .filter((facility): facility is LodgingFacility => Boolean(facility))
      .slice(0, 6),
  );

  readonly lodgingMeta = computed<LodgingFacility[]>(() => {
    const lodging = this.lodging();
    return [
      { icon: 'people-outline', label: `${lodging.maxGuests} huespedes` },
      { icon: 'moon-outline', label: `${lodging.bedrooms} dormitorios` },
      { icon: 'water-outline', label: `${lodging.bathrooms} banos` },
      { icon: 'leaf-outline', label: `${lodging.minNights} noches min.` },
    ];
  });

  readonly contact = computed<LodgingContact>(
    () => this.lodging().contact ?? {},
  );

  constructor() {
    addIcons({
      ellipsisHorizontal,
      homeOutline,
      waterOutline,
      leafOutline,
      carSportOutline,
      wifiOutline,
      flameOutline,
      snowOutline,
      moonOutline,
      peopleOutline,
      mailOutline,
      logoWhatsapp,
    });
  }

  get emailHref(): string | null {
    const email = this.contact().email?.trim();
    return email ? `mailto:${email}` : null;
  }

  get whatsappHref(): string | null {
    const whatsapp = this.contact().whatsapp?.replace(/\D/g, '') ?? '';
    return whatsapp ? `https://wa.me/${whatsapp}` : null;
  }

  get galleryImages(): string[] {
    const lodging = this.lodging();
    return lodging.images.filter((image) => image !== lodging.mainImage);
  }

  get lodgingTypeLabel(): string {
    const labels: Record<LodgingType, string> = {
      [LodgingType.CABIN]: 'Cabana',
      [LodgingType.APARTMENT]: 'Departamento',
      [LodgingType.HOUSE]: 'Casa',
    };

    const lodgingType = this.lodging().type;
    return labels[lodgingType] ?? lodgingType;
  }

  get priceUnitLabel(): string {
    const labels: Record<PriceUnit, string> = {
      [PriceUnit.NIGHT]: 'Por noche',
      [PriceUnit.WEEK]: 'Por semana',
      [PriceUnit.FORTNIGHT]: 'Por quincena',
    };

    const priceUnit = this.lodging().priceUnit;
    return labels[priceUnit] ?? 'Precio';
  }

  private mapAmenity(amenity: LodgingAmenity): LodgingFacility | null {
    const map: Record<LodgingAmenity, LodgingFacility> = {
      [LodgingAmenity.POOL]: { icon: 'water-outline', label: 'Piscina' },
      [LodgingAmenity.SEA_VIEW]: {
        icon: 'leaf-outline',
        label: 'Acceso a playa',
      },
      [LodgingAmenity.GARAGE]: {
        icon: 'car-sport-outline',
        label: 'Estacionamiento',
      },
      [LodgingAmenity.WIFI]: { icon: 'wifi-outline', label: 'Wifi' },
      [LodgingAmenity.PARRILLA]: { icon: 'flame-outline', label: 'Parrilla' },
      [LodgingAmenity.AIR_CONDITIONING]: {
        icon: 'snow-outline',
        label: 'Aire acondicionado',
      },
      [LodgingAmenity.HEATING]: { icon: 'moon-outline', label: 'Calefaccion' },
      [LodgingAmenity.CABLE_TV]: {
        icon: 'ellipsis-horizontal',
        label: 'Cable TV',
      },
      [LodgingAmenity.PETS_ALLOWED]: {
        icon: 'ellipsis-horizontal',
        label: 'Mascotas permitidas',
      },
    };

    return map[amenity] ?? null;
  }
}
