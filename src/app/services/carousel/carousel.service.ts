import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { CarouselItem } from '../../models/carousel/carousel.model';

@Injectable({
  providedIn: 'root'
})
export class CarouselService {

  constructor() { }

  getCarouselItems(): Observable<CarouselItem[]> {
    const items: CarouselItem[] = [
        {
            imageUrl: '/assets/images/metallica.jpg',
            bandName: 'Metallica',
            songName: 'Unforgiven',
            releaseDate: '1991',
            buttonText: 'Listen',
            buttonLink: 'https://www.youtube.com/watch?v=A_MjCqQoLLA'
        },
        {
            imageUrl: '/assets/images/iron-maiden.jpg',
            bandName: 'Iron Maiden',
            songName: 'The Trooper',
            releaseDate: '1983',
            buttonText: 'Listen',
            buttonLink: 'https://www.youtube.com/watch?v=O4irXQhgMqg'
        },
        {
            imageUrl: '/assets/images/gnr.jpg',
            bandName: 'Guns N\' Roses',
            songName: 'Sweet Child O\' Mine',
            releaseDate: '1987',
            buttonText: 'Listen',
            buttonLink: 'https://www.youtube.com/watch?v=flsBpM4x1E0'
        },
    ];
    return of(items);
  }
}