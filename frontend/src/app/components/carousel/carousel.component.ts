import {
  Component,
  OnInit,
  HostListener,
  ElementRef,
  OnDestroy,
  NgZone,
  ChangeDetectorRef,
} from '@angular/core';

import {
  CommonModule,
} from '@angular/common';

import {
  RouterModule,
} from '@angular/router';

import {
  trigger,
  transition,
  style,
  animate,
} from '@angular/animations';

import {
  CarouselService,
} from '../../services/carousel/carousel.service';

import {
  CarouselItem,
} from '../../models/carousel/carousel.model';

import {
  ScrollAnimateDirective,
} from '../../directives/scroll-animate.directive';

@Component({
  selector: 'app-carousel',
  standalone: true,

  templateUrl:
    './carousel.component.html',

  styleUrls: [
    './carousel.component.scss',
  ],

  imports: [
    CommonModule,
    RouterModule,
    ScrollAnimateDirective,
  ],

  animations: [
    trigger('slideUp', [
      transition(':enter', [
        style({
          opacity: 0,
          transform: 'translateY(20px)',
        }),

        animate(
          '600ms ease-out',
          style({
            opacity: 1,
            transform: 'translateY(0)',
          })
        ),
      ]),
    ]),
  ],
})
export class CarouselComponent
  implements OnInit, OnDestroy {

  /** ITEMS */
  originalItems:
    CarouselItem[] = [];

  carouselItems:
    CarouselItem[] = [];

  /** INDEXING */
  currentIndex = 1;

  /** LAYOUT */
  slideWidth = 0;

  containerWidth = 0;

  /** STATE */
  transitionEnabled = true;

  private readonly TRANSITION_MS =
    600;

  /** PAGINATION */
  get activePaginationIndex(): number {
    return this.originalItems.length
      ? (
          this.currentIndex -
          1 +
          this.originalItems.length
        ) %
          this.originalItems.length
      : 0;
  }

  /** INTERNAL STATE */
  private autoSlideInterval:
    ReturnType<typeof setInterval> | null =
      null;

  private isDragging = false;

  private isClick = false;

  private startX = 0;

  private endX = 0;

  private isAnimating = false;

  private resizeObserver?: ResizeObserver;

  constructor(
    private carouselService:
      CarouselService,

    private el:
      ElementRef,

    private ngZone:
      NgZone,

    private cdr:
      ChangeDetectorRef
  ) {}

  // -----------------------------
  // INIT / DESTROY
  // -----------------------------

  ngOnInit(): void {
    this.carouselService
      .getCarouselItems()
      .subscribe({
        next: (items) => {

          this.originalItems =
            items.map(
              (item) => ({
                ...item,

                imageUrl:
                  item.imageUrl ||
                  '',

                /**
                 * Treat releaseDate as a
                 * calendar date rather than
                 * a timezone-aware timestamp.
                 */
                formattedDate:
                  this.formatReleaseDate(
                    item.releaseDate
                  ),
              })
            );

          this.cloneSlides();

          this.cdr.detectChanges();

          requestAnimationFrame(() => {
            this.measure();

            this.cdr.detectChanges();
          });
        },

        error: (error) => {
          console.error(
            'Failed to load Carousel content.',
            error
          );

          this.originalItems = [];

          this.carouselItems = [];

          this.cdr.detectChanges();
        },
      });

    this.startAutoSlide();

    this.initResizeObserver();
  }

  ngOnDestroy(): void {
    this.stopAutoSlide();

    this.resizeObserver
      ?.disconnect();
  }

  /**
   * Format YYYY-MM-DD without timezone
   * conversion.
   *
   * Example:
   *
   * 2025-10-19
   *
   * always renders as:
   *
   * Sunday, October 19, 2025
   */
  private formatReleaseDate(
    value?: string
  ): string {

    if (!value) {
      return '';
    }

    const match =
      /^(\d{4})-(\d{2})-(\d{2})/.exec(
        value
      );

    if (!match) {
      return '';
    }

    const year =
      Number(match[1]);

    const month =
      Number(match[2]);

    const day =
      Number(match[3]);

    const date =
      new Date(
        year,
        month - 1,
        day,
        12,
        0,
        0
      );

    if (
      Number.isNaN(
        date.getTime()
      )
    ) {
      return '';
    }

    return new Intl.DateTimeFormat(
      'en-US',
      {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      }
    ).format(date);
  }

  // -----------------------------
  // STABLE LAYOUT TRACKING
  // -----------------------------

  private initResizeObserver(): void {
    const container =
      this.el.nativeElement
        .querySelector(
          '.carousel-container'
        );

    if (!container) {
      return;
    }

    this.resizeObserver =
      new ResizeObserver(() => {

        this.ngZone.run(() => {

          this.measure();

          this.cdr.detectChanges();
        });
      });

    this.resizeObserver
      .observe(container);
  }

  private measure(): void {
    const slideEl =
      this.el.nativeElement
        .querySelector(
          '.carousel-slide'
        );

    const containerEl =
      this.el.nativeElement
        .querySelector(
          '.carousel-container'
        );

    if (
      !slideEl ||
      !containerEl
    ) {
      return;
    }

    this.slideWidth =
      slideEl.offsetWidth;

    this.containerWidth =
      containerEl.offsetWidth;
  }

  // -----------------------------
  // SLIDES
  // -----------------------------

  private cloneSlides(): void {
    if (
      !this.originalItems.length
    ) {
      this.carouselItems = [];

      this.currentIndex = 0;

      return;
    }

    const first =
      this.originalItems[0];

    const last =
      this.originalItems[
        this.originalItems.length - 1
      ];

    this.carouselItems = [
      last,
      ...this.originalItems,
      first,
    ];

    this.currentIndex = 1;
  }

  // -----------------------------
  // NAVIGATION
  // -----------------------------

  nextSlide(): void {
    if (this.isAnimating) {
      return;
    }

    this.isAnimating = true;

    this.stopAutoSlide();

    this.currentIndex++;

    this.resolveLoopBoundary();

    this.isAnimating = false;

    this.startAutoSlide();

    this.cdr.detectChanges();
  }

  prevSlide(): void {
    if (this.isAnimating) {
      return;
    }

    this.isAnimating = true;

    this.stopAutoSlide();

    this.currentIndex--;

    this.resolveLoopBoundary();

    this.isAnimating = false;

    this.startAutoSlide();

    this.cdr.detectChanges();
  }

  private resolveLoopBoundary(): void {
    if (
      this.currentIndex ===
      this.carouselItems.length - 1
    ) {
      this.jumpTo(1);
    }

    if (
      this.currentIndex === 0
    ) {
      this.jumpTo(
        this.originalItems.length
      );
    }
  }

  selectSlide(
    index: number
  ): void {
    const target =
      index + 1;

    if (
      this.isAnimating ||
      target === this.currentIndex
    ) {
      return;
    }

    this.isAnimating = true;

    this.stopAutoSlide();

    this.currentIndex =
      target;

    this.isAnimating = false;

    this.startAutoSlide();

    this.cdr.detectChanges();
  }

  private jumpTo(
    index: number
  ): void {
    this.currentIndex =
      index;
  }

  // -----------------------------
  // AUTO SLIDE
  // -----------------------------

  startAutoSlide(): void {
    this.stopAutoSlide();

    if (
      this.originalItems.length >
      1
    ) {
      this.autoSlideInterval =
        setInterval(
          () => this.nextSlide(),
          5000
        );
    }
  }

  stopAutoSlide(): void {
    if (
      this.autoSlideInterval
    ) {
      clearInterval(
        this.autoSlideInterval
      );

      this.autoSlideInterval =
        null;
    }
  }

  // -----------------------------
  // DRAG / SWIPE
  // -----------------------------

  @HostListener(
    'touchstart',
    ['$event']
  )
  @HostListener(
    'mousedown',
    ['$event']
  )
  onDragStart(
    event:
      TouchEvent | MouseEvent
  ): void {

    const target =
      event.target as HTMLElement;

    if (
      target.closest(
        'button, a, img, .carousel-pagination'
      )
    ) {
      return;
    }

    if (this.isAnimating) {
      return;
    }

    this.stopAutoSlide();

    this.startX =
      'touches' in event
        ? event.touches[0].clientX
        : event.clientX;

    this.isDragging = true;

    this.isClick = true;
  }

  @HostListener(
    'touchmove',
    ['$event']
  )
  @HostListener(
    'mousemove',
    ['$event']
  )
  onDragMove(
    event:
      TouchEvent | MouseEvent
  ): void {

    if (!this.isDragging) {
      return;
    }

    const clientX =
      'touches' in event
        ? event.touches[0].clientX
        : event.clientX;

    if (
      Math.abs(
        this.startX -
        clientX
      ) > 5
    ) {
      this.isClick = false;
    }

    this.endX =
      clientX;
  }

  @HostListener('touchend')
  @HostListener('mouseup')
  onDragEnd(): void {

    if (!this.isDragging) {
      return;
    }

    this.isDragging = false;

    if (this.isClick) {
      this.startAutoSlide();

      return;
    }

    const diff =
      this.startX -
      this.endX;

    if (
      Math.abs(diff) < 50
    ) {
      this.startAutoSlide();

      return;
    }

    diff > 0
      ? this.nextSlide()
      : this.prevSlide();
  }

  // -----------------------------
  // PRESENTATION
  // -----------------------------

  get wrapperTransform(): string {
    const margin = 16;

    const total =
      this.slideWidth +
      margin;

    const center =
      this.containerWidth /
      2;

    const slideCenter =
      total / 2;

    const offset =
      center -
      slideCenter;

    const base =
      this.currentIndex *
      total;

    return `translateX(${offset - base}px)`;
  }
}