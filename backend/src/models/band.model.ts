import mongoose, { Schema } from 'mongoose';
import { IBand } from '../interfaces/band.interface';

const BandSchema = new Schema<IBand>({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: String,
  image: String,
  members: [{ type: Schema.Types.ObjectId, ref: 'Member' }],
  streamingLinks: { type: Schema.Types.ObjectId, ref: 'StreamingLinks' },
  socialLinks: { type: Schema.Types.ObjectId, ref: 'SocialLinks' }
}, { timestamps: true });

export const Band = mongoose.model<IBand>('Band', BandSchema);
