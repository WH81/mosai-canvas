export interface Releases {
  [x: string]: unknown;
  _id?: string;

  // Core metadata
  title: string; // Song or release title
  artist: string; // Main artist or band name
  album: string; // Album name (if applicable)
  coverUrl: string; // URL to album/single cover image

  // Dates as ISO strings for flexible frontend formatting
  releaseDate: string;

  // Categorization type
  type: 'latest' | 'pre-release' | 'past-release';

  // Modern grouped platform links (preferred)
  platforms?: {
    appleMusic?: string;
    spotify?: string;
    youtube?: string;
  };

  // Legacy flat platform links (for backward compatibility)
  appleMusicUrl?: string;
  spotifyUrl?: string;
  youtubeUrl?: string;

  // Pre-save URLs for unreleased tracks
  preSaveSpotifyUrl?: string;
  preSaveAppleMusicUrl?: string;

  // Optional metadata
  createdAt?: string;
  updatedAt?: string;

  // Visibility and publishing control
  visible?: boolean;
  status?: 'draft' | 'published' | 'archived';

  // FIX: Added to resolve template error (NG9)
  calendarDescription?: string;

  // NEW: optional bandSlug to filter releases by band
  bandSlug?: string;
}
