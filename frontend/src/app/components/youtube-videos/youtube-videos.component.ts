import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  ElementRef,
  ViewChild,
  inject,
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
})
export class YouTubeVideosComponent implements OnChanges {
  @Input() bandSlug!: string;

  @ViewChild('featured') featured!: ElementRef;

  private ytService = inject(YouTubeVideosService);
  private sanitizer = inject(DomSanitizer);

  videos: YouTubeVideo[] = [];
  featuredVideo?: YouTubeVideo;

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
          // This catches "(stained glass canvas)", "(phosphorescent canvas)", etc.
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
          this.featuredVideo = this.videos[0];
        }
      },
      error: (err) => {
        console.error('❌ YouTube load failed:', err);
      }
    });
  }
  
  selectVideo(video: YouTubeVideo): void {
    this.featuredVideo = video;

    // Smooth scroll to the player after selection
    setTimeout(() => {
      this.featured?.nativeElement?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }, 150);
  }

  getSafeVideoUrl(videoId: string): SafeResourceUrl {
    // rel=0 prevents suggestions from other channels
    return this.sanitizer.bypassSecurityTrustResourceUrl(
      `https://www.youtube.com/embed/${videoId}?rel=0`
    );
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
