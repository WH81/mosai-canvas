import mongoose, { Schema } from 'mongoose';
import { IRelease } from '../interfaces/release.interface';

const releaseSchema = new Schema<IRelease>({
  title: { type: String, required: true },
  artist: { type: String, required: true },
  album: { type: String, required: true },
  coverUrl: { type: String, required: true },
  releaseDate: { type: Date, required: true },
  type: { type: String, enum: ['latest', 'pre-release', 'past-release'], required: true },
  appleMusicUrl: String,
  spotifyUrl: String,
  youtubeUrl: String,
  bandSlug: { type: String, required: false } 
});

export default mongoose.model<IRelease>('Release', releaseSchema);
