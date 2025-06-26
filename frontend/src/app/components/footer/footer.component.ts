import { Component, AfterViewInit, OnDestroy, HostListener, ViewChild, ElementRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MosaicanvasLogoComponent } from '../mosaicanvas-logo/mosaicanvas-logo.component';
import { menuItems } from '../../shared/nav-config';
import { SocialLinksComponent } from '../social-links/social-links.component';
import { SocialLinks } from '../../models/social-links/social-links.model';
import { FooterService } from '../../services/footer/footer.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule, MosaicanvasLogoComponent, SocialLinksComponent],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements AfterViewInit, OnDestroy, OnInit {
  homepageBandId = '685b5c2ca1ee1c0efcc20e7d';
  socialLinks?: SocialLinks;
  currentYear = new Date().getFullYear();
  menuItems = menuItems;

  @ViewChild('backToTopBtn') backToTopBtnRef!: ElementRef<HTMLButtonElement>;
  private scrollThreshold = 300;

  constructor(private footerService: FooterService) {}

  ngOnInit(): void {
    this.footerService.getHomePageSocialLinks(this.homepageBandId).subscribe({
      next: (data: SocialLinks | undefined) => this.socialLinks = data,
      error: (err: any) => console.error('Failed to load social links for homepage:', err)
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
