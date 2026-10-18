import {
  Injectable,
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

@Injectable({
  providedIn: 'root',
})
export class CarouselService {
  private readonly apiUrl =
    '/api/carousel';

  /**
   * Retrieve carousel items.
   *
   * The backend returns items in their
   * administrator-defined order.
   */
  getCarouselItems():
    Observable<CarouselItem[]> {
    return this.http.get<
      CarouselItem[]
    >(
      this.apiUrl
    );
  }

  constructor(
    private readonly http: HttpClient
  ) {}
}