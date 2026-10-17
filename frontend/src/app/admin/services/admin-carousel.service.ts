import {
  Injectable,
  inject,
} from '@angular/core';

import {
  HttpClient,
} from '@angular/common/http';

import {
  Observable,
} from 'rxjs';

import {
  CarouselItem,
} from '../../models/carousel/carousel.model';

export interface CreateCarouselRequest {
  imageUrl: string;
  bandName: string;
  songName: string;
  releaseDate: string;
  buttonText: string;
  buttonLink: string;
}

export interface UpdateCarouselRequest {
  imageUrl: string;
  bandName: string;
  songName: string;
  releaseDate: string;
  buttonText: string;
  buttonLink: string;
}

export interface ReorderCarouselRequest {
  orderedIds: string[];
}

@Injectable({
  providedIn: 'root',
})
export class AdminCarouselService {
  private readonly http =
    inject(HttpClient);

  private readonly apiUrl =
    '/api/carousel';

  getCarouselItems():
    Observable<CarouselItem[]> {
    return this.http.get<CarouselItem[]>(
      this.apiUrl
    );
  }

  createCarouselItem(
    request: CreateCarouselRequest
  ): Observable<CarouselItem> {
    return this.http.post<CarouselItem>(
      this.apiUrl,
      request
    );
  }

  updateCarouselItem(
    id: string,
    request: UpdateCarouselRequest
  ): Observable<CarouselItem> {
    return this.http.put<CarouselItem>(
      `${this.apiUrl}/${encodeURIComponent(id)}`,
      request
    );
  }

  reorderCarouselItems(
    request: ReorderCarouselRequest
  ): Observable<CarouselItem[]> {
    return this.http.put<CarouselItem[]>(
      `${this.apiUrl}/order`,
      request
    );
  }

  deleteCarouselItem(
    id: string
  ): Observable<CarouselItem> {
    return this.http.delete<CarouselItem>(
      `${this.apiUrl}/${encodeURIComponent(id)}`
    );
  }
}