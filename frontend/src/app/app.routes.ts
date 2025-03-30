import { Routes } from '@angular/router';
import { MemberBioComponent } from './components/members-bio/members-bio.component';
import { MembersListComponent } from './components/members-list/members-list.component';
import { ArtComponent } from './pages/art/art.component';
import { ContactComponent } from './pages/contact/contact.component';

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
          path: 'cloud-canvas',
          component: MembersListComponent, // Display list of members for Cloud Canvas
          data: { band: 'cloud-canvas' }, // Pass band info via data
        },
        {
          path: 'canvas-catalyst',
          component: MembersListComponent, // Display list of members for Canvas Catalyst
          data: { band: 'canvas-catalyst' }, // Pass band info via data
        },
        {
          path: 'rye-canvas',
          component: MembersListComponent, // Display list of members for Rye Canvas
          data: { band: 'rye-canvas' }, // Pass band info via data
        },
        {
          path: 'wailing-canvas',
          component: MembersListComponent, // Display list of members for Wailing Canvas
          data: { band: 'wailing-canvas' }, // Pass band info via data
        },
        {
          path: 'phosphorescent-canvas',
          component: MembersListComponent, // Display list of members for Phosphorescent Canvas
          data: { band: 'phosphorescent-canvas' }, // Pass band info via data
        },
        {
          path: 'flickering-canvas',
          component: MembersListComponent, // Display list of members for Flickering Canvas
          data: { band: 'flickering-canvas' }, // Pass band info via data
        },
        {
          path: 'staind-glass-canvas',
          component: MembersListComponent, // Display list of members for Staind Glass Canvas
          data: { band: 'staind-glass-canvas' }, // Pass band info via data
        },
        {
          path: 'cloud-canvas/:id',
          component: MemberBioComponent, // Display individual member bio for Cloud Canvas
        },
        // Add other routes...
      ],
    },
    { path: 'art', component: ArtComponent },
    { path: 'contact', component: ContactComponent },
  ];
  