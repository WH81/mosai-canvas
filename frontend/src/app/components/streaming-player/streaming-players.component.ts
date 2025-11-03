import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

interface StreamingPlayersLinks {
  spotifyUrl?: string;
  appleMusicUrl?: string;
}

@Component({
  selector: 'app-streaming-players',
  templateUrl: './streaming-players.component.html',
  styleUrls: ['./streaming-players.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class StreamingPlayersComponent implements OnChanges {
  @Input() links: StreamingPlayersLinks = {};

  spotifySafeUrl?: SafeResourceUrl;
  appleMusicSafeUrl?: SafeResourceUrl;

  constructor(private sanitizer: DomSanitizer) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['links']) {
      this.spotifySafeUrl = this.links.spotifyUrl
        ? this.sanitizer.bypassSecurityTrustResourceUrl(this.links.spotifyUrl)
        : undefined;
      this.appleMusicSafeUrl = this.links.appleMusicUrl
        ? this.sanitizer.bypassSecurityTrustResourceUrl(this.links.appleMusicUrl)
        : undefined;
    }
  }
}
