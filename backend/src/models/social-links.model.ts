import mongoose, { Schema } from 'mongoose';
import { ISocialLinks } from '../interfaces/social-links.interface';

const SocialLinksSchema = new Schema<ISocialLinks>({
  band: { type: Schema.Types.ObjectId, ref: 'Band', required: false, unique: true },
  member: { type: Schema.Types.ObjectId, ref: 'Member', required: false, unique: true },
  facebook: String,
  instagram: String,
  x: String,
  youtube: String,
  tiktok: String,
}, { timestamps: true });

export const SocialLinks = mongoose.model<ISocialLinks>('SocialLinks', SocialLinksSchema);
