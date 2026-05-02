import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Releases } from '../../../models/release/release.model';

@Component({
  selector: 'app-latest-releases',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './latest-releases.component.html',
  styleUrls: ['./latest-releases.component.scss']
})
export class LatestReleasesComponent {
  @Input() latestReleases: Releases[] = [];
  @Input() bandSlug!: string;
  @Output() action = new EventEmitter<{ type: string; release: Releases }>();

  /**
   * Safe getter for the headline year.
   * Resolves NG8107 by moving logic out of the template.
   */
  get displayYear(): string {
    const firstRelease = this.latestReleases[0];
    if (firstRelease && firstRelease.releaseDate) {
      return new Date(firstRelease.releaseDate).getFullYear().toString();
    }
    return '2026';
  }

  onTrackAction(type: string, release: Releases) {
    this.action.emit({ type, release });
  }
}