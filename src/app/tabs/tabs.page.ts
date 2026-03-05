import {
  Component,
  EnvironmentInjector,
  inject,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  IonIcon,
  IonLabel,
  IonTabBar,
  IonTabButton,
  IonTabs,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { cloudyNight, heart, home } from 'ionicons/icons';

interface NavigationLinkItem {
  id: string;
  type: 'link';
  label: string;
  path: string;
  icon: string;
}

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
  imports: [
    IonTabs,
    IonTabBar,
    IonTabButton,
    IonIcon,
    IonLabel,
    RouterLink,
  ],
})
export class TabsPage {
  public environmentInjector = inject(EnvironmentInjector);

  readonly tabItems: NavigationLinkItem[] = [
    {
      id: 'tab-favorites',
      type: 'link',
      label: 'Favoritos',
      path: 'favoritos',
      icon: 'heart',
    },
    {
      id: 'tab-home',
      type: 'link',
      label: 'Home',
      path: 'home',
      icon: 'home',
    },
    {
      id: 'tab-destinations',
      type: 'link',
      label: 'Destinos',
      path: 'destinos',
      icon: 'cloudy-night',
    },
  ];

  constructor() {
    addIcons({
      home,
      heart,
      cloudyNight,
    });
  }
}
