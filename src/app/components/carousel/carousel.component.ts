import { Component, OnInit } from '@angular/core';
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
  animations: [
    trigger('slideUp', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate(
          '600ms ease-out',
          style({ opacity: 1, transform: 'translateY(0)' })
        ),
      ]),
    ]),
  ],
})

export class CarouselComponent implements OnInit {
  carouselItems: CarouselItem[] = [];
  currentIndex: number = 0;

  constructor(private carouselService: CarouselService) {}

  ngOnInit(): void {
    this.carouselService.getCarouselItems().subscribe(items => {
      this.carouselItems = items;
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
}
