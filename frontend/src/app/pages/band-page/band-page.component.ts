// import { Component, OnInit, OnDestroy, inject } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { ActivatedRoute } from '@angular/router';
// import { Subject, takeUntil } from 'rxjs';

// // Components, Services, and Models remain the same as your provided code...
// import { MembersListComponent } from '../../components/members-list/members-list.component';
// import { AboutComponent } from '../../components/about/about.component';
// import { SocialLinksComponent } from '../../components/social-links/social-links.component';
// import { StreamingLinksComponent } from '../../components/streaming-links/streaming-links.component';
// import { LatestReleasesComponent } from '../../components/releases/latest-releases/latest-releases.component';
// import { PreReleasesComponent } from '../../components/releases/pre-releases/pre-releases.component';
// import { PastReleasesComponent } from '../../components/releases/past-releases/past-releases.component';
// import { ReleasesService } from '../../services/releases/releases.service';
// import { BandService } from '../../services/band/band.service';
// import { BandLinksService } from '../../services/band-links/band-links.service';
// import { Releases } from '../../models/release/release.model';
// import { Band } from '../../models/band/band.model';
// import { BandLinks } from '../../models/band-links/band-links.model';
// import { YouTubeVideosComponent } from '../../components/youtube-videos/youtube-videos.component';


// @Component({
//   selector: 'app-band-page',
//   standalone: true,
//   imports: [
//     CommonModule,
//     AboutComponent,
//     MembersListComponent,
//     SocialLinksComponent,
//     StreamingLinksComponent,
//     LatestReleasesComponent,
//     PreReleasesComponent,
//     PastReleasesComponent,
//     YouTubeVideosComponent
//   ],
//   templateUrl: './band-page.component.html',
//   styleUrls: ['./band-page.component.scss']
// })
// export class BandPageComponent implements OnInit, OnDestroy {
//   private route = inject(ActivatedRoute);
//   private releaseService = inject(ReleasesService);
//   private bandService = inject(BandService);
//   private bandLinksService = inject(BandLinksService);

//   private destroy$ = new Subject<void>();

//   bandSlug!: string;
//   bandData!: Band | undefined;
//   bandLinks: BandLinks = { social: {}, streaming: {} };

//   latestReleases: Releases[] = [];
//   preReleases: Releases[] = [];
//   pastReleases: Releases[] = [];

//   ngOnInit(): void {
//     this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe(params => {
//       const slug = params.get('bandSlug');
//       if (!slug) return;
      
//       this.bandSlug = slug;
//       this.resetPageState();
//       this.loadBandData();
//     });
//   }

//   private resetPageState(): void {
//     this.bandData = undefined;
//     this.latestReleases = [];
//     this.preReleases = [];
//     this.pastReleases = [];
//     this.bandLinks = { social: {}, streaming: {} };
//   }

//   private loadBandData(): void {
//     this.bandService.getBandBySlug(this.bandSlug)
//       .pipe(takeUntil(this.destroy$))
//       .subscribe(async (band) => {
//         this.bandData = band;

//         this.bandLinksService.getSocialLinksBySlug(this.bandSlug)
//           .pipe(takeUntil(this.destroy$))
//           .subscribe(social => (this.bandLinks.social = social));

//         this.bandLinksService.getStreamingLinksBySlug(this.bandSlug)
//           .pipe(takeUntil(this.destroy$))
//           .subscribe(streaming => (this.bandLinks.streaming = streaming));

//         try {
//           const releases = await this.releaseService.getAll(this.bandSlug);
//           this.categorize(releases);
//         } catch (error) {
//           console.error('Error loading releases:', error);
//         }
//       });
//   }

//   /**
//    * If the PNG logo is missing from /assets/pngs/logos/, 
//    * we simply hide the image so the hero background stands alone.
//    */
//   handleLogoError(event: any): void {
//     const imgElement = event.target as HTMLImageElement;
//     imgElement.style.display = 'none';
//   }

//   ngOnDestroy(): void {
//     this.bandService.clearBandState();
//     this.destroy$.next();
//     this.destroy$.complete();
//   }

//   private categorize(releases: Releases[]): void {
//     const now = new Date();
//     const bandReleases = releases.filter(r => r.bandSlug === this.bandSlug);

//     this.preReleases = bandReleases.filter(r => new Date(r.releaseDate) > now);

//     this.latestReleases = bandReleases.filter(r => {
//       const d = new Date(r.releaseDate);
//       const daysAgo = (now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24);
//       return daysAgo >= 0 && daysAgo <= 30;
//     });

//     this.pastReleases = bandReleases.filter(r => {
//       const d = new Date(r.releaseDate);
//       const daysAgo = (now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24);
//       return daysAgo > 30;
//     });
//   }
// }



import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

import { MembersListComponent } from '../../components/members-list/members-list.component';
import { AboutComponent } from '../../components/about/about.component';
import { SocialLinksComponent } from '../../components/social-links/social-links.component';
import { StreamingLinksComponent } from '../../components/streaming-links/streaming-links.component';
import { LatestReleasesComponent } from '../../components/releases/latest-releases/latest-releases.component';
import { PreReleasesComponent } from '../../components/releases/pre-releases/pre-releases.component';
import { PastReleasesComponent } from '../../components/releases/past-releases/past-releases.component';
import { ReleasesService } from '../../services/releases/releases.service';
import { BandService } from '../../services/band/band.service';
import { BandLinksService } from '../../services/band-links/band-links.service';
import { Releases } from '../../models/release/release.model';
import { Band } from '../../models/band/band.model';
import { BandLinks } from '../../models/band-links/band-links.model';
import { SocialLinks } from '../../models/social-links/social-links.model'; // Added Import
import { YouTubeVideosComponent } from '../../components/youtube-videos/youtube-videos.component';

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
    YouTubeVideosComponent
  ],
  templateUrl: './band-page.component.html',
  styleUrls: ['./band-page.component.scss']
})
export class BandPageComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private releaseService = inject(ReleasesService);
  private bandService = inject(BandService);
  private bandLinksService = inject(BandLinksService);

  private destroy$ = new Subject<void>();

  bandSlug!: string;
  bandData!: Band | undefined;
  
  // This property resolves the 'bandSocials' compiler error
  bandSocials?: SocialLinks; 
  bandLinks: BandLinks = { social: {}, streaming: {} };

  latestReleases: Releases[] = [];
  preReleases: Releases[] = [];
  pastReleases: Releases[] = [];

  ngOnInit(): void {
    this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe(params => {
      const slug = params.get('bandSlug');
      if (!slug) return;
      
      this.bandSlug = slug;
      this.resetPageState();
      this.loadBandData();
    });
  }

  private resetPageState(): void {
    this.bandData = undefined;
    this.latestReleases = [];
    this.preReleases = [];
    this.pastReleases = [];
    this.bandSocials = undefined;
    this.bandLinks = { social: {}, streaming: {} };
  }

  private loadBandData(): void {
    this.bandService.getBandBySlug(this.bandSlug)
      .pipe(takeUntil(this.destroy$))
      .subscribe(async (band) => {
        this.bandData = band;

        // Fetch Social Links
        this.bandLinksService.getSocialLinksBySlug(this.bandSlug)
          .pipe(takeUntil(this.destroy$))
          .subscribe(social => {
            this.bandLinks.social = social;
            this.bandSocials = social; // Map to the property the template expects
          });

        // Fetch Streaming Links
        this.bandLinksService.getStreamingLinksBySlug(this.bandSlug)
          .pipe(takeUntil(this.destroy$))
          .subscribe(streaming => (this.bandLinks.streaming = streaming));

        try {
          const releases = await this.releaseService.getAll(this.bandSlug);
          this.categorize(releases);
        } catch (error) {
          console.error('Error loading releases:', error);
        }
      });
  }

  handleLogoError(event: any): void {
    const imgElement = event.target as HTMLImageElement;
    imgElement.style.display = 'none';
  }

  ngOnDestroy(): void {
    this.bandService.clearBandState();
    this.destroy$.next();
    this.destroy$.complete();
  }

  private categorize(releases: Releases[]): void {
    const now = new Date();
    const bandReleases = releases.filter(r => r.bandSlug === this.bandSlug);

    this.preReleases = bandReleases.filter(r => new Date(r.releaseDate) > now);

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
