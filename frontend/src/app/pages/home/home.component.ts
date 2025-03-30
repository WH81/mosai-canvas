import { Component } from '@angular/core';

import { AboutComponent } from '../../components/about/about.component';
import { CarouselComponent } from '../../components/carousel/carousel.component';
import { MosaicanvasLogoComponent } from '../../components/mosaicanvas-logo/mosaicanvas-logo.component';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [AboutComponent, CarouselComponent, MosaicanvasLogoComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

}