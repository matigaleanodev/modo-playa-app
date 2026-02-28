import {
  Component,
  EnvironmentInjector,
  computed,
  inject,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  ActionSheetController,
  IonButtons,
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonMenu,
  IonMenuButton,
  IonMenuToggle,
  IonNote,
  IonHeader,
  IonRouterOutlet,
  IonRouterLink,
  IonTabBar,
  IonTabButton,
  IonTabs,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  cloudyNightOutline,
  heartOutline,
  homeOutline,
  informationCircleOutline,
  moonOutline,
  phonePortraitOutline,
  sunnyOutline,
} from 'ionicons/icons';
import { ThemeService } from '../shared/services/theme/theme.service';

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
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonMenuButton,
    IonMenu,
    IonContent,
    IonList,
    IonListHeader,
    IonItem,
    IonLabel,
    IonMenuToggle,
    IonTabs,
    IonRouterOutlet,
    IonTabBar,
    IonTabButton,
    IonIcon,
    IonNote,
    RouterLink,
    IonRouterLink,
  ],
})
export class TabsPage {
  public environmentInjector = inject(EnvironmentInjector);
  private readonly actionSheetCtrl = inject(ActionSheetController);
  private readonly themeService = inject(ThemeService);

  readonly currentThemeLabel = computed(() => {
    const theme = this.themeService.currentTheme();
    if (theme === 'light') return 'Claro';
    if (theme === 'dark') return 'Oscuro';
    return 'Sistema';
  });

  readonly tabItems: NavigationLinkItem[] = [
    {
      id: 'tab-home',
      type: 'link',
      label: 'Home',
      path: '/home',
      icon: 'home-outline',
    },
    {
      id: 'tab-favorites',
      type: 'link',
      label: 'Favoritos',
      path: '/favoritos',
      icon: 'heart-outline',
    },
    {
      id: 'tab-context',
      type: 'link',
      label: 'Contexto',
      path: '/contexto',
      icon: 'cloudy-night-outline',
    },
  ];

  readonly menuSections: NavigationSection[] = [
    {
      title: 'Rutas',
      items: [
        {
          id: 'menu-home',
          type: 'link',
          label: 'Home',
          path: '/home',
          icon: 'home-outline',
        },
        {
          id: 'menu-favorites',
          type: 'link',
          label: 'Favoritos',
          path: '/favoritos',
          icon: 'heart-outline',
        },
        {
          id: 'menu-context',
          type: 'link',
          label: 'Contexto',
          path: '/contexto',
          icon: 'cloudy-night-outline',
        },
        {
          id: 'menu-info',
          type: 'link',
          label: 'Info',
          path: '/info',
          icon: 'information-circle-outline',
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
          icon: 'phone-portrait-outline',
          action: 'theme',
        },
      ],
    },
  ];

  constructor() {
    addIcons({
      homeOutline,
      heartOutline,
      cloudyNightOutline,
      informationCircleOutline,
      moonOutline,
      sunnyOutline,
      phonePortraitOutline,
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
          icon: 'sunny-outline',
          handler: () => this.themeService.setTheme('light'),
        },
        {
          text: 'Oscuro',
          icon: 'moon-outline',
          handler: () => this.themeService.setTheme('dark'),
        },
        {
          text: 'Sistema',
          icon: 'phone-portrait-outline',
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
