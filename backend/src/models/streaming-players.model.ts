import mongoose, { Schema } from 'mongoose';
import { IStreamingPlayers } from '../interfaces/streaming-players.interface';

const StreamingPlayersSchema = new Schema<IStreamingPlayers>({
  bandId: { 
    type: Schema.Types.ObjectId, 
    ref: 'Band',
    required: true, 
    unique: true 
  },
  spotifyUrl: { type: String },
  appleMusicUrl: { type: String },
});

export default mongoose.model<IStreamingPlayers>('StreamingPlayers', StreamingPlayersSchema);
