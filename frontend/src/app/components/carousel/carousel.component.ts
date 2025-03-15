import { Component, OnInit, HostListener } from '@angular/core';
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
export class CarouselComponent implements OnInit {
  carouselItems: CarouselItem[] = [];
  currentIndex: number = 0;
  isDragging: boolean = false;
  startX: number = 0;
  endX: number = 0;

  constructor(private carouselService: CarouselService, private datePipe: DatePipe) {}

  ngOnInit(): void {
    this.carouselService.getCarouselItems().subscribe(items => {
      // Format the date before setting it
      this.carouselItems = items.map(item => ({
        ...item,
        formattedDate: this.datePipe.transform(item.releaseDate, 'MMMM d, yyyy')
      }));
    });
  }

  selectSlide(index: number): void {
    this.currentIndex = index;
  }

  nextSlide(): void {
    this.currentIndex = (this.currentIndex + 1) % this.carouselItems.length;
  }

  prevSlide(): void {
    this.currentIndex = (this.currentIndex - 1 + this.carouselItems.length) % this.carouselItems.length;
  }

  // Handle touch/swipe gestures
  @HostListener('touchstart', ['$event'])
  @HostListener('mousedown', ['$event'])
  onDragStart(event: TouchEvent | MouseEvent): void {
    this.isDragging = true;
    this.startX = 'touches' in event ? event.touches[0].clientX : (event as MouseEvent).clientX;
  }

  @HostListener('touchmove', ['$event'])
  @HostListener('mousemove', ['$event'])
  onDragMove(event: TouchEvent | MouseEvent): void {
    if (!this.isDragging) return;
    this.endX = 'touches' in event ? event.touches[0].clientX : (event as MouseEvent).clientX;
  }

  @HostListener('touchend')
  @HostListener('mouseup')
  onDragEnd(): void {
    if (!this.isDragging) return;
    this.isDragging = false;
    const diff = this.startX - this.endX;

    if (diff > 50) {
      this.nextSlide();
    } else if (diff < -50) {
      this.prevSlide();
    }
  }
}
