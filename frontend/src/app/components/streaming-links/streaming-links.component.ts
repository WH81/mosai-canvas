import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StreamingLinks } from '../../models/streaming-links/streaming-links.model';

@Component({
  selector: 'app-streaming-links',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './streaming-links.component.html',
  styleUrls: ['./streaming-links.component.scss']
})
export class StreamingLinksComponent {
  @Input() streamingLinks?: StreamingLinks;
  @Input() size: 'small' | 'large' = 'small';
}
