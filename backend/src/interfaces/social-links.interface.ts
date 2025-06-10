import { Types } from 'mongoose';

export interface ISocialLinks {
  _id?: Types.ObjectId;
  band?: Types.ObjectId;
  member?: Types.ObjectId;
  facebook?: string;
  instagram?: string;
  x?: string;
  youtube?: string;
  tiktok?: string;
}
