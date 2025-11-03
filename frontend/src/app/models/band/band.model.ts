export interface Band {
  _id: any;
  name: string;
  slug: string;
  description: string;
  image: string;
  logoType?: 'svg' | 'jpg';
  aboutImage?: string;
  socialLinks?: {
    facebook?: string;
    instagram?: string;
    x?: string;
    youtube?: string;
    tiktok?: string;
  };
  streamingLinks?: {
    spotify?: string;
    appleMusic?: string;
    soundCloud?: string;
  };
}
