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

  getBandLogo(): string {
    if (!this.band) return '';
    const ext = this.band.logoType || 'svg';
    const folder = ext === 'jpg' ? 'jpgs' : 'svgs';
    return `assets/${folder}/${this.band.slug}.${ext}`;
  }
}
