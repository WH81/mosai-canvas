import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MenuComponent } from './components/menu/menu.component';
import { FooterComponent } from './components/footer/footer.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [RouterModule, MenuComponent, FooterComponent],
})
export class AppComponent {
  bandName(bandName: any) {
    throw new Error('Method not implemented.');
  }
}
