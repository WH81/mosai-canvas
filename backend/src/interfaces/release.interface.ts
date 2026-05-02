export interface IRelease {
    _id?: string;
    title: string;
    artist: string;
    album: string;
    coverUrl: string;
    releaseDate: Date;
    type: 'latest' | 'pre-release' | 'past-release';
    appleMusicUrl?: string;
    spotifyUrl?: string;
    youtubeUrl?: string;
    bandSlug?: string;
  }
  