import mongoose, { Schema } from 'mongoose';
import { IStreamingLinks } from '../interfaces/streaming-links.interface';

const StreamingLinksSchema = new Schema<IStreamingLinks>({
  band: {
    type: Schema.Types.ObjectId,
    ref: 'Band',
    required: true
  },
  spotify: {
    type: String
  },
  appleMusic: {
    type: String
  },
  soundCloud: {
    type: String
  }
}, { timestamps: true });

export const StreamingLinks = mongoose.model<IStreamingLinks>('StreamingLinks', StreamingLinksSchema);
