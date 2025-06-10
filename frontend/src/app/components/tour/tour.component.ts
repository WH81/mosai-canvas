import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { TourService } from '../../services/tour/tour.service';
import { Tour } from '../../models/tour/tour.model';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-tour',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './tour.component.html',
  styleUrls: ['./tour.component.scss']
})
export class TourComponent implements OnInit {
  tours: Tour[] = [];

  constructor(private tourService: TourService) {}

  ngOnInit(): void {
    this.loadTours();
  }

  loadTours(): void {
    this.tourService.getTours()
      .pipe(
        catchError(err => {
          console.error('Failed to load tours', err);
          return of([] as Tour[]);
        })
      )
      .subscribe(data => {
        this.tours = data;
      });
  }

  getGoogleCalendarLink(tour: Tour): string {
    const startDate = new Date(tour.date).toISOString().replace(/-|:|\.\d+/g, '');
    const endDate = new Date(new Date(tour.date).getTime() + 2 * 60 * 60 * 1000)
      .toISOString().replace(/-|:|\.\d+/g, '');
    const location = `${tour.venue}, ${tour.city}, ${tour.state}`;
    return `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
      `${tour.band} at ${tour.venue}`
    )}&dates=${startDate}/${endDate}&location=${encodeURIComponent(location)}`;
  }
}
