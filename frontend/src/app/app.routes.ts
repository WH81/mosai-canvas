import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { MembersListComponent } from './components/members-list/members-list.component';
import { ArtComponent } from './pages/art/art.component';
import { ContactComponent } from './pages/contact/contact.component';
import { BandDetailComponent } from './components/band-detail/band-detail.component';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'bands',
    children: [
      {
        path: ':bandSlug',  // Dynamic band slug
        component: BandDetailComponent,  // Show members for the specific band
      },
    ],
  },
  { path: 'art', component: ArtComponent },
  {
    path: 'contact',
    loadComponent: () =>
      import('./pages/contact/contact.component').then((m) => m.ContactComponent),
  },
];