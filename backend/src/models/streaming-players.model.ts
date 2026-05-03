import mongoose, { Schema } from 'mongoose';
import { IStreamingPlayers } from '../interfaces/streaming-players.interface';
 
const StreamingPlayersSchema = new Schema<IStreamingPlayers>(
  {
    bandId: {
      type: Schema.Types.ObjectId,
      ref: 'Band',
      required: true,
      unique: true,
      index: true,
    },
 
    /**
     * Spotify Artist ID — the primary field for the Spotify integration.
     * Example: "2niqXXwMFNGb7WerlhtwCL"
     * Validated to be a 22-character alphanumeric Spotify ID format.
     */
    spotifyArtistId: {
      type: String,
      trim: true,
      validate: {
        validator: (v: string) => /^[A-Za-z0-9]{22}$/.test(v),
        message: 'spotifyArtistId must be a valid 22-character Spotify ID',
      },
    },
 
    /** Full Spotify artist URL — retained for deep linking */
    spotifyUrl: {
      type: String,
      trim: true,
      validate: {
        validator: (v: string) => !v || v.startsWith('https://open.spotify.com/'),
        message: 'spotifyUrl must be a valid Spotify URL',
      },
    },
 
    /** Apple Music URL */
    appleMusicUrl: {
      type: String,
      trim: true,
      validate: {
        validator: (v: string) => !v || v.startsWith('https://music.apple.com/'),
        message: 'appleMusicUrl must be a valid Apple Music URL',
      },
    },
  },
  { timestamps: true }
);
 
export default mongoose.model<IStreamingPlayers>('StreamingPlayers', StreamingPlayersSchema);
 