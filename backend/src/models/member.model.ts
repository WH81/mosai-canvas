import mongoose, { Schema } from "mongoose";
import { IMember } from "../interfaces/member.interface";

const memberSchema = new Schema<IMember>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    instrument: {
      type: String,
      required: true,
      trim: true,
    },

    band: {
      type: Schema.Types.ObjectId,
      ref: "Band",
      required: true,
      index: true,
    },

    /**
     * Stores the band's slug for efficient member-by-band queries.
     *
     * This is intentionally NOT unique because multiple members
     * belong to the same band.
     */
    bandSlug: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    image: {
      type: String,
      required: true,
      trim: true,
    },

    bio: {
      type: String,
      required: true,
      trim: true,
    },

    socialLinks: {
      type: Schema.Types.ObjectId,
      ref: "SocialLinks",
      required: false,
    },
    
    streamingLinks: {
      type: Schema.Types.ObjectId,
      ref: 'StreamingLinks',
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IMember>(
  "Member",
  memberSchema
);