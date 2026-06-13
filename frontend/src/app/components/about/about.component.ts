import {
  Component,
  OnInit,
  HostListener,
  ElementRef,
  ViewChild,
  AfterViewInit,
  Input
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { AboutService } from '../../services/about/about.service';
import { About } from '../../models/about/about.model';
import { ScrollAnimateDirective } from '../../directives/scroll-animate.directive';
import { Band } from '../../models/band/band.model';
import { StreamingPlayers } from '../../models/streaming-players/streaming-players.model';
import { StreamingPlayersComponent } from '../streaming-player/streaming-players.component';
import { ScrollTypewriterDirective } from '../../directives/scroll-typewriter.directive';

@Component({
  selector: 'app-about',
  standalone: true,
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
  imports: [
    CommonModule,
    ScrollAnimateDirective,
    StreamingPlayersComponent,
    ScrollTypewriterDirective,
  ],
})
export class AboutComponent implements OnInit, AfterViewInit {
  @Input() band!: Band;
  @Input() streamingPlayer: StreamingPlayers | null = null;

  @ViewChild('parallaxText') parallaxText!: ElementRef;

  aboutList: About[] = [];
  loading: boolean = true;

  private maxRadius = 54;
  private scrollDistance = 500;

  constructor(
    private aboutService: AboutService,
    private elRef: ElementRef
  ) {}

  ngOnInit(): void {
    this.getAboutData();
  }

  ngAfterViewInit(): void {
    this.onScroll();
  }

  getAboutData() {
    this.aboutService.getAboutData().subscribe({
      next: (data: About[]) => {
        this.aboutList = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error fetching About data', error);
        this.loading = false;
      },
    });
  }

  get showStreamingPlayer(): boolean {
    return (
      !!this.band &&
      !!this.streamingPlayer &&
      !!(this.streamingPlayer.spotifyArtistId || this.streamingPlayer.spotifyUrl)
    );
  }

  get showWatermark(): boolean {
    return !this.showStreamingPlayer;
  }

  @HostListener('window:scroll')
  onScroll() {
    const aboutContent = this.elRef.nativeElement.querySelector('.about-content');
    const scrollOffset = window.pageYOffset;

    // 1. ANIMATED CORNERS LOGIC
    if (aboutContent) {
      const rect = aboutContent.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const visibleProgress = Math.min(
        Math.max((viewportHeight - rect.top) / this.scrollDistance, 0),
        1
      );
      const radius = this.maxRadius * (1 - visibleProgress);
      aboutContent.style.borderRadius = `${radius}px`;
    }

    // 2. PARALLAX GHOST TEXT LOGIC
    if (this.parallaxText && window.innerWidth >= 768 && this.showWatermark) {
      const yPos = -(scrollOffset * 0.1);
      this.parallaxText.nativeElement.style.transform = `translateY(${yPos}px)`;
    }
  }
}