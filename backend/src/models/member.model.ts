import mongoose, { Schema } from 'mongoose';
import { IMember } from '../interfaces/member.interface';

const memberSchema: Schema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    instrument: { type: String, required: true },
    band: { type: mongoose.Schema.Types.ObjectId, ref: 'Band', required: true },
    bandSlug: { type: String, required: true, unique: true },
    image: { type: String, required: true },
    bio: { type: String, required: true }
  },
  { timestamps: true }
);

export default mongoose.model<IMember>('Member', memberSchema);