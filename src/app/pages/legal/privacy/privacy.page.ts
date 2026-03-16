import { Component } from '@angular/core';
import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonFooter,
  IonHeader,
  IonMenuButton,
  IonToolbar,
} from '@ionic/angular/standalone';
import { ScrollHeaderDirective } from '@shared/directives/scroll-header.directive';

@Component({
  selector: 'app-privacy',
  templateUrl: './privacy.page.html',
  styleUrls: ['./privacy.page.scss'],
  imports: [
    IonButtons,
    IonBackButton,
    IonContent,
    ScrollHeaderDirective,
    IonFooter,
    IonHeader,
    IonMenuButton,
    IonToolbar,
  ],
})
export class PrivacyPage {
  readonly contactEmail = 'contacto@modoplaya.app';
}
