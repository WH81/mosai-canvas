import mongoose, { Schema } from 'mongoose';
import { IBand } from '../interfaces/band.interface';

const BandSchema = new Schema<IBand>({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: String,
  image: String, // main band image
  aboutImage: String, // NEW field for image above "About" description
  members: [{ type: Schema.Types.ObjectId, ref: 'Member' }],
  socialLinks: { type: Schema.Types.ObjectId, ref: 'SocialLinks' },
  streamingLinks: { type: Schema.Types.ObjectId, ref: 'StreamingLinks' }
}, { timestamps: true });

export const Band = mongoose.model<IBand>('Band', BandSchema);
