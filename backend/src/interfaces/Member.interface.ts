import { Document } from 'mongoose';

export interface IMember extends Document {
  name: string;
  instrument: string;
  band: string;
  image: string;
  bio: string;
}
