import { Component, computed, input, output } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonIcon,
  IonImg,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { heart, locationOutline } from 'ionicons/icons';
import { Lodging, PriceUnit } from '../../models/lodging.model';

@Component({
  selector: 'app-lodging-card',
  templateUrl: './lodging-card.component.html',
  styleUrls: ['./lodging-card.component.scss'],
  imports: [CurrencyPipe, IonCard, IonImg, IonCardContent, IonIcon, IonButton],
})
export class LodgingCardComponent {
  readonly lodging = input.required<Lodging>();
  readonly isFavorite = input(false);
  readonly lodgingDetail = output<Lodging>();
  readonly favoriteToggled = output<Lodging>();

  readonly fallbackImage = 'assets/icon/favicon.png';

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
    const image = this.lodging().mainImage?.trim();
    return image || this.fallbackImage;
  });

  constructor() {
    addIcons({
      locationOutline,
      heart,
    });
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLIonImgElement;
    img.src = this.fallbackImage;
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
