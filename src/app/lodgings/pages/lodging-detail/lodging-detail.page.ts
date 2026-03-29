import { CurrencyPipe } from '@angular/common';
import { Component, computed, ElementRef, inject, input, signal, viewChild } from '@angular/core';
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
  caretBackOutline,
  caretForwardOutline,
  close,
  flameOutline,
  heart,
  heartOutline,
  homeOutline,
  informationCircleOutline,
  leafOutline,
  logoWhatsapp,
  mailOutline,
  moonOutline,
  partlySunnyOutline,
  peopleOutline,
  pawOutline,
  snowOutline,
  thermometerOutline,
  tvOutline,
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
import { ScrollHeaderDirective } from '@shared/directives/scroll-header.directive';
import { getLodgingAmenityPresentation } from '../../utils/lodging-amenities';

interface LodgingFacility {
  id: string;
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
    ScrollHeaderDirective,
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
  private readonly galleryViewerTrack = viewChild<ElementRef<HTMLElement>>('galleryViewerTrack');

  readonly lodging = input.required<LodgingDetailInput>();
  readonly isGalleryViewerOpen = signal(false);
  readonly activeGalleryImageIndex = signal(0);

  readonly facilities = computed<LodgingFacility[]>(() =>
    this.lodging()
      .amenities.map((amenity) => this.mapAmenity(amenity))
      .filter((facility): facility is LodgingFacility => Boolean(facility))
      .slice(0, 6),
  );

  readonly lodgingMeta = computed<LodgingFacility[]>(() => {
    const lodging = this.lodging();
    return [
      {
        id: 'max-guests',
        icon: 'people-outline',
        label: `${lodging.maxGuests} huespedes`,
      },
      {
        id: 'bedrooms',
        icon: 'moon-outline',
        label: `${lodging.bedrooms} dormitorios`,
      },
      {
        id: 'bathrooms',
        icon: 'water-outline',
        label: `${lodging.bathrooms} banos`,
      },
      {
        id: 'min-nights',
        icon: 'leaf-outline',
        label: `${lodging.minNights} noches min.`,
      },
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
      homeOutline,
      close,
      heart,
      heartOutline,
      informationCircleOutline,
      waterOutline,
      caretBackOutline,
      caretForwardOutline,
      leafOutline,
      carSportOutline,
      wifiOutline,
      flameOutline,
      snowOutline,
      moonOutline,
      peopleOutline,
      mailOutline,
      logoWhatsapp,
      tvOutline,
      pawOutline,
      thermometerOutline,
      partlySunnyOutline,
    });
  }

  async ionViewWillEnter(): Promise<void> {
    await this.lodgingsResource.loadFavorites();
  }

  readonly emailHref = computed(() => {
    const email = this.contact().email?.trim();
    return email ? `mailto:${email}` : null;
  });

  readonly whatsappHref = computed(() => {
    const whatsapp = this.contact().whatsapp?.replace(/\D/g, '') ?? '';
    if (!whatsapp) {
      return null;
    }

    const message = encodeURIComponent(
      `Hola! vi ${this.lodging().title} en Modo Playa y me gustaria tener mas informacion`,
    );

    return `https://wa.me/+549${whatsapp}?text=${message}`;
  });

  readonly galleryImages = computed(() => {
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
  });

  readonly heroImage = computed(() => {
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
  });

  readonly lodgingTypeLabel = computed(() => {
    const labels: Record<LodgingType, string> = {
      [LodgingType.CABIN]: 'Cabana',
      [LodgingType.APARTMENT]: 'Departamento',
      [LodgingType.HOUSE]: 'Casa',
    };

    const lodgingType = this.lodging().type;
    return labels[lodgingType] ?? lodgingType;
  });

  readonly priceUnitLabel = computed(() => {
    const labels: Record<PriceUnit, string> = {
      [PriceUnit.NIGHT]: 'Por noche',
      [PriceUnit.WEEK]: 'Por semana',
      [PriceUnit.FORTNIGHT]: 'Por quincena',
    };

    const priceUnit = this.lodging().priceUnit;
    return labels[priceUnit] ?? 'Precio';
  });

  readonly galleryViewerCounter = computed(() => {
    const totalImages = this.galleryImages().length;

    if (totalImages === 0) {
      return '';
    }

    return `${this.activeGalleryImageIndex() + 1} / ${totalImages}`;
  });

  async toggleFavorite(): Promise<void> {
    await this.lodgingsResource.toggleFavorite(this.lodging());
  }

  openGalleryViewer(index: number): void {
    const images = this.galleryImages();

    if (images.length === 0 || index < 0 || index >= images.length) {
      return;
    }

    this.activeGalleryImageIndex.set(index);
    this.isGalleryViewerOpen.set(true);
    this.scrollGalleryViewerTo(index, 'auto');
  }

  closeGalleryViewer(): void {
    this.isGalleryViewerOpen.set(false);
  }

  showPreviousGalleryImage(): void {
    this.moveGalleryViewerBy(-1);
  }

  showNextGalleryImage(): void {
    this.moveGalleryViewerBy(1);
  }

  onGalleryViewerScroll(event: Event): void {
    const target = event.target;

    if (!(target instanceof HTMLElement) || target.clientWidth === 0) {
      return;
    }

    const nextIndex = Math.round(target.scrollLeft / target.clientWidth);
    const lastIndex = Math.max(this.galleryImages().length - 1, 0);
    this.activeGalleryImageIndex.set(Math.min(Math.max(nextIndex, 0), lastIndex));
  }

  private mapAmenity(amenity: LodgingAmenity): LodgingFacility | null {
    const presentation = getLodgingAmenityPresentation(amenity);

    return {
      id: amenity,
      icon: presentation.icon,
      label:
        amenity === LodgingAmenity.GARAGE
          ? 'Estacionamiento'
          : amenity === LodgingAmenity.PETS_ALLOWED
            ? 'Mascotas permitidas'
            : presentation.label,
    };
  }

  private moveGalleryViewerBy(offset: -1 | 1): void {
    const images = this.galleryImages();

    if (images.length === 0) {
      return;
    }

    const nextIndex =
      (this.activeGalleryImageIndex() + offset + images.length) % images.length;

    this.activeGalleryImageIndex.set(nextIndex);
    this.scrollGalleryViewerTo(nextIndex, 'smooth');
  }

  private scrollGalleryViewerTo(index: number, behavior: ScrollBehavior): void {
    requestAnimationFrame(() => {
      const galleryViewerTrack = this.galleryViewerTrack()?.nativeElement;

      if (!galleryViewerTrack) {
        return;
      }

      galleryViewerTrack.scrollTo({
        left: galleryViewerTrack.clientWidth * index,
        behavior,
      });
    });
  }
}
