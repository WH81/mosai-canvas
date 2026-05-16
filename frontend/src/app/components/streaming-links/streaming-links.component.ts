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
  @Input() size: 'small' | 'large' = 'large';
  @Input() variant: 'default' | 'divided' | 'glass' = 'default';

  get activeStreaming() {
    if (!this.streamingLinks) return [];
    
    const mapping = [
      { key: 'spotify', icon: 'fa-brands fa-spotify', label: 'Spotify' },
      { key: 'appleMusic', icon: 'fab fa-apple', label: 'Apple Music' },
      { key: 'soundCloud', icon: 'fa-brands fa-soundcloud', label: 'SoundCloud' }
    ];

    return mapping
      .filter(item => !!this.streamingLinks![item.key as keyof StreamingLinks])
      .map(item => ({
        url: this.streamingLinks![item.key as keyof StreamingLinks],
        icon: item.icon,
        label: item.label
      }));
  }
}