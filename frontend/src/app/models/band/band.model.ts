export interface Band {
  _id: any;
  name: string;
  slug: string;
  image: string;
  bandLogo?: string;
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
  heroImage?: string;
  bio: string;
  members: string[];
}
