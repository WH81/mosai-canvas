import { 
  Component, 
  OnInit, 
  HostListener, 
  ElementRef, 
  ViewChild, // Added for Parallax
  AfterViewInit, // Added to handle initial positioning
  Input
} from '@angular/core';
import { AboutService } from '../../services/about/about.service';
import { About } from '../../models/about/about.model';
import { CommonModule } from '@angular/common';
import { ScrollAnimateDirective } from '../../directives/scroll-animate.directive';
import { Band } from '../../models/band/band.model';

@Component({
  selector: 'app-about',
  standalone: true,
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
  imports: [CommonModule, ScrollAnimateDirective],
})
export class AboutComponent implements OnInit, AfterViewInit {
  @Input() band!: Band; // Receive band data from parent component
  @ViewChild('parallaxText') parallaxText!: ElementRef; // Hook to HTML #parallaxText

  aboutList: About[] = [];
  loading: boolean = true;

  // Corner Animation Config
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
    // Run once on load to set initial positions
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
    // Only run on larger screens (768px+) to maintain Rockstar UX performance
    if (this.parallaxText && window.innerWidth >= 768) {
      // 0.1 is the speed ratio. Lower = subtler.
      const yPos = -(scrollOffset * 0.1); 
      this.parallaxText.nativeElement.style.transform = `translateY(${yPos}px)`;
    }
  }
}