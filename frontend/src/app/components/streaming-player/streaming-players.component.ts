import {
  Component,
  Input,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { StreamingPlayers } from '../../models/streaming-players/streaming-players.model';
 
@Component({
  selector: 'app-streaming-players',
  templateUrl: './streaming-players.component.html',
  styleUrls: ['./streaming-players.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class StreamingPlayersComponent implements OnChanges {
  /**
   * Full StreamingPlayers object fetched by band-page.component.ts
   * Contains spotifyArtistId, spotifyUrl, appleMusicUrl
   */
  @Input() streamingPlayer: StreamingPlayers | null = null;
  @Input() playerHeight: string = '380px';
  
  spotifySafeUrl?: SafeResourceUrl;
  appleMusicSafeUrl?: SafeResourceUrl;
 
  constructor(private sanitizer: DomSanitizer) {}
 
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['streamingPlayer']) {
      this.buildUrls();
    }
  }
 
  private buildUrls(): void {
    const player = this.streamingPlayer;
 
    if (!player) {
      this.spotifySafeUrl = undefined;
      this.appleMusicSafeUrl = undefined;
      return;
    }
 
    // ── Spotify ───────────────────────────────────────────────────────────
    // Priority: spotifyArtistId → parse embed URL from spotifyUrl → raw spotifyUrl
    const spotifyEmbedUrl = this.resolveSpotifyEmbedUrl(player);
    this.spotifySafeUrl = spotifyEmbedUrl
      ? this.sanitizer.bypassSecurityTrustResourceUrl(spotifyEmbedUrl)
      : undefined;
 
    // ── Apple Music ───────────────────────────────────────────────────────
    this.appleMusicSafeUrl = player.appleMusicUrl
      ? this.sanitizer.bypassSecurityTrustResourceUrl(player.appleMusicUrl)
      : undefined;
  }
 
  /**
   * Resolves the correct Spotify embed URL from available data.
   *
   * Spotify embed URLs follow this format:
   * https://open.spotify.com/embed/artist/{artistId}
   *
   * We handle 3 cases:
   * 1. spotifyArtistId is stored directly → build embed URL
   * 2. spotifyUrl is already an embed URL → use as-is
   * 3. spotifyUrl is a standard open.spotify.com URL → convert to embed
   */
  private resolveSpotifyEmbedUrl(player: StreamingPlayers): string | null {
    // Case 1: Artist ID stored directly — most reliable
    if (player.spotifyArtistId) {
      return `https://open.spotify.com/embed/artist/${player.spotifyArtistId}`;
    }
 
    // Case 2 & 3: Parse from spotifyUrl
    if (player.spotifyUrl) {
      // Already an embed URL
      if (player.spotifyUrl.includes('/embed/')) {
        return player.spotifyUrl;
      }
 
      // Standard URL → convert to embed
      // e.g. https://open.spotify.com/artist/2niqXXwMFNGb7WerlhtwCL
      //   → https://open.spotify.com/embed/artist/2niqXXwMFNGb7WerlhtwCL
      const match = player.spotifyUrl.match(
        /open\.spotify\.com\/(artist|album|playlist|track)\/([A-Za-z0-9]+)/
      );
      if (match) {
        return `https://open.spotify.com/embed/${match[1]}/${match[2]}`;
      }
    }
 
    return null;
  }
 
  get hasSpotify(): boolean {
    return !!this.spotifySafeUrl;
  }
 
  get hasAppleMusic(): boolean {
    return !!this.appleMusicSafeUrl;
  }
 
  get hasAnyPlayer(): boolean {
    return this.hasSpotify || this.hasAppleMusic;
  }
}