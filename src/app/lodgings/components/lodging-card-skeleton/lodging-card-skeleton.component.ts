import { Component } from '@angular/core';
import {
  IonCard,
  IonCardContent,
  IonSkeletonText,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-lodging-card-skeleton',
  templateUrl: './lodging-card-skeleton.component.html',
  styleUrls: ['./lodging-card-skeleton.component.scss'],
  imports: [IonCard, IonCardContent, IonSkeletonText],
})
export class LodgingCardSkeletonComponent {}
