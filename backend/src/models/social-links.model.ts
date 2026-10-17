import mongoose, { Schema } from 'mongoose';
import { ISocialLinks } from '../interfaces/social-links.interface';

const SocialLinksSchema = new Schema<ISocialLinks>({
  band: {
    type: Schema.Types.ObjectId,
    ref: 'Band'
  },
  member: {
    type: Schema.Types.ObjectId,
    ref: 'Member'
  },

  facebook: String,
  instagram: String,
  x: String,
  youtube: String,
  tiktok: String,
}, { timestamps: true });

SocialLinksSchema.index(
  { band: 1 },
  {
    unique: true,
    partialFilterExpression: {
      band: { $exists: true }
    }
  }
);

SocialLinksSchema.index(
  { member: 1 },
  {
    unique: true,
    partialFilterExpression: {
      member: { $exists: true }
    }
  }
);

export const SocialLinks = mongoose.model<ISocialLinks>('SocialLinks', SocialLinksSchema);
