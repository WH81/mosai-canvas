import { Types } from 'mongoose';
 
export interface IStreamingPlayers {
  _id?: Types.ObjectId;
  bandId: Types.ObjectId;
 
  /**
   * Spotify Artist ID (e.g. "2niqXXwMFNGb7WerlhtwCL")
   * Used to fetch tracks/discography live from the Spotify API.
   * Takes priority over spotifyUrl if both are present.
   */
  spotifyArtistId?: string;
 
  /**
   * Optional direct Spotify artist URL.
   * Retained for backwards compatibility / deep linking.
   * Example: "https://open.spotify.com/artist/2niqXXwMFNGb7WerlhtwCL"
   */
  spotifyUrl?: string;
 
  /** Apple Music artist or album URL */
  appleMusicUrl?: string;
}
