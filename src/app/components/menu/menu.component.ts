import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent {
  menuItems = [
    { name: 'Home', path: '/' },
    { 
      name: 'Bands', 
      submenu: [
        { name: 'Canvas Catalyst', path: '/bands/canvas-catalyst' },
        { name: 'Cloud Canvas', path: '/bands/cloud-canvas' },
        { name: 'Rye Canvas', path: '/bands/rye-canvas' },
        { name: 'Wailing Canvas', path: '/bands/wailing-canvas' },
        { name: 'Phosphorescent Canvas', path: '/bands/phosphorescent-canvas' },
        { name: 'Flickering Canvas', path: '/bands/flickering-canvas' },
        { name: 'Staind Glass Canvas', path: '/bands/staind-glass-canvas' }
      ]
    },
    { name: 'Art', path: '/art' },
    { name: 'Contact', path: '/contact' }
  ];

  isSubmenuOpen = false;

  toggleSubmenu() {
    this.isSubmenuOpen = !this.isSubmenuOpen;
  }
}
