import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AboutComponent } from '../../components/about/about.component';
import { CarouselComponent } from '../../components/carousel/carousel.component';
import { MosaicanvasLogoComponent } from '../../components/mosaicanvas-logo/mosaicanvas-logo.component';
import { TourComponent } from '../../components/tour/tour.component';
import { MailingListComponent } from '../../components/mailing-list/mailing-list.component';
import { RingtonesComponent } from '../../components/ringtones/ringtones.component';

import { LatestReleasesComponent } from '../../components/releases/latest-releases/latest-releases.component';
import { PreReleasesComponent } from '../../components/releases/pre-releases/pre-releases.component';

import { SocialLinksComponent } from '../../components/social-links/social-links.component';
import { StreamingLinksComponent } from '../../components/streaming-links/streaming-links.component';
import { SocialLinks } from '../../models/social-links/social-links.model';
import { StreamingLinks } from '../../models/streaming-links/streaming-links.model';
import { Releases } from '../../models/release/release.model';

import { BandService } from '../../services/band/band.service';
import { BandLinksService } from '../../services/band-links/band-links.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    AboutComponent,
    CarouselComponent,
    MosaicanvasLogoComponent,
    TourComponent,
    LatestReleasesComponent,
    PreReleasesComponent,
    RingtonesComponent,
    MailingListComponent,
    SocialLinksComponent,
    StreamingLinksComponent,
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  private bandService = inject(BandService);
  private bandLinksService = inject(BandLinksService);
  private cdr = inject(ChangeDetectorRef);

  socialLinks?: SocialLinks;
  streamingLinks?: StreamingLinks;
  latestReleasesList: Releases[] = [];
  preReleasesList: Releases[] = [];

  readonly homepageBandSlug = 'mosai-canvas';

  ngOnInit(): void {
    this.loadLinksDirectly();
  }

  private loadLinksDirectly(): void {
    this.bandService.getBandBySlug(this.homepageBandSlug).subscribe({
      next: (band) => {
        if (!band?._id) return;

        this.bandLinksService.getSocialLinksByBandId(band._id).subscribe({
          next: (data) => {
            this.socialLinks = data;
            this.cdr.detectChanges();
          }
        });

        this.bandLinksService.getStreamingLinksByBandId(band._id).subscribe({
          next: (data) => {
            this.streamingLinks = data;
            this.cdr.detectChanges();
          }
        });
      }
    });
  }

  onReleaseAction(event: { type: string; release: Releases }): void {
    console.log('Release action triggered:', event);
  }
}