import axios from 'axios';
 
// ─── Types ────────────────────────────────────────────────────────────────────
 
export interface SpotifyTrack {
  id: string;
  name: string;
  durationMs: number;
  explicit: boolean;
  previewUrl: string | null;
  spotifyUrl: string;
  trackNumber: number;
  album: {
    id: string;
    name: string;
    releaseDate: string;
    imageUrl: string | null;
    spotifyUrl: string;
  };
}
 
export interface SpotifyAlbum {
  id: string;
  name: string;
  albumType: string;
  releaseDate: string;
  totalTracks: number;
  imageUrl: string | null;
  spotifyUrl: string;
  tracks: SpotifyTrack[];
}
 
export interface SpotifyArtistProfile {
  id: string;
  name: string;
  imageUrl: string | null;
  spotifyUrl: string;
  followers: number;
  genres: string[];
  popularity: number;
}
 
// ─── Token Cache ──────────────────────────────────────────────────────────────
 
interface TokenCache {
  accessToken: string;
  expiresAt: number; // Unix timestamp in ms
}
 
let tokenCache: TokenCache | null = null;
 
/**
 * Fetches a fresh Client Credentials token from Spotify and caches it.
 * Automatically refreshes when within 60 seconds of expiry.
 */
async function getAccessToken(): Promise<string> {
  const now = Date.now();
  const bufferMs = 60_000; // refresh 60s before expiry
 
  if (tokenCache && tokenCache.expiresAt - bufferMs > now) {
    return tokenCache.accessToken;
  }
 
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
 
  if (!clientId || !clientSecret) {
    throw new Error('SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET must be set in .env');
  }
 
  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
 
  const response = await axios.post<{ access_token: string; expires_in: number }>(
    'https://accounts.spotify.com/api/token',
    new URLSearchParams({ grant_type: 'client_credentials' }),
    {
      headers: {
        Authorization: `Basic ${credentials}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  );
 
  tokenCache = {
    accessToken: response.data.access_token,
    expiresAt: now + response.data.expires_in * 1000,
  };
 
  return tokenCache.accessToken;
}
 
// ─── Helpers ──────────────────────────────────────────────────────────────────
 
function getBestImage(images: { url: string; height: number | null; width: number | null }[]): string | null {
  if (!images || images.length === 0) return null;
  // Prefer ~300px image; fall back to first available
  const preferred = images.find(img => img.height && img.height >= 300 && img.height <= 640);
  
  // FIX: Added optional chaining and nullish coalescing for TS2532
  return preferred ? preferred.url : (images[0]?.url ?? null);
}
 
// FIX: Added 'export' to prevent TS6133 (declared but never read)
export function msToReadable(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}
 
function mapTrack(track: any, albumData: any): SpotifyTrack {
  return {
    id: track.id,
    name: track.name,
    durationMs: track.duration_ms,
    explicit: track.explicit,
    previewUrl: track.preview_url ?? null,
    spotifyUrl: track.external_urls?.spotify ?? '',
    trackNumber: track.track_number,
    album: {
      id: albumData.id,
      name: albumData.name,
      releaseDate: albumData.release_date,
      imageUrl: getBestImage(albumData.images ?? []),
      spotifyUrl: albumData.external_urls?.spotify ?? '',
    },
  };
}
 
// ─── Public API ───────────────────────────────────────────────────────────────
 
/**
 * Search for an artist by name and return their Spotify ID.
 * Returns null if not found.
 */
export async function searchArtistId(artistName: string): Promise<string | null> {
  const token = await getAccessToken();
 
  const response = await axios.get('https://api.spotify.com/v1/search', {
    headers: { Authorization: `Bearer ${token}` },
    params: {
      q: `artist:${artistName}`,
      type: 'artist',
      limit: 1,
    },
  });
 
  const artists = response.data?.artists?.items;
  if (!artists || artists.length === 0) return null;
 
  return artists[0].id as string;
}
 
/**
 * Fetch artist profile info (name, image, followers, genres).
 */
export async function getArtistProfile(artistId: string): Promise<SpotifyArtistProfile> {
  const token = await getAccessToken();
 
  const response = await axios.get(`https://api.spotify.com/v1/artists/${artistId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
 
  const a = response.data;
  return {
    id: a.id,
    name: a.name,
    imageUrl: getBestImage(a.images ?? []),
    spotifyUrl: a.external_urls?.spotify ?? '',
    followers: a.followers?.total ?? 0,
    genres: a.genres ?? [],
    popularity: a.popularity ?? 0,
  };
}
 
/**
 * Fetch an artist's top tracks (up to 10) for a given market.
 * Defaults to US market.
 */
export async function getArtistTopTracks(
  artistId: string,
  market = 'US'
): Promise<SpotifyTrack[]> {
  const token = await getAccessToken();
 
  const response = await axios.get(
    `https://api.spotify.com/v1/artists/${artistId}/top-tracks`,
    {
      headers: { Authorization: `Bearer ${token}` },
      params: { market },
    }
  );
 
  const tracks: any[] = response.data?.tracks ?? [];
  return tracks.map(track => mapTrack(track, track.album));
}
 
/**
 * Fetch an artist's albums (albums + singles), with each album's full track list.
 * Results are sorted newest first.
 */
export async function getArtistDiscography(
  artistId: string,
  market = 'US'
): Promise<SpotifyAlbum[]> {
  const token = await getAccessToken();
 
  // Step 1: Get all albums/singles
  const albumsResponse = await axios.get(
    `https://api.spotify.com/v1/artists/${artistId}/albums`,
    {
      headers: { Authorization: `Bearer ${token}` },
      params: {
        include_groups: 'album,single',
        market,
        limit: 50,
      },
    }
  );
 
  const albums: any[] = albumsResponse.data?.items ?? [];
 
  // Step 2: For each album, fetch its tracks
  const discography: SpotifyAlbum[] = await Promise.all(
    albums.map(async (album: any) => {
      const tracksResponse = await axios.get(
        `https://api.spotify.com/v1/albums/${album.id}/tracks`,
        {
          headers: { Authorization: `Bearer ${token}` },
          params: { market, limit: 50 },
        }
      );
 
      const tracks: SpotifyTrack[] = (tracksResponse.data?.items ?? []).map((track: any) =>
        mapTrack(track, album)
      );
 
      return {
        id: album.id,
        name: album.name,
        albumType: album.album_type,
        releaseDate: album.release_date,
        totalTracks: album.total_tracks,
        imageUrl: getBestImage(album.images ?? []),
        spotifyUrl: album.external_urls?.spotify ?? '',
        tracks,
      };
    })
  );
 
  // Sort newest first
  return discography.sort(
    (a, b) => new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime()
  );
}
