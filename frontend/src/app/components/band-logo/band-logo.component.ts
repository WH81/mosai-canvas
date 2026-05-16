import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Band } from '../../models/band/band.model';

@Component({
  selector: 'app-band-logo',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './band-logo.component.html',
  styleUrls: ['./band-logo.component.scss']
})
export class BandLogoComponent {
  @Input() band?: Band;

  /**
   * Returns the Cloudinary URL from the database.
   * Logic is now simplified as we no longer use local assets or logoType.
   */
  getBandLogo(): string {
    return this.band?.bandLogo || '';
  }
}
