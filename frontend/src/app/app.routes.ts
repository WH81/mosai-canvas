import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'band/:bandSlug',
    loadComponent: () =>
      import('./pages/band-page/band-page.component')
        .then(m => m.BandPageComponent)
  },  
  {
    path: 'art',
    loadComponent: () =>
      import('./pages/art/art.component').then((m) => m.ArtComponent),
  },
  {
    path: 'contact',
    loadComponent: () =>
      import('./pages/contact/contact.component').then((m) => m.ContactComponent),
  },
];
