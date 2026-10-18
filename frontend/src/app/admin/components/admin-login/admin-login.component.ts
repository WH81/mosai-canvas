import {
    ChangeDetectionStrategy,
    Component,
    inject,
  } from '@angular/core';
  import { CommonModule } from '@angular/common';
  import {
    FormBuilder,
    ReactiveFormsModule,
    Validators,
  } from '@angular/forms';
  import { Router } from '@angular/router';
  import { HttpErrorResponse } from '@angular/common/http';
  import { finalize } from 'rxjs';
  
  import { AuthService } from '../../services/auth.service';

  /**
   * Administrator login component.
   *
   * Responsibilities:
   * - Collect administrator credentials.
   * - Perform client-side validation.
   * - Submit credentials through AuthService.
   * - Display a generic authentication error.
   * - Prevent duplicate submissions.
   * - Redirect successfully authenticated administrators.
   *
   * Security:
   * - Password is never logged.
   * - Authentication is performed by the backend.
   * - No JWT handling occurs in the component.
   * - Generic authentication errors prevent account enumeration.
   */
  @Component({
    selector: 'app-admin-login',
    standalone: true,
    imports: [
      CommonModule,
      ReactiveFormsModule,
    ],
    templateUrl: './admin-login.component.html',
    styleUrls: ['./admin-login.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
  })
  export class AdminLoginComponent {
    private readonly fb = inject(FormBuilder);
    private readonly authService = inject(AuthService);
    private readonly router = inject(Router);
  
    /**
     * Prevents multiple login requests while authentication
     * is already being processed.
     */
    isSubmitting = false;
  
    /**
     * Generic authentication error displayed to the user.
     *
     * Deliberately does not reveal whether the username,
     * email, or password was incorrect.
     */
    loginError = '';
  
    /**
     * Reactive login form.
     */
    readonly loginForm = this.fb.nonNullable.group({
      identifier: [
        '',
        [
          Validators.required,
          Validators.maxLength(255),
        ],
      ],
  
      password: [
        '',
        [
          Validators.required,
          Validators.maxLength(128),
        ],
      ],
    });
  
    /**
     * Submit administrator credentials.
     */
    onSubmit(): void {
      this.loginError = '';
  
      /**
       * Do not submit an invalid form.
       */
      if (this.loginForm.invalid) {
        this.loginForm.markAllAsTouched();
        return;
      }
  
      /**
       * Prevent duplicate authentication requests.
       */
      if (this.isSubmitting) {
        return;
      }
  
      this.isSubmitting = true;
  
      const { identifier, password } = this.loginForm.getRawValue();
  
      /**
       * AuthService handles:
       *
       * - POST /api/auth/login
       * - JWT storage
       * - authenticated administrator state
       */
      this.authService
        .login({
          identifier: identifier.trim(),
          password,
        })
        .pipe(
          finalize(() => {
            this.isSubmitting = false;
          })
        )
        .subscribe({
          next: () => {
            /**
             * Clear the password from the form after successful
             * authentication.
             */
            this.loginForm.controls.password.reset();
  
            /**
             * Navigate to the protected administrator area.
             *
             * The route guard we build next will protect this route.
             */
            this.router.navigate(['/admin']);
          },
  
          error: (error: HttpErrorResponse) => {
            /**
             * Do not expose backend authentication details.
             *
             * The backend intentionally returns generic
             * authentication failures.
             */
            if (
              error.status === 401 ||
              error.status === 403
            ) {
              this.loginError =
                'Invalid username/email or password.';
            } else if (error.status === 429) {
              this.loginError =
                'Too many login attempts. Please try again later.';
            } else {
              this.loginError =
                'Unable to sign in. Please try again later.';
            }
  
            /**
             * Clear the password after a failed attempt.
             *
             * This prevents the failed credential from remaining
             * in the form longer than necessary.
             */
            this.loginForm.controls.password.reset();
  
            /**
             * Keep focus/interaction state useful after failure.
             */
            this.loginForm.controls.identifier.markAsTouched();
            this.loginForm.controls.password.markAsTouched();
          },
        });
    }
  
    /**
     * Convenience getter used by the template.
     */
    get identifierControl() {
      return this.loginForm.controls.identifier;
    }
  
    /**
     * Convenience getter used by the template.
     */
    get passwordControl() {
      return this.loginForm.controls.password;
    }
  }