import { Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

export const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'home',
        loadComponent: () =>
          import('../pages/home/home.page').then((m) => m.HomePage),
      },
      {
        path: 'favoritos',
        loadComponent: () =>
          import('../pages/favorites/favorites.page').then(
            (m) => m.FavoritesPage,
          ),
      },
      {
        path: 'destinos',
        loadComponent: () =>
          import('../pages/destinations/destinations.page').then(
            (m) => m.DestinationsPage,
          ),
      },
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      },
    ],
  },
];
