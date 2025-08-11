import { Types } from 'mongoose';

export interface IBand {
  _id?: Types.ObjectId;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  aboutImage?: string;  // <-- add this line
  members?: Types.ObjectId[];
  streamingLinks?: Types.ObjectId;
  socialLinks?: Types.ObjectId;
}
