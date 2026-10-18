import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { RouterLink, RouterLinkActive } from '@angular/router';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-admin-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './admin-header.component.html',
  styleUrls: ['./admin-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminHeaderComponent {
  constructor(private readonly authService: AuthService) {}

  /**
   * Provides the currently authenticated administrator
   * to the template.
   *
   * AuthService only exposes the safe administrator object
   * returned by the backend.
   */
  get admin() {
    return this.authService.getCurrentAdmin();
  }

  /**
   * Clears the local authentication state.
   *
   * AuthService removes:
   *
   * - JWT
   * - administrator information
   */
  logout(): void {
    this.authService.logout();
  }
}
