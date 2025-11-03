import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Band } from '../../models/band/band.model';
import { SocialLinksComponent } from '../social-links/social-links.component';
import { StreamingLinksComponent } from '../streaming-links/streaming-links.component';

@Component({
  selector: 'app-band-about',
  standalone: true,
  imports: [CommonModule, SocialLinksComponent, StreamingLinksComponent],
  templateUrl: './band-about.component.html',
  styleUrls: ['./band-about.component.scss']
})
export class BandAboutComponent {
  @Input() band?: Band;
}
