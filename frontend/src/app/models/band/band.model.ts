export interface Band {
    name: string;
    slug: string;
    description: string;
    image: string;
    socialLinks?: {
      facebook?: string;
      instagram?: string;
      x?: string;
      youtube?: string;
      tiktok?: string;
    };
  }
  