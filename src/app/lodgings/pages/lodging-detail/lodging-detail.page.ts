import { CurrencyPipe } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';
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
  heart,
  heartOutline,
  homeOutline,
  informationCircleOutline,
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
import { LodgingAvailabilityCalendarComponent } from '../../components/lodging-availability-calendar/lodging-availability-calendar.component';
import { LodgingsResourceService } from '../../services/lodgings-resource.service';

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
    LodgingAvailabilityCalendarComponent,
  ],
})
export class LodgingDetailPage {
  private readonly lodgingsResource = inject(LodgingsResourceService);
  private readonly fallbackImage = 'assets/icons/icon-256.webp';

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
  readonly isFavorite = computed(() =>
    this.lodgingsResource.isFavorite(this.lodging().id),
  );

  constructor() {
    addIcons({
      ellipsisHorizontal,
      homeOutline,
      heart,
      heartOutline,
      informationCircleOutline,
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

  async ionViewWillEnter(): Promise<void> {
    await this.lodgingsResource.loadFavorites();
  }

  get emailHref(): string | null {
    const email = this.contact().email?.trim();
    return email ? `mailto:${email}` : null;
  }

  get whatsappHref(): string | null {
    const whatsapp = this.contact().whatsapp?.replace(/\D/g, '') ?? '';
    return whatsapp ? `https://wa.me/+549${whatsapp}` : null;
  }

  get galleryImages(): string[] {
    const lodging = this.lodging();
    const mediaGallery = (lodging.mediaImages ?? [])
      .filter((image) => !image.isDefault)
      .map((image) => image.variants?.hero || image.variants?.card || image.url)
      .filter((image): image is string => Boolean(image?.trim()))
      .map((image) => image.trim());

    if (mediaGallery.length > 0) {
      return Array.from(new Set(mediaGallery));
    }

    return lodging.images.filter(
      (image) => image && image !== lodging.mainImage,
    );
  }

  get heroImage(): string {
    const lodging = this.lodging();
    const defaultMedia = lodging.mediaImages?.find((image) => image.isDefault);
    const mediaHero =
      defaultMedia?.variants?.hero ||
      defaultMedia?.variants?.card ||
      defaultMedia?.url;

    if (mediaHero?.trim()) {
      return mediaHero.trim();
    }

    if (lodging.mainImage?.trim()) {
      return lodging.mainImage.trim();
    }

    const firstLegacyImage = lodging.images.find((image) => image?.trim());
    return firstLegacyImage?.trim() || this.fallbackImage;
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

  async toggleFavorite(): Promise<void> {
    await this.lodgingsResource.toggleFavorite(this.lodging());
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
