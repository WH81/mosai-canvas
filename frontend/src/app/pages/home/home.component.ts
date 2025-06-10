import { Component } from '@angular/core';

import { AboutComponent } from '../../components/about/about.component';
import { CarouselComponent } from '../../components/carousel/carousel.component';
import { MosaicanvasLogoComponent } from '../../components/mosaicanvas-logo/mosaicanvas-logo.component';
import { TourComponent } from '../../components/tour/tour.component';
import { MailingListComponent } from '../../components/mailing-list/mailing-list.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [AboutComponent, CarouselComponent, MosaicanvasLogoComponent, TourComponent, MailingListComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {}