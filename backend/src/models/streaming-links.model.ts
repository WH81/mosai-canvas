import mongoose, { Schema } from 'mongoose';
import { IStreamingLinks } from '../interfaces/streaming-links.interface';

const StreamingLinksSchema = new Schema<IStreamingLinks>(
  {
    band: {
      type: Schema.Types.ObjectId,
      ref: 'Band',
      required: false,
    },

    member: {
      type: Schema.Types.ObjectId,
      ref: 'Member',
      required: false,
    },

    spotify: {
      type: String,
      trim: true,
    },

    appleMusic: {
      type: String,
      trim: true,
    },

    soundCloud: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

/**
 * A band can have only one streaming-links document.
 */
StreamingLinksSchema.index(
  { band: 1 },
  {
    unique: true,
    partialFilterExpression: {
      band: { $exists: true },
    },
  }
);

/**
 * A member can have only one streaming-links document.
 */
StreamingLinksSchema.index(
  { member: 1 },
  {
    unique: true,
    partialFilterExpression: {
      member: { $exists: true },
    },
  }
);

export const StreamingLinks = mongoose.model<IStreamingLinks>(
  'StreamingLinks',
  StreamingLinksSchema
);