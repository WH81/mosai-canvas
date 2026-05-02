import { Types } from 'mongoose';

export interface IBand {
  _id?: Types.ObjectId;
  name: string;
  slug: string;
  // description?: string;
  image?: string;
  aboutImage?: string;
  logoType?: 'svg' | 'jpg';
  youtubeChannelId?: string;
  bio?: string;
  members?: Types.ObjectId[];
  streamingLinks?: Types.ObjectId;
  socialLinks?: Types.ObjectId;
  streamingPlayers?: Types.ObjectId;
}
