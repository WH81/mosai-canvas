import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SwiperModule } from 'swiper/angular';
import { SwiperCore, Autoplay, Pagination, Navigation } from 'swiper/modules';

SwiperCore.use([Autoplay, Pagination, Navigation]);

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/autoplay';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

// Register Swiper modules globally (optional)
SwiperCore.use([Autoplay, Pagination, Navigation]);

@Component({
  selector: 'app-carousel',
  standalone: true,
  imports: [CommonModule, SwiperModule],
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss'],
})
export class CarouselComponent {
  @Input() items: { 
    imageUrl: string; 
    bandName: string; 
    songName: string; 
    releaseDate: string; 
    buttonLink: string; 
  }[] = [];

  // Swiper settings (Angular binding)
  autoplay = { delay: 3000, disableOnInteraction: false };
  pagination = { clickable: true };
  navigation = true;
  slidesPerView = 'auto';
  centeredSlides = true;
  spaceBetween = 30;
}
