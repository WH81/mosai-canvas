// menu.component.ts
import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
// Ensure this path is correct for your project structure
import { menuItems } from '../../shared/nav-config';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent {
  // Array holding your menu items, imported from nav-config.ts
  menuItems = menuItems;

  // Boolean to control the visibility of the mobile menu overlay
  isMobileMenuOpen: boolean = false;

  // Object to manage the open/closed state of individual mobile dropdowns
  // Key: menu item name, Value: boolean (true if open, false if closed)
  isMobileDropdownOpen: { [key: string]: boolean } = {};

  /**
   * Toggles the visibility of the mobile menu.
   * If the menu is being closed, it also closes all open mobile dropdowns.
   */
  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
    if (!this.isMobileMenuOpen) {
      // If the main mobile menu is closed, ensure all sub-dropdowns are also closed
      this.isMobileDropdownOpen = {};
    }
  }

  /**
   * Closes the mobile menu and all its open dropdowns.
   * This is typically called when a menu item is clicked or the close button is pressed.
   */
  closeMobileMenu(): void {
    this.isMobileMenuOpen = false;
    this.isMobileDropdownOpen = {}; // Close all dropdowns
  }

  /**
   * Toggles the visibility of a specific mobile dropdown.
   * @param itemName The name of the menu item whose dropdown is to be toggled.
   */
  toggleMobileDropdown(itemName: string): void {
    // Toggle the boolean value for the specific item name
    this.isMobileDropdownOpen[itemName] = !this.isMobileDropdownOpen[itemName];
  }

  /**
   * Listens for window resize events to automatically close the mobile menu
   * if the screen is resized to a desktop width (greater than 768px).
   * This prevents the mobile menu from being stuck open on desktop.
   * @param event The window resize event.
   */
  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    // Check if the window width is greater than the mobile breakpoint (768px)
    // and if the mobile menu is currently open.
    if ((event.target as Window).innerWidth > 768 && this.isMobileMenuOpen) {
      this.closeMobileMenu(); // Close the mobile menu
    }
  }
}
