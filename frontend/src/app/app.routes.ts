import { Routes } from '@angular/router';
// import { BandDetailComponent } from './components/band-detail/band-detail.component';

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
  // {
  //   path: 'bands',
  //   children: [
  //     {
  //       path: ':bandSlug',
  //       component: BandDetailComponent,
  //     },
  //   ],
  // },
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
