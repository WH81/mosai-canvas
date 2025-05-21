import { Document, Types } from 'mongoose';

export interface IMember extends Document {
  name: string;
  instrument: string;
  band: string;
  bandSlug: string;
  image: string;
  bio: string;
  socialLinks?: Types.ObjectId;
}
