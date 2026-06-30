import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  ElementRef,
  ViewChild,
  inject,
  ChangeDetectionStrategy, // Best practice: limit change detection footprint
  ChangeDetectorRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  YouTubeVideosService,
  YouTubeVideo,
} from '../../services/youtube-videos/youtube-videos.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-youtube-videos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './youtube-videos.component.html',
  styleUrls: ['./youtube-videos.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush // Best practice performance optimization
})
export class YouTubeVideosComponent implements OnChanges {
  @Input() bandSlug!: string;

  @ViewChild('featured') featured!: ElementRef;

  private ytService = inject(YouTubeVideosService);
  private sanitizer = inject(DomSanitizer);
  private cdr = inject(ChangeDetectorRef);

  videos: YouTubeVideo[] = [];
  featuredVideo?: YouTubeVideo;
  
  // Best practice: Cache the sanitized resource URL so it maintains structural identity
  safeVideoUrl?: SafeResourceUrl;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['bandSlug'] && this.bandSlug) {
      this.loadVideos();
    }
  }

  private loadVideos(): void {
    this.ytService.getBandVideos(this.bandSlug).subscribe({
      next: (data) => {
        this.videos = data.slice(0, 9).map(video => {
          let cleanTitle = video.title;
  
          // STRATEGY: Remove anything inside () or [] at the end of the string.
          cleanTitle = cleanTitle.replace(/\s*[\(\[][^)]*[\)\]]$/g, '');
  
          // Also remove "Band Name -" if it exists at the start
          const bandName = this.getBandDisplayName(this.bandSlug);
          const escapedBandName = bandName.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
          cleanTitle = cleanTitle.replace(new RegExp(`^${escapedBandName}\\s*-\\s*`, 'gi'), '');
  
          return {
            ...video,
            title: cleanTitle.trim()
          };
        });
  
        if (this.videos.length > 0) {
          this.updateFeaturedVideo(this.videos[0]);
        } else {
          this.cdr.markForCheck();
        }
      },
      error: (err) => {
        console.error('❌ YouTube load failed:', err);
      }
    });
  }
  
  selectVideo(video: YouTubeVideo): void {
    if (this.featuredVideo?.videoId === video.videoId) return;
    
    this.updateFeaturedVideo(video);

    // Smooth scroll to the player after selection
    setTimeout(() => {
      this.featured?.nativeElement?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }, 150);
  }

  /**
   * Safe processing helper to transition featured variables and sanitize links concurrently
   */
  private updateFeaturedVideo(video: YouTubeVideo): void {
    this.featuredVideo = video;
    // Cache the identity right here so the view template retains a stable pointer reference
    this.safeVideoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
      `https://www.youtube.com/embed/${video.videoId}?rel=0`
    );
    this.cdr.markForCheck();
  }

  /**
   * Formats the slug (e.g., 'cloud-canvas') to 'Cloud Canvas'
   */
  getBandDisplayName(slug: string): string {
    if (!slug) return '';
    return slug
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
}