import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-lodging-detail',
  templateUrl: './lodging-detail.page.html',
  styleUrls: ['./lodging-detail.page.scss'],
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonBackButton,
    IonContent,
  ],
})
export class LodgingDetailPage {
  private readonly route = inject(ActivatedRoute);
  readonly lodgingId = this.route.snapshot.paramMap.get('id') ?? '';
}
