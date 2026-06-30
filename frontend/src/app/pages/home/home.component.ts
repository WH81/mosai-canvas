import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core'; // Added ChangeDetectorRef
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
import { switchMap, forkJoin, of } from 'rxjs'; // Added RxJS operators for clean mapping

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
  private bandService = inject(BandService);
  private bandLinksService = inject(BandLinksService);
  private cdr = inject(ChangeDetectorRef); // Injected ChangeDetectorRef safely using modern inject()

  socialLinks?: SocialLinks;
  streamingLinks?: StreamingLinks;
  
  readonly homepageBandSlug = 'mosai-canvas';

  ngOnInit(): void {
    this.loadHomepageData();
  }

  private loadHomepageData(): void {
    this.bandService.getBandBySlug(this.homepageBandSlug).pipe(
      switchMap((band) => {
        if (!band?._id) {
          console.error('Band not found for slug:', this.homepageBandSlug);
          // Return empty structure if band isn't found to break the stream gracefully
          return forkJoin({
            socials: of(undefined),
            streaming: of(undefined)
          });
        }

        // forkJoin fires both HTTP requests concurrently, which is faster and cleaner
        return forkJoin({
          socials: this.bandLinksService.getSocialLinksByBandId(band._id),
          streaming: this.bandLinksService.getStreamingLinksByBandId(band._id)
        });
      })
    ).subscribe({
      next: (results) => {
        this.socialLinks = results.socials;
        this.streamingLinks = results.streaming;
        
        // Explicitly tells Angular to check for updates right now, bypassing the scroll bug
        this.cdr.detectChanges(); 
      },
      error: (err) => console.error('Failed to load homepage data sync:', err),
    });
  }
}