import { Component } from '@angular/core';
import { CarouselComponent } from '../../components/carousel/carousel.component';


@Component({
  selector: 'app-home',
  standalong: true,
  imports: [CarouselComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

}