import { Component, AfterViewInit, OnDestroy, HostListener, ViewChild, ElementRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MosaicanvasLogoComponent } from '../mosaicanvas-logo/mosaicanvas-logo.component';
import { menuItems } from '../../shared/nav-config';
import { SocialLinksComponent } from '../social-links/social-links.component';
import { SocialLinks } from '../../models/social-links/social-links.model';
import { StreamingLinks } from '../../models/streaming-links/streaming-links.model';
import { StreamingLinksComponent } from '../streaming-links/streaming-links.component';
import { FooterService } from '../../services/footer/footer.service';
import { BandService } from '../../services/bands/band.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MosaicanvasLogoComponent,
    SocialLinksComponent,
    StreamingLinksComponent
  ],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements AfterViewInit, OnDestroy, OnInit {
  homepageBandSlug = 'mosai-canvas';
  bandId?: string;
  socialLinks?: SocialLinks;
  streamingLinks?: StreamingLinks;
  currentYear = new Date().getFullYear();
  menuItems = menuItems;

  @ViewChild('backToTopBtn') backToTopBtnRef!: ElementRef<HTMLButtonElement>;
  private scrollThreshold = 300;

  constructor(
    private footerService: FooterService,
    private bandService: BandService  // Inject BandService
  ) {}

  ngOnInit(): void {
    this.bandService.getBandBySlug(this.homepageBandSlug).subscribe({
      next: (band) => {
        if (!band || !band._id) {
          console.error('Band not found for slug:', this.homepageBandSlug);
          return;
        }
        const bandId = band._id;

        this.footerService.getHomePageSocialLinks(bandId).subscribe({
          next: (data) => this.socialLinks = data,
          error: (err) => console.error('Failed to load social links:', err)
        });

        this.footerService.getHomePageStreamingLinks(bandId).subscribe({
          next: (data) => this.streamingLinks = data,
          error: (err) => console.error('Failed to load streaming links:', err)
        });
      },
      error: (err) => console.error('Failed to load band by slug:', err)
    });
  }

  ngAfterViewInit(): void {
    this.toggleBackToTopButtonVisibility();
  }

  ngOnDestroy(): void {}

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    this.toggleBackToTopButtonVisibility();
  }

  private toggleBackToTopButtonVisibility(): void {
    if (this.backToTopBtnRef?.nativeElement) {
      this.backToTopBtnRef.nativeElement.classList.toggle('active', window.scrollY > this.scrollThreshold);
    }
  }

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
