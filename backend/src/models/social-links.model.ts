import mongoose, { Schema } from 'mongoose';
import { ISocialLinks } from '../interfaces/social-links.interface';

const SocialLinksSchema = new Schema<ISocialLinks>({
  band: { type: Schema.Types.ObjectId, ref: 'Band', required: true, unique: true },
  facebook: String,
  instagram: String,
  x: String,
  youtube: String,
  tiktok: String,
}, { timestamps: true });

export const SocialLinks = mongoose.model<ISocialLinks>('SocialLinks', SocialLinksSchema);
