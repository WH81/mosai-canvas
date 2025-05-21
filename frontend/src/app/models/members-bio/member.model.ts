export interface Member {
  name: string;
  instrument: string;
  band: string;
  bandSlug: string;
  image: string;
  bio: string;
  socialLinks?: {
    facebook?: string;
    instagram?: string;
    x?: string;
    youtube?: string;
    tiktok?: string;
  };
}
