import mongoose, { Schema, Document } from "mongoose";
import { IRingtone } from "../interfaces/ringtone.interface";

export interface IRingtoneModel extends Omit<IRingtone, "_id">, Document {}

const RingtoneSchema: Schema = new Schema(
  {
    songName: { type: String, required: true, trim: true },
    bandName: { type: String, required: true, trim: true },
    thumbnailUrl: { type: String, required: true },
    previewUrl: { type: String, required: true },
    downloadAndroidUrl: { type: String, required: true },
    downloadAppleUrl: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IRingtoneModel>("Ringtone", RingtoneSchema);
