import {
  Component,
  OnInit,
  HostListener,
  ElementRef,
  OnDestroy,
} from '@angular/core';
import { DatePipe } from '@angular/common';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { trigger, transition, style, animate } from '@angular/animations';
import { CarouselService } from '../../services/carousel/carousel.service';
import { CarouselItem } from '../../models/carousel/carousel.model';

@Component({
  selector: 'app-carousel',
  standalone: true,
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss'],
  imports: [CommonModule, RouterModule],
  providers: [DatePipe],
  animations: [
    trigger('slideUp', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('600ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class CarouselComponent implements OnInit, OnDestroy {
  /** ITEMS */
  originalItems: CarouselItem[] = [];
  carouselItems: CarouselItem[] = [];
  currentIndex = 1; // Start at the first 'real' slide (index 1 in carouselItems)
  slideWidth = 0;
  containerWidth = 0;

  /** STATE */
  private autoSlideInterval: ReturnType<typeof setInterval> | null = null;
  private isDragging = false;
  private isClick = false;
  private startX = 0;
  private endX = 0;
  private isAnimating = false; // Prevents multiple rapid actions
  transitionEnabled = true; // Controls CSS transition for wrapperTransform
  private readonly TRANSITION_MS = 600;

  /** PAGINATION */
  get activePaginationIndex(): number {
    return this.originalItems.length
      ? (this.currentIndex - 1 + this.originalItems.length) % this.originalItems.length
      : 0;
  }

  constructor(
    private carouselService: CarouselService,
    private datePipe: DatePipe,
    private el: ElementRef,
  ) {}

  /** INIT / DESTROY */
  ngOnInit(): void {
    this.carouselService.getCarouselItems().subscribe(items => {
      this.originalItems = items.map(item => ({
        ...item,
        formattedDate: this.datePipe.transform(item.releaseDate, 'EEEE, MMMM d, y') ?? '',
      }));
      this.cloneSlides();
      requestAnimationFrame(() => this.updateDimensions());
    });
    this.startAutoSlide();
  }

  ngOnDestroy(): void {
    this.stopAutoSlide();
  }

  /** SETUP */
  private cloneSlides(): void {
    if (this.originalItems.length === 0) {
      this.carouselItems = [];
      this.currentIndex = 0;
      return;
    }
    const first = this.originalItems[0];
    const last = this.originalItems[this.originalItems.length - 1];
    this.carouselItems = [last, ...this.originalItems, first];
    this.currentIndex = 1;
  }

  /** DIMENSIONS */
  @HostListener('window:resize')
  updateDimensions(): void {
    setTimeout(() => {
      const slideEl = this.el.nativeElement.querySelector('.carousel-slide');
      const containerEl = this.el.nativeElement.querySelector('.carousel-container');
      if (slideEl && containerEl) {
        this.slideWidth = slideEl.offsetWidth;
        this.containerWidth = containerEl.offsetWidth;
      }
    }, 0);
  }

  /** NAVIGATION (prevSlide / nextSlide unchanged) */
  nextSlide(): void {
    if (this.isAnimating) return;
    this.isAnimating = true;
    this.transitionEnabled = true;
    this.stopAutoSlide();

    this.currentIndex++;
    if (this.currentIndex === this.carouselItems.length - 1) {
      setTimeout(() => {
        this.jumpTo(1);
        this.isAnimating = false;
        this.startAutoSlide();
      }, this.TRANSITION_MS);
    } else {
      setTimeout(() => {
        this.isAnimating = false;
        this.startAutoSlide();
      }, this.TRANSITION_MS);
    }
  }

  prevSlide(): void {
    if (this.isAnimating) return;
    this.isAnimating = true;
    this.transitionEnabled = true;
    this.stopAutoSlide();

    this.currentIndex--;
    if (this.currentIndex === 0) {
      setTimeout(() => {
        this.jumpTo(this.originalItems.length);
        this.isAnimating = false;
        this.startAutoSlide();
      }, this.TRANSITION_MS);
    } else {
      setTimeout(() => {
        this.isAnimating = false;
        this.startAutoSlide();
      }, this.TRANSITION_MS);
    }
  }

  selectSlide(index: number): void {
    const targetCarouselIndex = index + 1;
    if (this.isAnimating || targetCarouselIndex === this.currentIndex) return;

    this.isAnimating = true;
    this.transitionEnabled = true;
    this.stopAutoSlide();

    this.currentIndex = targetCarouselIndex;
    setTimeout(() => {
      this.isAnimating = false;
      this.startAutoSlide();
    }, this.TRANSITION_MS);
  }

  /** Jump instantly, without transition */
  private jumpTo(index: number): void {
    this.transitionEnabled = false;
    this.currentIndex = index;
    requestAnimationFrame(() => {
      this.transitionEnabled = true;
    });
  }

  /** AUTO (start/stop unchanged) */
  startAutoSlide(): void {
    this.stopAutoSlide();
    if (this.originalItems.length > 1) {
      this.autoSlideInterval = setInterval(() => this.nextSlide(), 5000);
    }
  }

  stopAutoSlide(): void {
    if (this.autoSlideInterval) {
      clearInterval(this.autoSlideInterval);
      this.autoSlideInterval = null;
    }
  }

  /** DRAG / SWIPE (unchanged) */
  @HostListener('touchstart', ['$event'])
  @HostListener('mousedown', ['$event'])
  onDragStart(event: TouchEvent | MouseEvent): void {
    const target = event.target as HTMLElement;
    if (target.closest('button, a, img, .carousel-pagination')) return;
    if (this.isAnimating) return;

    this.stopAutoSlide();
    this.transitionEnabled = false;
    this.startX = 'touches' in event ? event.touches[0].clientX : event.clientX;
    this.isDragging = true;
    this.isClick = true;
  }

  @HostListener('touchmove', ['$event'])
  @HostListener('mousemove', ['$event'])
  onDragMove(event: TouchEvent | MouseEvent): void {
    if (!this.isDragging) return;
    event.preventDefault();

    const clientX = 'touches' in event ? event.touches[0].clientX : event.clientX;
    if (Math.abs(this.startX - clientX) > 5) {
      this.isClick = false;
    }
    this.endX = clientX;
  }

  @HostListener('touchend', ['$event'])
  @HostListener('mouseup', ['$event'])
  onDragEnd(): void {
    if (!this.isDragging) return;
    this.isDragging = false;
    this.isAnimating = true;
    this.transitionEnabled = true;

    if (this.isClick) {
      this.isAnimating = false;
      this.startAutoSlide();
      return;
    }

    const diff = this.startX - this.endX;
    if (Math.abs(diff) < 50) {
      this.isAnimating = false;
      this.startAutoSlide();
      return;
    }

    diff > 0 ? this.nextSlideViaDrag() : this.prevSlideViaDrag();
  }

  private nextSlideViaDrag(): void {
    this.currentIndex++;
    if (this.currentIndex === this.carouselItems.length - 1) {
      setTimeout(() => {
        this.jumpTo(1);
        this.isAnimating = false;
        this.startAutoSlide();
      }, this.TRANSITION_MS);
    } else {
      setTimeout(() => {
        this.isAnimating = false;
        this.startAutoSlide();
      }, this.TRANSITION_MS);
    }
  }

  private prevSlideViaDrag(): void {
    this.currentIndex--;
    if (this.currentIndex === 0) {
      setTimeout(() => {
        this.jumpTo(this.originalItems.length);
        this.isAnimating = false;
        this.startAutoSlide();
      }, this.TRANSITION_MS);
    } else {
      setTimeout(() => {
        this.isAnimating = false;
        this.startAutoSlide();
      }, this.TRANSITION_MS);
    }
  }

  /** PRESENTATION (unchanged) */
  get wrapperTransform(): string {
    const marginHorizontal = 16;
    const slideTotalWidth = this.slideWidth + marginHorizontal;
    const containerCenter = this.containerWidth / 2;
    const slideCenter = slideTotalWidth / 2;
    const centerOffset = containerCenter - slideCenter;
    const baseTranslate = this.currentIndex * slideTotalWidth;
    return `translateX(${centerOffset - baseTranslate}px)`;
  }
}
