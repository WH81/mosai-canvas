import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReleasesService } from '../../services/releases/releases.service';
import { Releases } from '../../models/release/release.model';
import { LatestReleasesComponent } from '../../components/releases/latest-releases/latest-releases.component';
import { PreReleasesComponent } from '../../components/releases/pre-releases/pre-releases.component';
import { PastReleasesComponent } from '../../components/releases/past-releases/past-releases.component';
import { Subscription, interval } from 'rxjs';

const OUT_NOW_WINDOW_DAYS = 30; // configurable window for "latest"

@Component({
  selector: 'app-releases-page',
  standalone: true,
  imports: [CommonModule, LatestReleasesComponent, PreReleasesComponent, PastReleasesComponent],
  templateUrl: './releases.component.html',
  styleUrls: ['./releases.component.scss']
})
export class ReleasesComponent implements OnInit, OnDestroy {
  latestReleases: Releases[] = [];
  preReleases: Releases[] = [];
  pastReleases: Releases[] = [];
  loading = true;
  error: string | null = null;

  private pollSub?: Subscription;
  private midnightTimerId?: number;

  constructor(private releaseService: ReleasesService) {}

  async ngOnInit() {
    await this.load();

    // Poll every 30s for backend changes
    // this.pollSub = interval(30000).subscribe(() => this.load());

    // Schedule a one-off reload at visitor's local midnight plus a small buffer
    this.scheduleLocalMidnightReload();
  }

  ngOnDestroy() {
    this.pollSub?.unsubscribe();
    if (this.midnightTimerId !== undefined) {
      clearTimeout(this.midnightTimerId);
    }
  }

  private scheduleLocalMidnightReload() {
    const now = new Date();
    const nextMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    const msUntilMidnight = nextMidnight.getTime() - now.getTime();

    this.midnightTimerId = window.setTimeout(() => {
      this.load().then(() => this.scheduleLocalMidnightReload());
    }, msUntilMidnight + 1000);
  }

  private async load() {
    this.loading = true;
    try {
      const releases = await this.releaseService.getAll();
      this.categorize(releases);
    } catch (err) {
      console.error('Release fetch error:', err);
      this.error = 'Failed to load releases';
    } finally {
      this.loading = false;
    }
  }

  private categorize(releases: Releases[]) {
    const now = new Date();
    const localMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const windowMs = OUT_NOW_WINDOW_DAYS * 24 * 60 * 60 * 1000;
    const oneMonthAgo = new Date(localMidnight.getTime() - windowMs);

    const items = releases.map(r => {
      let parsedDate: Date;

      if (r.releaseDate && /^\d{4}-\d{2}-\d{2}$/.test(r.releaseDate)) {
        // Plain YYYY-MM-DD string → local midnight
        const [y, m, d] = r.releaseDate.split('-').map(Number);
        parsedDate = new Date(y, m - 1, d);
      } else {
        // ISO string or other formats → parse as UTC and convert to local midnight
        const d = new Date(r.releaseDate);
        parsedDate = new Date(d.getFullYear(), d.getMonth(), d.getDate());
      }

      return { ...r, _parsedDate: parsedDate };
    });

    const preItems = items
      .filter((r: any) => {
        const d = r._parsedDate;
        const dLocal = new Date(d.getFullYear(), d.getMonth(), d.getDate());
        return dLocal.getTime() > localMidnight.getTime();
      })
      .sort((a: any, b: any) => a._parsedDate.getTime() - b._parsedDate.getTime());

    this.preReleases.splice(0, this.preReleases.length, ...preItems);

    const latestItems = items
      .filter((r: any) => {
        const d = r._parsedDate;
        const dLocal = new Date(d.getFullYear(), d.getMonth(), d.getDate());
        return dLocal.getTime() <= localMidnight.getTime() && dLocal.getTime() >= oneMonthAgo.getTime();
      })
      .sort((a: any, b: any) => b._parsedDate.getTime() - a._parsedDate.getTime());

    this.latestReleases.splice(0, this.latestReleases.length, ...latestItems);

    const pastItems = items
      .filter((r: any) => {
        const d = r._parsedDate;
        const dLocal = new Date(d.getFullYear(), d.getMonth(), d.getDate());
        return dLocal.getTime() < oneMonthAgo.getTime();
      })
      .sort((a: any, b: any) => b._parsedDate.getTime() - a._parsedDate.getTime());

    this.pastReleases.splice(0, this.pastReleases.length, ...pastItems);
  }

  onCardAction(event: { type: string; release: Releases }) {
    const { type, release } = event;
    if (!release || !release._id) return;

    if (type === 'ics') {
      window.open(this.releaseService.getIcsUrl(release._id), '_blank');
      return;
    }

    if (type === 'google') {
      window.open(this.releaseService.getGoogleUrl(release._id), '_blank');
      return;
    }

    if (type === 'presave_spotify' && release.preSaveSpotifyUrl) {
      window.open(release.preSaveSpotifyUrl, '_blank');
      return;
    }

    if (type === 'presave_apple' && release.preSaveAppleMusicUrl) {
      window.open(release.preSaveAppleMusicUrl, '_blank');
      return;
    }

    if (type === 'listen_spotify' && release.spotifyUrl) {
      window.open(release.spotifyUrl, '_blank');
      return;
    }

    if (type === 'listen_apple' && release.appleMusicUrl) {
      window.open(release.appleMusicUrl, '_blank');
      return;
    }

    if (type === 'listen_youtube' && release.youtubeUrl) {
      window.open(release.youtubeUrl, '_blank');
      return;
    }

    console.warn('Unknown card action:', type, release);
  }
}
