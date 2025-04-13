import mongoose, { Schema } from 'mongoose';
import { IBand } from '../interfaces/band.interface';

const bandSchema: Schema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IBand>('Band', bandSchema);
