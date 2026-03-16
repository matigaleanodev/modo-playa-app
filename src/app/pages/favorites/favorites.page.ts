import { Component, computed, inject } from '@angular/core';
import {
  IonButtons,
  IonContent,
  IonHeader,
  IonMenuButton,
  IonToolbar,
} from '@ionic/angular/standalone';
import { ScrollHeaderDirective } from '@shared/directives/scroll-header.directive';
import { LodgingCardComponent } from 'src/app/lodgings/components/lodging-card/lodging-card.component';
import { Lodging } from 'src/app/lodgings/models/lodging.model';
import { LodgingsResourceService } from 'src/app/lodgings/services/lodgings-resource.service';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.page.html',
  styleUrls: ['./favorites.page.scss'],
  imports: [
    IonHeader,
    IonToolbar,
    IonButtons,
    IonMenuButton,
    IonContent,
    ScrollHeaderDirective,
    LodgingCardComponent,
  ],
})
export class FavoritesPage {
  private readonly lodgingsResource = inject(LodgingsResourceService);

  readonly favorites = computed(() => this.lodgingsResource.favorites());
  readonly hasFavorites = computed(() => this.favorites().length > 0);

  async ionViewWillEnter(): Promise<void> {
    await this.lodgingsResource.loadFavorites();
  }

  toLodgingDetail(lodging: Lodging): void {
    this.lodgingsResource.toLodgingDetail(lodging);
  }

  async toggleFavorite(lodging: Lodging): Promise<void> {
    await this.lodgingsResource.toggleFavorite(lodging);
  }
}
