import {
  Component,
  OnInit,
  OnDestroy,
  Directive,
  ElementRef,
  AfterViewInit,
  Renderer2
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BandService } from '../../services/bands/band.service';
import { CommonModule } from '@angular/common';
import { MembersListComponent } from '../../components/members-list/members-list.component';
import { Subscription } from 'rxjs';
import { SocialLinksComponent } from '../social-links/social-links.component';
import { StreamingLinksComponent } from '../streaming-links/streaming-links.component';

/**
 * Directive: appScrollAnimation
 * Adds the 'scrolled-in' class when the host element enters the viewport.
 * Respects prefers-reduced-motion and falls back gracefully if IntersectionObserver is unavailable.
 */
@Directive({
  selector: '[appScrollAnimation]'
})
export class ScrollAnimationDirective implements AfterViewInit, OnDestroy {
  private observer?: IntersectionObserver;

  constructor(private el: ElementRef<HTMLElement>, private renderer: Renderer2) {}

  ngAfterViewInit(): void {
    // Respect reduced motion preference: show immediately without animation
    if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      this.renderer.addClass(this.el.nativeElement, 'scrolled-in');
      return;
    }

    // If IntersectionObserver is not supported, reveal immediately
    if (typeof IntersectionObserver === 'undefined') {
      this.renderer.addClass(this.el.nativeElement, 'scrolled-in');
      return;
    }

    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.renderer.addClass(this.el.nativeElement, 'scrolled-in');
            if (this.observer) {
              this.observer.unobserve(this.el.nativeElement);
            }
          }
        });
      },
      {
        threshold: 0.1
      }
    );

    this.observer.observe(this.el.nativeElement);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}

@Component({
  selector: 'app-band-detail',
  standalone: true,
  imports: [
    CommonModule,
    MembersListComponent,
    SocialLinksComponent,
    StreamingLinksComponent,
    ScrollAnimationDirective
  ],
  templateUrl: './band-detail.component.html',
  styleUrls: ['./band-detail.component.scss'],
})
export class BandDetailComponent implements OnInit, OnDestroy {
  band: any;
  private routeSub: Subscription | undefined;
  imageLoaded = false;

  constructor(
    private bandService: BandService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.routeSub = this.route.params.subscribe((params) => {
      const slug = params['bandSlug'];
      this.getBand(slug);
    });
  }

  getBand(slug: string): void {
    this.bandService.getBandBySlug(slug).subscribe(
      (data) => {
        // Safely assign
        this.band = {
          ...data,
          socialLinks: data.socialLinks || null,
          streamingLinks: data.streamingLinks || null
        };
  
        const img = new Image();
        img.src = this.band.image;
        img.onload = () => {
          this.imageLoaded = true;
        };
      },
      (error) => {
        console.error('Error fetching band data:', error);
      }
    );
  }

  ngOnDestroy(): void {
    if (this.routeSub) {
      this.routeSub.unsubscribe();
    }
  }
}
