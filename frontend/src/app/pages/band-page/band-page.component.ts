import { Component, OnInit, OnDestroy, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Subject, forkJoin, of, switchMap, takeUntil, catchError, distinctUntilChanged } from 'rxjs';

import { MembersListComponent } from '../../components/members-list/members-list.component';
import { AboutComponent } from '../../components/about/about.component';
import { SocialLinksComponent } from '../../components/social-links/social-links.component';
import { StreamingLinksComponent } from '../../components/streaming-links/streaming-links.component';
import { LatestReleasesComponent } from '../../components/releases/latest-releases/latest-releases.component';
import { PreReleasesComponent } from '../../components/releases/pre-releases/pre-releases.component';
import { PastReleasesComponent } from '../../components/releases/past-releases/past-releases.component';
import { YouTubeVideosComponent } from '../../components/youtube-videos/youtube-videos.component';

import { ReleasesService } from '../../services/releases/releases.service';
import { BandService } from '../../services/band/band.service';
import { BandLinksService } from '../../services/band-links/band-links.service';
import { StreamingPlayersService } from '../../services/streaming-players/streaming-players.service';

import { Releases } from '../../models/release/release.model';
import { Band } from '../../models/band/band.model';
import { BandLinks } from '../../models/band-links/band-links.model';
import { SocialLinks } from '../../models/social-links/social-links.model';
import { StreamingPlayers } from '../../models/streaming-players/streaming-players.model';

@Component({
  selector: 'app-band-page',
  standalone: true,
  imports: [
    CommonModule,
    AboutComponent,
    MembersListComponent,
    SocialLinksComponent,
    StreamingLinksComponent,
    LatestReleasesComponent,
    PreReleasesComponent,
    PastReleasesComponent,
    YouTubeVideosComponent,
  ],
  templateUrl: './band-page.component.html',
  styleUrls: ['./band-page.component.scss'],
})
export class BandPageComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private releaseService = inject(ReleasesService);
  private bandService = inject(BandService);
  private bandLinksService = inject(BandLinksService);
  private streamingPlayersService = inject(StreamingPlayersService);
  private cdr = inject(ChangeDetectorRef);

  private destroy$ = new Subject<void>();

  bandSlug!: string;

  bandData: Band | null = null;
  bandSocials?: SocialLinks;
  bandLinks: BandLinks = { social: undefined, streaming: undefined };
  streamingPlayer: StreamingPlayers | null = null;

  latestReleases: Releases[] = [];
  preReleases: Releases[] = [];
  pastReleases: Releases[] = [];

  get hasSocialLinks(): boolean {
    return !!(this.bandSocials && Object.values(this.bandSocials).some(val => !!val));
  }

  get hasStreamingLinks(): boolean {
    return !!(this.bandLinks.streaming && Object.values(this.bandLinks.streaming).some(val => !!val));
  }

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        takeUntil(this.destroy$),
        switchMap(params => {
          const slug = params.get('bandSlug');
          if (!slug) return of(null);
          return of(slug);
        }),
        distinctUntilChanged()
      )
      .subscribe(slug => {
        if (!slug) return;

        this.bandSlug = slug;
        this.resetPageState();

        this.bandService.getBandBySlug(slug)
          .pipe(takeUntil(this.destroy$))
          .subscribe(band => {
            if (!band) return;

            queueMicrotask(() => {
              this.bandData = band;
              this.loadRelatedData(band);
              this.loadReleases();
              this.cdr.markForCheck();
            });
          });
      });
  }

  private loadRelatedData(band: Band): void {
    forkJoin({
      social: this.bandLinksService.getSocialLinksBySlug(this.bandSlug).pipe(
        catchError(() => of(null))
      ),
      streaming: this.bandLinksService.getStreamingLinksBySlug(this.bandSlug).pipe(
        catchError(() => of(null))
      ),
      player: band._id
        ? this.streamingPlayersService.getStreamingPlayerByBandId(band._id).pipe(
            catchError(() => of(null))
          )
        : of(null),
    })
      .pipe(takeUntil(this.destroy$))
      .subscribe(result => {
        queueMicrotask(() => {
          this.bandSocials = result.social || undefined;
          this.bandLinks = {
            social: result.social || undefined,
            streaming: result.streaming || undefined,
          };
          this.streamingPlayer = result.player;
          this.cdr.markForCheck();
        });
      });
  }

  private async loadReleases(): Promise<void> {
    try {
      const releases = await this.releaseService.getAll(this.bandSlug);
      queueMicrotask(() => {
        this.categorize(releases);
        this.cdr.markForCheck();
      });
    } catch (error) {
      console.error('Error loading releases:', error);
    }
  }

  private resetPageState(): void {
    this.bandData = null;
    this.bandSocials = undefined;
    this.bandLinks = { social: undefined, streaming: undefined };
    this.streamingPlayer = null;

    this.latestReleases = [];
    this.preReleases = [];
    this.pastReleases = [];
  }

  handleLogoError(event: any): void {
    (event.target as HTMLImageElement).style.display = 'none';
  }

  ngOnDestroy(): void {
    this.bandService.clearBandState();
    this.destroy$.next();
    this.destroy$.complete();
  }

  private categorize(releases: Releases[]): void {
    const now = new Date();
    const bandReleases = releases.filter(r => r.bandSlug === this.bandSlug);

    this.preReleases = bandReleases.filter(
      r => new Date(r.releaseDate) > now
    );

    this.latestReleases = bandReleases.filter(r => {
      const d = new Date(r.releaseDate);
      const daysAgo = (now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24);
      return daysAgo >= 0 && daysAgo <= 30;
    });

    this.pastReleases = bandReleases.filter(r => {
      const d = new Date(r.releaseDate);
      const daysAgo = (now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24);
      return daysAgo > 30;
    });
  }
}