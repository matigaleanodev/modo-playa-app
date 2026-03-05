import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonFooter,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonMenuButton,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  documentTextOutline,
  helpCircleOutline,
  informationCircleOutline,
  logoGithub,
  mailOutline,
  shieldCheckmarkOutline,
} from 'ionicons/icons';

@Component({
  selector: 'app-info',
  templateUrl: './info.page.html',
  styleUrls: ['./info.page.scss'],
  imports: [
    RouterLink,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonBackButton,
    IonMenuButton,
    IonContent,
    IonFooter,
    IonList,
    IonListHeader,
    IonLabel,
    IonItem,
    IonIcon,
  ],
})
export class InfoPage {
  readonly appName = 'Modo Playa App';
  readonly appVersion = '1.0.0';
  readonly appStage = 'Produccion';

  readonly contactEmail = 'contacto@modoplaya.app';
  readonly githubUrl = 'https://github.com/matigaleanodev/modo-playa-app';
  readonly helpUrl = 'https://github.com/matigaleanodev/modo-playa-app/issues';

  constructor() {
    addIcons({
      mailOutline,
      logoGithub,
      helpCircleOutline,
      shieldCheckmarkOutline,
      documentTextOutline,
      informationCircleOutline,
    });
  }
}
