import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { RouterModule } from '@angular/router';
import { MenuComponent } from './components/menu/menu.component';
import { FooterComponent } from './components/footer/footer.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [RouterModule, MenuComponent, FooterComponent],
})
export class AppComponent {
  constructor(private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const slug = this.extractSlug(event.urlAfterRedirects);
        this.setBodyBackgroundClass(slug);
      }
    });
  }

  /**
   * Extracts the last path segment as the route slug
   */
  private extractSlug(url: string): string {
    const segments = url.split('/').filter(Boolean);
    return segments.length > 0 ? segments[segments.length - 1] : 'home';
  }

  /**
   * Adds the correct background class to the <body> based on route slug
   */
  private setBodyBackgroundClass(slug: string): void {
    const body = document.body;

    // Remove previous bg- classes
    body.classList.remove(
      ...Array.from(body.classList).filter(c => c.startsWith('bg-'))
    );

    // Sanitize slug for CSS class usage
    const safeSlug = slug.replace(/[^a-zA-Z0-9-_]/g, '');

    // Add the new background class
    body.classList.add(`bg-${safeSlug || 'home'}`);
  }
}
