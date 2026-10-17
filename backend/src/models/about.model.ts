import mongoose, { Schema } from 'mongoose';
import { IAbout } from '../interfaces/about.interface';

const AboutSchema = new Schema<IAbout>(
  {
    title: {
      type: String,
      required: false,
      trim: true,
      maxlength: 100,
    },

    body: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IAbout>('About', AboutSchema);