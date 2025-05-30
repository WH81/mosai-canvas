import { Types } from 'mongoose';

export interface IBand {
  _id?: Types.ObjectId;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  members?: Types.ObjectId[];
  streamingLinks?: Types.ObjectId;
  socialLinks?: Types.ObjectId;
}
