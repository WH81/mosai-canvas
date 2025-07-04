import mongoose, { Schema } from 'mongoose';
import { ISocialLinks } from '../interfaces/social-links.interface';

const SocialLinksSchema = new Schema<ISocialLinks>({
  band: {
    type: Schema.Types.ObjectId,
    ref: 'Band',
    required: false,
    unique: true
  },
  member: {
    type: Schema.Types.ObjectId,
    ref: 'Member',
    required: false,
    unique: true
  },
  facebook: {
    type: String
  },
  instagram: {
    type: String
  },
  x: {
    type: String
  },
  youtube: {
    type: String
  },
  tiktok: {
    type: String
  },
}, { timestamps: true });

export const SocialLinks = mongoose.model<ISocialLinks>('SocialLinks', SocialLinksSchema);
