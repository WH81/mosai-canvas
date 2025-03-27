import mongoose, { Schema } from 'mongoose';
import { IMember } from '../interfaces/Member.interface';

const memberSchema: Schema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    instrument: { type: String, required: true },
    band: { type: String, required: true },
    image: { type: String, required: true },
    bio: { type: String, required: true }
  },
  { timestamps: true }
);

export default mongoose.model<IMember>('Member', memberSchema);