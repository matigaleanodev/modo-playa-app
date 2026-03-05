import { Component, computed, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import {
  ActionSheetController,
  IonApp,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonMenu,
  IonMenuToggle,
  IonNote,
  IonRouterLink,
  IonRouterOutlet,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  cloudyNight,
  heart,
  home,
  informationCircle,
  moon,
  phonePortrait,
  sunny,
} from 'ionicons/icons';
import { ThemeService } from '@shared/services/theme/theme.service';

interface NavigationLinkItem {
  id: string;
  type: 'link';
  label: string;
  path: string;
  icon: string;
}

interface NavigationActionItem {
  id: string;
  type: 'action';
  label: string;
  icon: string;
  action: 'theme';
}

type NavigationItem = NavigationLinkItem | NavigationActionItem;

interface NavigationSection {
  title: string;
  items: NavigationItem[];
}

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [
    IonApp,
    IonMenu,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonList,
    IonListHeader,
    IonItem,
    IonLabel,
    IonMenuToggle,
    IonRouterOutlet,
    IonIcon,
    IonNote,
    RouterLink,
    IonRouterLink,
    RouterLinkActive,
  ],
})
export class AppComponent {
  private readonly actionSheetCtrl = inject(ActionSheetController);
  private readonly themeService = inject(ThemeService);

  readonly currentThemeLabel = computed(() => {
    const theme = this.themeService.currentTheme();
    if (theme === 'light') return 'Claro';
    if (theme === 'dark') return 'Oscuro';
    return 'Sistema';
  });

  readonly menuSections: NavigationSection[] = [
    {
      title: 'Rutas',
      items: [
        {
          id: 'menu-home',
          type: 'link',
          label: 'Home',
          path: '/home',
          icon: 'home',
        },
        {
          id: 'menu-favorites',
          type: 'link',
          label: 'Favoritos',
          path: '/favoritos',
          icon: 'heart',
        },
        {
          id: 'menu-destinations',
          type: 'link',
          label: 'Destinos',
          path: '/destinos',
          icon: 'cloudy-night',
        },
        {
          id: 'menu-info',
          type: 'link',
          label: 'Info',
          path: '/info',
          icon: 'information-circle',
        },
      ],
    },
    {
      title: 'Ajustes',
      items: [
        {
          id: 'menu-theme',
          type: 'action',
          label: 'Tema',
          icon: 'phone-portrait',
          action: 'theme',
        },
      ],
    },
  ];

  constructor() {
    addIcons({
      home,
      heart,
      cloudyNight,
      informationCircle,
      moon,
      sunny,
      phonePortrait,
    });
  }

  async onMenuAction(action: NavigationActionItem['action']): Promise<void> {
    if (action === 'theme') {
      await this.openThemeSelector();
    }
  }

  private async openThemeSelector(): Promise<void> {
    const sheet = await this.actionSheetCtrl.create({
      header: 'Tema',
      buttons: [
        {
          text: 'Claro',
          icon: 'sunny',
          handler: () => this.themeService.setTheme('light'),
        },
        {
          text: 'Oscuro',
          icon: 'moon',
          handler: () => this.themeService.setTheme('dark'),
        },
        {
          text: 'Sistema',
          icon: 'phone-portrait',
          handler: () => this.themeService.setTheme('system'),
        },
        {
          text: 'Cancelar',
          role: 'cancel',
        },
      ],
    });

    await sheet.present();
  }
}
