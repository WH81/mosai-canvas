import { Types } from 'mongoose';

export interface IBand {
  _id?: Types.ObjectId;
  name: string;
  slug: string;
  image?: string;
  bandLogo?: string;
  youtubeChannelId?: string;
  bio?: string;
  members?: Types.ObjectId[];
  streamingLinks?: Types.ObjectId;
  socialLinks?: Types.ObjectId;
  streamingPlayers?: Types.ObjectId;
}
