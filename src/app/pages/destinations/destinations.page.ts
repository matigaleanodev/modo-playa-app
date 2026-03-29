import { Component, computed, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import {
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonIcon,
  IonLabel,
  IonMenuButton,
  IonRefresher,
  IonRefresherContent,
  IonRow,
  IonSegment,
  IonSegmentButton,
  IonToolbar,
} from '@ionic/angular/standalone';
import { RefresherCustomEvent, SegmentCustomEvent } from '@ionic/angular';
import { addIcons } from 'ionicons';
import {
  businessOutline,
  cloudyOutline,
  locationOutline,
  medicalOutline,
  moonOutline,
  partlySunnyOutline,
  rainyOutline,
  shieldCheckmarkOutline,
  storefrontOutline,
  sunnyOutline,
  thunderstormOutline,
  walkOutline,
} from 'ionicons/icons';
import {
  Destination,
  DestinationContext,
  DestinationForecastItem,
  DestinationId,
  PointOfInterest,
  PointOfInterestCategory,
} from 'src/app/destinations/models/destination.model';
import { DestinationsService } from 'src/app/destinations/services/destinations.service';
import {
  getDestinationContextErrorMessage,
  getDestinationsErrorMessage,
} from '@shared/http/public-api-error';
import { PublicStateCardComponent } from '@shared/components/public-state-card/public-state-card.component';
import { ScrollHeaderDirective } from '@shared/directives/scroll-header.directive';
import {
  formatDestinationTime,
  isNightInDestination,
} from 'src/app/destinations/utils/destination-time';

@Component({
  selector: 'app-destinations',
  templateUrl: './destinations.page.html',
  styleUrls: ['./destinations.page.scss'],
  imports: [
    IonHeader,
    IonToolbar,
    IonButtons,
    IonMenuButton,
    IonContent,
    ScrollHeaderDirective,
    IonRefresher,
    IonRefresherContent,
    IonSegment,
    IonSegmentButton,
    IonLabel,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonGrid,
    IonRow,
    IonCol,
    IonIcon,
    PublicStateCardComponent,
  ],
})
export class DestinationsPage {
  private readonly destinationsService = inject(DestinationsService);

  readonly destinations = signal<Destination[]>([]);
  readonly selectedDestinationId = signal<DestinationId | null>(null);
  readonly context = signal<DestinationContext | null>(null);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  readonly todayForecast = computed(() =>
    this.findForecastByDay('today', this.context()?.forecast),
  );

  readonly tomorrowForecast = computed(() =>
    this.findForecastByDay('tomorrow', this.context()?.forecast),
  );
  readonly isNight = computed(() =>
    isNightInDestination(this.context()?.sun, this.context()?.timezone),
  );
  readonly destinationTimeLabel = computed(() => {
    const timezone = this.context()?.timezone;

    if (!timezone) {
      return null;
    }

    return formatDestinationTime(timezone);
  });
  readonly hasEmptyState = computed(() => {
    return !this.loading() && !this.error() && this.destinations().length === 0;
  });
  readonly pointsOfInterest = computed(() => this.context()?.pointsOfInterest ?? []);

  readonly weatherLabel = computed(() => {
    const weatherCode = this.context()?.weather.weatherCode;
    if (weatherCode === undefined) {
      return '';
    }

    if (this.isNight()) {
      return 'Noche costera';
    }

    if (weatherCode === 0) return 'Cielo despejado';
    if (weatherCode >= 1 && weatherCode <= 3) return 'Parcialmente nublado';
    if ((weatherCode >= 51 && weatherCode <= 67) || (weatherCode >= 80 && weatherCode <= 82)) {
      return 'Lluvia ligera';
    }
    if (weatherCode >= 95) return 'Tormenta aislada';

    return 'Clima costero';
  });

  readonly weatherIcon = computed(() => {
    const weatherCode = this.context()?.weather.weatherCode;
    if (weatherCode === undefined) {
      return 'partly-sunny-outline';
    }

    if (this.isNight()) return 'moon-outline';
    if (weatherCode === 0) return 'sunny-outline';
    if (weatherCode >= 1 && weatherCode <= 3) return 'partly-sunny-outline';
    if ((weatherCode >= 51 && weatherCode <= 67) || (weatherCode >= 80 && weatherCode <= 82)) {
      return 'rainy-outline';
    }
    if (weatherCode >= 95) return 'thunderstorm-outline';

    return 'cloudy-outline';
  });

  readonly backgroundClass = computed(() => {
    const weatherCode = this.context()?.weather.weatherCode;
    if (weatherCode === undefined) {
      return 'weather-bg-default';
    }

    if (this.isNight()) return 'weather-bg-night';
    if (weatherCode === 0) return 'weather-bg-sunny';
    if (weatherCode >= 1 && weatherCode <= 3) return 'weather-bg-cloudy';
    if ((weatherCode >= 51 && weatherCode <= 67) || (weatherCode >= 80 && weatherCode <= 82)) {
      return 'weather-bg-rainy';
    }

    return 'weather-bg-cloudy';
  });

  constructor() {
    addIcons({
      businessOutline,
      sunnyOutline,
      moonOutline,
      partlySunnyOutline,
      rainyOutline,
      thunderstormOutline,
      cloudyOutline,
      locationOutline,
      medicalOutline,
      shieldCheckmarkOutline,
      storefrontOutline,
      walkOutline,
    });
  }

  async ionViewWillEnter(): Promise<void> {
    await this.loadDestinations();
  }

  async onRefresh(event: RefresherCustomEvent): Promise<void> {
    try {
      await this.loadDestinations();
    } finally {
      await event.target.complete();
    }
  }

  async onDestinationChange(event: SegmentCustomEvent): Promise<void> {
    const destinationId = event.detail.value;

    if (typeof destinationId !== 'string') {
      return;
    }

    this.selectedDestinationId.set(destinationId as DestinationId);
    await this.loadContext();
  }

  async retry(): Promise<void> {
    if (this.destinations().length === 0) {
      await this.loadDestinations();
      return;
    }

    await this.loadContext();
  }

  private async loadDestinations(): Promise<void> {
    this.loading.set(true);
    this.error.set(null);

    try {
      const destinations = await firstValueFrom(
        this.destinationsService.getDestinations(),
      );

      this.destinations.set(destinations);

      if (destinations.length === 0) {
        this.selectedDestinationId.set(null);
        this.context.set(null);
        return;
      }

      const currentSelection = this.selectedDestinationId();
      const selectedDestination =
        currentSelection &&
        destinations.some((destination) => destination.id === currentSelection)
          ? currentSelection
          : destinations[0].id;

      this.selectedDestinationId.set(selectedDestination);
      await this.loadContext(false);
    } catch (error) {
      this.error.set(getDestinationsErrorMessage(error));
    } finally {
      this.loading.set(false);
    }
  }

  private async loadContext(manageLoading = true): Promise<void> {
    const destinationId = this.selectedDestinationId();

    if (!destinationId) {
      this.context.set(null);
      return;
    }

    if (manageLoading) {
      this.loading.set(true);
    }
    this.error.set(null);

    try {
      const context = await firstValueFrom(
        this.destinationsService.getContextByDestinationId(destinationId),
      );
      this.context.set(context);
    } catch (error) {
      this.error.set(getDestinationContextErrorMessage(error));
      this.context.set(null);
    } finally {
      if (manageLoading) {
        this.loading.set(false);
      }
    }
  }

  private findForecastByDay(
    day: DestinationForecastItem['day'],
    forecast?: DestinationForecastItem[],
  ): DestinationForecastItem | null {
    if (!forecast?.length) {
      return null;
    }

    return forecast.find((item) => item.day === day) ?? null;
  }

  getPointOfInterestIcon(category: PointOfInterestCategory): string {
    switch (category) {
      case 'healthcare':
        return 'medical-outline';
      case 'safety':
        return 'shield-checkmark-outline';
      case 'downtown':
        return 'business-outline';
      case 'pharmacy':
        return 'storefront-outline';
      case 'beach':
        return 'walk-outline';
      case 'landmark':
        return 'location-outline';
      default:
        return 'location-outline';
    }
  }

  trackPointOfInterest(_: number, pointOfInterest: PointOfInterest): string {
    return pointOfInterest.id;
  }

}
