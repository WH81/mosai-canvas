import { Component, OnInit, inject } from '@angular/core'; // Added inject for modern coding trends
import { CommonModule } from '@angular/common';
import { AboutComponent } from '../../components/about/about.component';
import { CarouselComponent } from '../../components/carousel/carousel.component';
import { MosaicanvasLogoComponent } from '../../components/mosaicanvas-logo/mosaicanvas-logo.component';
import { TourComponent } from '../../components/tour/tour.component';
import { MailingListComponent } from '../../components/mailing-list/mailing-list.component';
import { RingtonesComponent } from '../../components/ringtones/ringtones.component';
import { ReleasesComponent } from '../releases/releases.component';
import { SocialLinksComponent } from '../../components/social-links/social-links.component';
import { StreamingLinksComponent } from '../../components/streaming-links/streaming-links.component';
import { SocialLinks } from '../../models/social-links/social-links.model';
import { StreamingLinks } from '../../models/streaming-links/streaming-links.model';
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
    RingtonesComponent,
    MailingListComponent,
    ReleasesComponent,
    SocialLinksComponent,
    StreamingLinksComponent,
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  // Modern trend: using inject() instead of constructor injection
  private bandService = inject(BandService);
  private bandLinksService = inject(BandLinksService);

  // Standalone properties for clarity
  socialLinks?: SocialLinks;
  streamingLinks?: StreamingLinks;
  
  // Use a constant for the slug to prevent accidental mutation
  readonly homepageBandSlug = 'mosai-canvas';

  ngOnInit(): void {
    this.loadHomepageData();
  }

  private loadHomepageData(): void {
    this.bandService.getBandBySlug(this.homepageBandSlug).subscribe({
      next: (band) => {
        if (!band?._id) {
          console.error('Band not found for slug:', this.homepageBandSlug);
          return;
        }

        // Fetch Social Links
        this.bandLinksService.getSocialLinksByBandId(band._id).subscribe({
          next: (data) => (this.socialLinks = data),
          error: (err) => console.error('Failed to load social links:', err),
        });

        // Fetch Streaming Links
        this.bandLinksService.getStreamingLinksByBandId(band._id).subscribe({
          next: (data) => (this.streamingLinks = data),
          error: (err) => console.error('Failed to load streaming links:', err),
        });
      },
      error: (err) => console.error('Failed to load band by slug:', err),
    });
  }
}