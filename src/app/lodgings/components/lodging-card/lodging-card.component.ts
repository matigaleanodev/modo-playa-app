import { Component, computed, input, output, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonIcon,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { heart, locationOutline } from 'ionicons/icons';
import { Lodging, PriceUnit } from '../../models/lodging.model';

@Component({
  selector: 'app-lodging-card',
  templateUrl: './lodging-card.component.html',
  styleUrls: ['./lodging-card.component.scss'],
  imports: [CurrencyPipe, IonCard, IonCardContent, IonIcon, IonButton],
})
export class LodgingCardComponent {
  readonly lodging = input.required<Lodging>();
  readonly isFavorite = input(false);
  readonly lodgingDetail = output<Lodging>();
  readonly favoriteToggled = output<Lodging>();

  readonly fallbackImage = 'assets/icons/icon-256.webp';
  private readonly hasImageError = signal(false);

  readonly locationLabel = computed(
    () => `${this.lodging().city}, ${this.lodging().location}`,
  );

  readonly priceUnitLabel = computed(() => {
    const labels: Record<PriceUnit, string> = {
      [PriceUnit.NIGHT]: 'noche',
      [PriceUnit.WEEK]: 'semana',
      [PriceUnit.FORTNIGHT]: 'quincena',
    };

    return labels[this.lodging().priceUnit] ?? 'periodo';
  });

  readonly imageUrl = computed(() => {
    if (this.hasImageError()) {
      return this.fallbackImage;
    }

    const defaultMedia = this.lodging().mediaImages?.find((image) => image.isDefault);
    const mediaUrl =
      defaultMedia?.variants?.card ||
      defaultMedia?.variants?.thumb ||
      defaultMedia?.url;

    if (mediaUrl?.trim()) {
      return mediaUrl.trim();
    }

    const image = this.lodging().mainImage?.trim();
    if (image) {
      return image;
    }

    const firstLegacyImage = this.lodging().images?.find((value) => value?.trim());
    return firstLegacyImage?.trim() || this.fallbackImage;
  });

  constructor() {
    addIcons({
      locationOutline,
      heart,
    });
  }

  onImageError(): void {
    this.hasImageError.set(true);
  }

  toLodgingDetail(event: Event): void {
    event.stopPropagation();
    this.lodgingDetail.emit(this.lodging());
  }

  toggleFavorite(event: Event): void {
    event.stopPropagation();
    this.favoriteToggled.emit(this.lodging());
  }
}
