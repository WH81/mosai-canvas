import { Types } from 'mongoose';

export interface IStreamingPlayers {
  bandId: Types.ObjectId; // Change 'string' to 'Types.ObjectId'
  spotifyUrl?: string;
  appleMusicUrl?: string;
}