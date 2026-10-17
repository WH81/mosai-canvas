import { Document, Types } from 'mongoose';

export interface IStreamingLinks extends Document {
  band?: Types.ObjectId;
  member?: Types.ObjectId;
  spotify?: string;
  appleMusic?: string;
  soundCloud?: string;
}