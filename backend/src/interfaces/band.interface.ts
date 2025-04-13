import { Document } from 'mongoose';

export interface IBand extends Document {
  name: string;
  slug: string;
  description: string;
  image: string;
}
