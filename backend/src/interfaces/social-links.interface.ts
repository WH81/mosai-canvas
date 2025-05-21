import { Document } from 'mongoose';

export interface ISocialLinks extends Document {
    facebook?: string;
    instagram?: string;
    x?: string;
    youtube?: string;
    tiktok?: string;
    member: string; // or Types.ObjectId if you import it
  }
  