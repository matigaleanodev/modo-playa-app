import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.routes').then((m) => m.routes),
  },
  {
    path: 'lodging/:id',
    loadComponent: () =>
      import('./lodgings/pages/lodging-detail/lodging-detail.page').then(
        (m) => m.LodgingDetailPage,
      ),
  },
  {
    path: 'info',
    loadComponent: () =>
      import('./pages/info/info.page').then((m) => m.InfoPage),
  },
  {
    path: 'terms',
    loadComponent: () =>
      import('./pages/legal/terms/terms.page').then((m) => m.TermsPage),
  },
  {
    path: 'privacy',
    loadComponent: () =>
      import('./pages/legal/privacy/privacy.page').then((m) => m.PrivacyPage),
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full',
  },
];
