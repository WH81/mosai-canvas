import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CarouselItem } from '../../models/carousel/carousel.model';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs'; // RxJS 'of' to handle errors gracefully

@Injectable({
  providedIn: 'root'
})
export class CarouselService {
  private apiUrl = 'http://localhost:5001/api/carousel'; // Update this URL based on your backend

  constructor(private http: HttpClient) {}

  // Fetch carousel items from backend
  getCarouselItems(): Observable<CarouselItem[]> {
    return this.http.get<CarouselItem[]>(this.apiUrl).pipe(
      catchError((error) => {
        console.error('Error fetching carousel items:', error);
        return of([]); // Return an empty array or handle accordingly
      })
    );
  }

  // Create a new carousel item
  createCarouselItem(newItem: CarouselItem): Observable<CarouselItem | null> {
    return this.http.post<CarouselItem>(this.apiUrl, newItem).pipe(
      catchError((error) => {
        console.error('Error creating carousel item:', error);
        return of(null); // Return null or handle accordingly
      })
    );
  }

  // Update an existing carousel item
  updateCarouselItem(id: string, updatedItem: CarouselItem): Observable<CarouselItem | null> {
    return this.http.put<CarouselItem>(`${this.apiUrl}/${id}`, updatedItem).pipe(
      catchError((error) => {
        console.error('Error updating carousel item:', error);
        return of(null); // Return null or handle accordingly
      })
    );
  }

  // Delete a carousel item
  deleteCarouselItem(id: string): Observable<void | null> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError((error) => {
        console.error('Error deleting carousel item:', error);
        return of(null); // Return null or handle accordingly
      })
    );
  }
}



// import { Injectable } from '@angular/core';
// import { Observable, of } from 'rxjs';
// import { CarouselItem } from '../../models/carousel/carousel.model';

// @Injectable({
//   providedIn: 'root'
// })
// export class CarouselService {

//   constructor() { }

//   getCarouselItems(): Observable<CarouselItem[]> {
//     const items: CarouselItem[] = [
//         {
//             imageUrl: '/assets/images/metallica.jpg',
//             bandName: 'Metallica',
//             songName: 'Unforgiven',
//             releaseDate: '1991',
//             buttonText: 'Listen',
//             buttonLink: 'https://www.google.com/aclk?sa=l&ai=DChcSEwiV1o2xgIaMAxWjWkcBHY2TIs4YABAGGgJxdQ&co=1&gclid=Cj0KCQjw4cS-BhDGARIsABg4_J3A9qSrZ1QjjxivFo-6-7PJl5m13vbVARDddU110hMCjufGAOluJRYaAi1KEALw_wcB&sig=AOD64_3OahP0FfUG-9O2hOVUlmsN6_noMA&adurl=https://www.vividseats.com/metallica-tickets/performer/529%3Fsem%3DeyJsb2MiOnsibmFtZSI6IlRhbXBhIiwibG5nIjotODIuNTAzMzM0NDAsImxhdCI6MjcuOTc1ODY5MTB9fQ%26_%26utm_source%3Dgoogle%26utm_medium%3Dcpc%26utm_campaign%3D21723409586%26utm_term%3Dmetallica%26adgroup%3D166395331334%26target%3Dkwd-30198861%26loc_i%3D%26loc_p%3D9012140%26gad_source%3D2&ms=[CLICK_MS]&nx=[NX]&ny=[NY]&nb=0'
//         },
//         {
//             imageUrl: '/assets/images/iron-maiden.jpg',
//             bandName: 'Iron Maiden',
//             songName: 'The Trooper',
//             releaseDate: '1983',
//             buttonText: 'Listen',
//             buttonLink: 'https://www.youtube.com/watch?v=6KdN6_4a8IY&pp=ygULaXJvbiBtYWlkZW4%3D'
//         },
//         {
//             imageUrl: '/assets/images/gnr.jpg',
//             bandName: 'Guns N\' Roses',
//             songName: 'Sweet Child O\' Mine',
//             releaseDate: '1987',
//             buttonText: 'Listen',
//             buttonLink: 'https://www.youtube.com/watch?v=XKAp1f-wbko&pp=ygUMZ3VucyBuIHJvc2Vz'
//         },
//     ];
//     return of(items);
//   }
// }