import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { TourService } from '../../services/tour/tour.service';
import { Tour } from '../../models/tour/tour.model';
import { catchError, of } from 'rxjs';
import { ScrollAnimateDirective } from '../../directives/scroll-animate.directive';

@Component({
  selector: 'app-tour',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    ScrollAnimateDirective,
  ],
  templateUrl: './tour.component.html',
  styleUrls: ['./tour.component.scss'],
})
export class TourComponent implements OnInit {
  tours: Tour[] = [];

  constructor(
    private readonly tourService: TourService
  ) {}

  ngOnInit(): void {
    this.loadTours();
  }

  /**
   * Loads current and upcoming tour dates.
   *
   * The backend already removes expired dates.
   * We additionally filter and sort here so the
   * component remains defensive.
   */
  loadTours(): void {
    this.tourService
      .getTours()
      .pipe(
        catchError((err) => {
          console.error(
            'Failed to load tours',
            err
          );

          return of([] as Tour[]);
        })
      )
      .subscribe((data) => {
        const today = this.getTodayDateString();

        this.tours = data
          .filter((tour) => tour.date >= today)
          .sort((a, b) =>
            a.date.localeCompare(b.date)
          );
      });
  }

  /**
   * Returns today's date as YYYY-MM-DD.
   *
   * Uses local date components rather than
   * toISOString() to prevent timezone shifts.
   */
  private getTodayDateString(): string {
    const now = new Date();

    const year = now.getFullYear();
    const month = String(
      now.getMonth() + 1
    ).padStart(2, '0');

    const day = String(
      now.getDate()
    ).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  /**
   * Creates a Google Calendar event link.
   */
  getGoogleCalendarLink(
    tour: Tour
  ): string {
    const startDate = new Date(
      `${tour.date}T00:00:00`
    );

    const endDate = new Date(
      startDate.getTime() +
        2 * 60 * 60 * 1000
    );

    const formattedStart = startDate
      .toISOString()
      .replace(/-|:|\.\d+/g, '');

    const formattedEnd = endDate
      .toISOString()
      .replace(/-|:|\.\d+/g, '');

    const location =
      `${tour.venue}, ` +
      `${tour.city}, ` +
      `${tour.state}`;

    return (
      'https://www.google.com/calendar/render' +
      '?action=TEMPLATE' +
      `&text=${encodeURIComponent(
        `${tour.band} at ${tour.venue}`
      )}` +
      `&dates=${formattedStart}/${formattedEnd}` +
      `&location=${encodeURIComponent(location)}`
    );
  }
}