import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CarouselComponent } from './components/carousel/carousel.component';
import { MenuComponent } from './components/menu/menu.component';
import { AboutComponent } from './components/about/about.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [RouterModule, CarouselComponent, MenuComponent, AboutComponent],
})
export class AppComponent {
  bandName(bandName: any) {
    throw new Error('Method not implemented.');
  }
}
