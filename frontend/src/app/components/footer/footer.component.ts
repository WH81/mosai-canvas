import { Component, AfterViewInit, OnDestroy, HostListener, ViewChild, ElementRef, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MosaicanvasLogoComponent } from '../mosaicanvas-logo/mosaicanvas-logo.component';
import { menuItems } from '../../shared/nav-config';
import { FooterService } from '../../services/footer/footer.service';
import { BandService } from '../../services/band/band.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
  ],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements AfterViewInit, OnDestroy, OnInit {
  homepageBandSlug = 'mosai-canvas';
  bandId?: string;
  currentYear = new Date().getFullYear();
  menuItems = menuItems;

  showBackToTop = false;
  @ViewChild('backToTopBtn') backToTopBtnRef!: ElementRef<HTMLButtonElement>;
  private scrollThreshold = 150;

  constructor(
    private footerService: FooterService,
    private bandService: BandService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.bandService.getBandBySlug(this.homepageBandSlug).subscribe({
      next: (band) => {
        if (!band || !band._id) {
          console.error('Band not found for slug:', this.homepageBandSlug);
          return;
        }
        this.bandId = band._id;
      },
      error: (err) => console.error('Failed to load band by slug:', err)
    });
  }

  ngAfterViewInit(): void {
    this.toggleBackToTopButtonVisibility();
  }

  ngOnDestroy(): void {}

  @HostListener('window:scroll', [])
  @HostListener('document:scroll', [])
  @HostListener('body:scroll', [])
  onWindowScroll(): void {
    this.toggleBackToTopButtonVisibility();
  }

  private toggleBackToTopButtonVisibility(): void {
    const scrollPos = 
      window.scrollY || 
      window.pageYOffset || 
      document.documentElement.scrollTop || 
      document.body.scrollTop || 
      0;

    const shouldShow = scrollPos > this.scrollThreshold;

    if (this.showBackToTop !== shouldShow) {
      this.showBackToTop = shouldShow;
      this.cd.detectChanges();
    }

    if (this.backToTopBtnRef?.nativeElement) {
      this.backToTopBtnRef.nativeElement.classList.toggle('active', shouldShow);
    }
  }

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    document.documentElement.scrollTo({ top: 0, behavior: 'smooth' });
    document.body.scrollTo({ top: 0, behavior: 'smooth' });
  }
}