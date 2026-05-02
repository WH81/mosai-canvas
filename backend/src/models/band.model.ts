import mongoose, { Schema } from 'mongoose';
import { IBand } from '../interfaces/band.interface';

const BandSchema = new Schema<IBand>({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  bio: String,
  // description: String,
  image: String, // main band image
  aboutImage: String, // NEW field for image above "About" description
  logoType: {
    type: String,
    enum: ['svg', 'jpg'],
    default: 'svg'
  },
  youtubeChannelId: {
    type: String,
    required: false,
    index: true
  },
  members: [{ type: Schema.Types.ObjectId, ref: 'Member' }],
  socialLinks: { type: Schema.Types.ObjectId, ref: 'SocialLinks' },
  streamingLinks: { type: Schema.Types.ObjectId, ref: 'StreamingLinks' },
  streamingPlayers: { type: Schema.Types.ObjectId, ref: 'StreamingPlayers' }
}, { timestamps: true });

export const Band = mongoose.model<IBand>('Band', BandSchema);
