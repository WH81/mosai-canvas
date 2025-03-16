import { Component, OnInit, HostListener, ElementRef, OnDestroy } from '@angular/core';
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
      ]),
    ]),
  ],
})
export class CarouselComponent implements OnInit, OnDestroy {
  carouselItems: CarouselItem[] = [];
  currentIndex: number = 0;
  isDragging: boolean = false;
  startX: number = 0;
  endX: number = 0;
  minSwipeDistance: number = 50;
  isClick: boolean = false;
  autoSlideInterval: any;

  constructor(private carouselService: CarouselService, private datePipe: DatePipe, private el: ElementRef) {}

  ngOnInit(): void {
    this.carouselService.getCarouselItems().subscribe(items => {
      this.carouselItems = items.map(item => ({
        ...item,
        formattedDate: this.datePipe.transform(item.releaseDate, 'MMMM d, yyyy')
      }));
    });

    this.startAutoSlide(); // 🔥 Start auto-sliding on init
  }

  ngOnDestroy(): void {
    this.stopAutoSlide(); // 🔥 Cleanup interval when component is destroyed
  }

  selectSlide(index: number): void {
    this.currentIndex = index;
    this.restartAutoSlide();
  }

  nextSlide(): void {
    this.currentIndex = (this.currentIndex + 1) % this.carouselItems.length;
    this.restartAutoSlide();
  }

  prevSlide(): void {
    this.currentIndex = (this.currentIndex - 1 + this.carouselItems.length) % this.carouselItems.length;
    this.restartAutoSlide();
  }

  // ✅ Start auto-slide every 5 seconds
  startAutoSlide(): void {
    this.stopAutoSlide();
    this.autoSlideInterval = setInterval(() => {
      this.nextSlide();
    }, 5000);
  }

  // ✅ Restart auto-slide after manual interaction
  restartAutoSlide(): void {
    this.startAutoSlide();
  }

  // ✅ Stop auto-slide when needed
  stopAutoSlide(): void {
    if (this.autoSlideInterval) {
      clearInterval(this.autoSlideInterval);
    }
  }

  isEventInsideCarousel(event: Event): boolean {
    return this.el.nativeElement.contains(event.target);
  }

  @HostListener('touchstart', ['$event'])
  @HostListener('mousedown', ['$event'])
  onDragStart(event: TouchEvent | MouseEvent): void {
    if (!this.isEventInsideCarousel(event)) return;

    const target = event.target as HTMLElement;
    if (target.closest('button, a, img')) return;

    this.isDragging = true;
    this.isClick = true;
    this.startX = 'touches' in event ? event.touches[0].clientX : (event as MouseEvent).clientX;
  }

  @HostListener('touchmove', ['$event'])
  @HostListener('mousemove', ['$event'])
  onDragMove(event: TouchEvent | MouseEvent): void {
    if (!this.isDragging) return;
    this.endX = 'touches' in event ? event.touches[0].clientX : (event as MouseEvent).clientX;

    if (Math.abs(this.startX - this.endX) > 5) {
      this.isClick = false;
    }
  }

  @HostListener('touchend', ['$event'])
  @HostListener('mouseup', ['$event'])
  onDragEnd(event: TouchEvent | MouseEvent): void {
    if (!this.isDragging) return;
    this.isDragging = false;

    if (this.isClick) return;

    const diff = this.startX - this.endX;
    if (Math.abs(diff) < this.minSwipeDistance) return;

    if (diff > 0) {
      this.nextSlide();
    } else if (diff < 0) {
      this.prevSlide();
    }
  }
}
