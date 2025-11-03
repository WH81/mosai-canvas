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
import { Band } from '../../models/band/band.model';
import { BandLogoComponent } from '../band-logo/band-logo.component';
import { BandAboutComponent } from '../band-about/band-about.component';
import { HttpClient } from '@angular/common/http';
import { StreamingPlayersComponent } from '../../components/streaming-player/streaming-players.component';
import { StreamingPlayers } from '../../models/streaming-players/streaming-players.model';
import { StreamingPlayersService } from '../../services/streaming-players/streaming-players.service';

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
    if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      this.renderer.addClass(this.el.nativeElement, 'scrolled-in');
      return;
    }

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
      { threshold: 0.1 }
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
    ScrollAnimationDirective,
    BandLogoComponent,
    BandAboutComponent,
    StreamingPlayersComponent
  ],
  templateUrl: './band-detail.component.html',
  styleUrls: ['./band-detail.component.scss'],
})
export class BandDetailComponent implements OnInit, OnDestroy {
  band: Band | undefined = undefined;
  streamingPlayers: StreamingPlayers = {};
  private routeSub?: Subscription;
  imageLoaded = false;

  constructor(
    private bandService: BandService,
    private route: ActivatedRoute,
    private streamingPlayersService: StreamingPlayersService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.routeSub = this.route.params.subscribe(params => {
      const slug = params['bandSlug'];
      this.getBand(slug);
    });
  }

  getBand(slug: string): void {
    this.band = undefined;
    this.imageLoaded = false;

    this.bandService.getBandBySlug(slug).subscribe({
      next: (data: Band) => {
        this.band = {
          ...data,
          socialLinks: data.socialLinks || undefined,
          streamingLinks: undefined
        };

        if (this.band.image) {
          const img = new Image();
          img.src = this.band.image;
          img.onload = () => {
            this.imageLoaded = true;
          };
        }

        // Fetch streaming player separately using the new front-end model.
        // It's assumed the API response structure is the correct one.
        if (this.band._id) {
          this.streamingPlayersService.getStreamingPlayerById(this.band._id)
          .subscribe({
            next: (player: StreamingPlayers) => {
              this.streamingPlayers = {
                spotifyUrl: player.spotifyUrl || undefined,
                appleMusicUrl: player.appleMusicUrl || undefined
              };
              console.log('Mapped streamingPlayers:', this.streamingPlayers);
            },
            error: (err) => console.error('Error fetching streaming player:', err)
          });
        }
      },
      error: (err) => console.error('Error fetching band data:', err)
    });
  }

  ngOnDestroy(): void {
    this.routeSub?.unsubscribe();
  }
}