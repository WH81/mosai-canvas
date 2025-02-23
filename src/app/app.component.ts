import { Component, OnInit } from '@angular/core';
import { CarouselService } from './services/carousel/carousel.service';
import { CarouselComponent } from './components/carousel/carousel.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [CarouselComponent, RouterModule]
})
export class AppComponent implements OnInit {
  carouselItems: { imageUrl: string; bandName: string; songName: string; releaseDate: string; buttonLink: string; }[] = [];

  constructor(private carouselService: CarouselService) {}

  ngOnInit(): void {
    this.carouselItems = this.carouselService.getCarouselItems();
  }
}
