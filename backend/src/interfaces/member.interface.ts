import { Document, Types } from 'mongoose';

export interface IMember extends Document {
  name: string;
  instrument: string;
  band: Types.ObjectId;
  bandSlug: string;
  image: string;
  bio: string;
  socialLinks?: Types.ObjectId;
  streamingLinks?: Types.ObjectId;
}