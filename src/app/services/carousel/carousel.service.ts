import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CarouselService {
  getCarouselItems() {
    return [
      {
        imageUrl: 'assets/images/band1.jpg',
        bandName: 'Band One',
        songName: 'Song One',
        releaseDate: '2023-01-01',
        buttonLink: 'https://example.com/page1',
      },
      {
        imageUrl: 'assets/images/band2.jpg',
        bandName: 'Band Two',
        songName: 'Song Two',
        releaseDate: '2023-02-01',
        buttonLink: 'https://example.com/page2',
      },
      {
        imageUrl: 'assets/images/band3.jpg',
        bandName: 'Band Three',
        songName: 'Song Three',
        releaseDate: '2023-03-01',
        buttonLink: 'https://example.com/page3',
      },
    ];
  }
}
