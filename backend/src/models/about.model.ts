import mongoose, { Schema } from 'mongoose';
import { IAbout } from '../interfaces/about.interface';

const AboutSchema: Schema = new Schema({
  id: { type: String },
  title: { type: String, required: true },
  body: { type: String, required: true },
});

export default mongoose.model<IAbout>('About', AboutSchema);
