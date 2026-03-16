import { Component, OnInit, computed, inject, signal } from '@angular/core';
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
  IonToolbar,
} from '@ionic/angular/standalone';
import { ScrollHeaderDirective } from '@shared/directives/scroll-header.directive';
import { addIcons } from 'ionicons';
import {
  documentTextOutline,
  helpCircleOutline,
  informationCircleOutline,
  logoGithub,
  mailOutline,
  shieldCheckmarkOutline,
} from 'ionicons/icons';
import { environment } from 'src/environments/environment';
import { AppInfoService } from './services/app-info.service';

@Component({
  selector: 'app-info',
  templateUrl: './info.page.html',
  styleUrls: ['./info.page.scss'],
  imports: [
    RouterLink,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonMenuButton,
    IonContent,
    ScrollHeaderDirective,
    IonFooter,
    IonList,
    IonListHeader,
    IonLabel,
    IonItem,
    IonIcon,
  ],
})
export class InfoPage implements OnInit {
  private readonly appInfoService = inject(AppInfoService);

  readonly appName = 'Modo Playa App';
  readonly appVersion = signal(environment.appVersion);
  readonly appStage = computed(() => this.appInfoService.appStage());

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

  ngOnInit(): void {
    void this.loadAppVersion();
  }

  private async loadAppVersion(): Promise<void> {
    this.appVersion.set(await this.appInfoService.getAppVersion());
  }
}
