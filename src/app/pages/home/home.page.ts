import { Component, computed, inject } from '@angular/core';
import {
  IonButtons,
  IonContent,
  IonHeader,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonMenuButton,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { LodgingCardComponent } from 'src/app/lodgings/components/lodging-card/lodging-card.component';
import { Lodging } from 'src/app/lodgings/models/lodging.model';
import { LodgingsResourceService } from 'src/app/lodgings/services/lodgings-resource.service';
import { LodgingCardSkeletonComponent } from 'src/app/lodgings/components/lodging-card-skeleton/lodging-card-skeleton.component';
import { InfiniteScrollCustomEvent } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonMenuButton,
    IonContent,
    IonInfiniteScroll,
    IonInfiniteScrollContent,
    LodgingCardComponent,
    LodgingCardSkeletonComponent,
  ],
})
export class HomePage {
  private readonly lodgingsResource = inject(LodgingsResourceService);

  readonly lodgings = computed(() => this.lodgingsResource.lodgings());
  readonly isLoading = computed(() => this.lodgingsResource.isLoading());
  readonly isLoadingMore = computed(() => this.lodgingsResource.isLoadingMore());
  readonly hasMore = computed(() => this.lodgingsResource.hasMore());
  readonly skeletonCards = Array.from({ length: 4 });

  async ionViewWillEnter(): Promise<void> {
    await this.lodgingsResource.loadFavorites();

    if (this.lodgings().length === 0) {
      await this.lodgingsResource.loadInitialLodgings();
    }
  }

  toLodgingDetail(lodging: Lodging): void {
    this.lodgingsResource.toLodgingDetail(lodging);
  }

  async onInfiniteScroll(event: InfiniteScrollCustomEvent): Promise<void> {
    try {
      await this.lodgingsResource.loadNextLodgingsPage();
    } finally {
      event.target.disabled = !this.hasMore();
      await event.target.complete();
    }
  }
}
