import { Routes } from '@angular/router';
import { adminGuard } from './admin/guards/admin.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'band/:bandSlug',
    loadComponent: () =>
      import('./pages/band-page/band-page.component').then(
        (m) => m.BandPageComponent
      ),
  },
  {
    path: 'art',
    loadComponent: () =>
      import('./pages/art/art.component').then((m) => m.ArtComponent),
  },
  {
    path: 'contact',
    loadComponent: () =>
      import('./pages/contact/contact.component').then(
        (m) => m.ContactComponent
      ),
  },

  /**
   * Public administrator login.
   */
  {
    path: 'admin-login',
    loadComponent: () =>
      import('./admin/components/admin-login/admin-login.component').then(
        (m) => m.AdminLoginComponent
      ),
  },

  /**
   * Protected administrator application.
   */
  {
    path: 'admin',
    canActivate: [adminGuard],
    canActivateChild: [adminGuard],

    loadComponent: () =>
      import('./admin/layout/admin-shell/admin-shell.component').then(
        (m) => m.AdminShellComponent
      ),

    children: [
      {
        path: '',
        loadComponent: () =>
          import(
            './admin/components/admin-dashboard/admin-dashboard.component'
          ).then((m) => m.AdminDashboardComponent),
      },
      {
        path: 'about',
        loadComponent: () =>
          import('./admin/components/admin-about/admin-about.component').then(
            (m) => m.AdminAboutComponent
          ),
      },
      {
        path: 'bands',
        loadComponent: () =>
          import(
            './admin/components/admin-bands/admin-bands.component'
          ).then((m) => m.AdminBandsComponent),
      },
      {
        path: 'bands/:bandSlug/links',
        loadComponent: () =>
          import(
            './admin/components/admin-band-links/admin-band-links.component'
          ).then((m) => m.AdminBandLinksComponent),
      },
      {
        path: 'carousel',
        loadComponent: () =>
          import(
            './admin/components/admin-carousel/admin-carousel.component'
          ).then((m) => m.AdminCarouselComponent),
      },
      {
        path: 'tours',
        loadComponent: () =>
          import('./admin/components/admin-tours/admin-tours.component').then(
            (m) => m.AdminToursComponent
          ),
      },
      {
        path: 'get-connected',
        loadComponent: () =>
          import(
            './admin/components/admin-get-connected/admin-get-connected.component'
          ).then((m) => m.AdminGetConnectedComponent),
      },
      {
        path: 'artists',
        loadComponent: () =>
          import('./admin/components/admin-artists/admin-artists.component')
            .then((m) => m.AdminArtistsComponent),
      },
      {
        path: 'artists/:bandSlug',
        loadComponent: () =>
          import(
            './admin/components/admin-artist-editor/admin-artist-editor.component'
          ).then((m) => m.AdminArtistEditorComponent),
      },
    ],
  },

  /**
   * Optional fallback.
   *
   * Unknown routes return to the public home page.
   */
  {
    path: '**',
    redirectTo: '',
  },
];
