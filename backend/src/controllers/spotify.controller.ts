import { Request, Response } from 'express';
import { Types } from 'mongoose';
import StreamingPlayers from '../models/streaming-players.model';
import {
  getArtistTopTracks,
  getArtistDiscography,
  getArtistProfile,
  searchArtistId,
} from '../services/spotify.service';
 
// ─── Helpers ──────────────────────────────────────────────────────────────────
 
/**
 * Resolves the Spotify Artist ID for a band.
 * Priority: stored spotifyArtistId → parse from spotifyUrl → search by band name.
 */
async function resolveArtistId(bandId: string, bandName?: string): Promise<string | null> {
  const player = await StreamingPlayers.findOne({
    bandId: new Types.ObjectId(bandId),
  })
    .lean()
    .exec();
 
  if (!player) return null;
 
  // 1. Use stored artist ID (best case)
  if (player.spotifyArtistId) {
    return player.spotifyArtistId;
  }
 
  // 2. Parse artist ID from stored Spotify URL
  if (player.spotifyUrl) {
    const match = player.spotifyUrl.match(/artist\/([A-Za-z0-9]{22})/);

    if (match) return match[1] ?? null;
  }
 
  // 3. Fallback: search by band name
  if (bandName) {
    const foundId = await searchArtistId(bandName);
    if (foundId) {
      // Persist the found ID so we don't search on every request
      await StreamingPlayers.findOneAndUpdate(
        { bandId: new Types.ObjectId(bandId) },
        { $set: { spotifyArtistId: foundId } }
      ).exec();
      return foundId;
    }
  }
 
  return null;
}
 
// ─── Controllers ─────────────────────────────────────────────────────────────
 
/**
 * GET /api/spotify/top-tracks/:bandId
 * Returns up to 10 top tracks for the band's linked Spotify artist.
 * Optional query param: ?market=US (defaults to US)
 */
export const getTopTracks = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { bandId } = req.params;
    const market = typeof req.query.market === 'string' ? req.query.market.toUpperCase() : 'US';
    const bandName = typeof req.query.bandName === 'string' ? req.query.bandName : undefined;
 
    if (!bandId || !Types.ObjectId.isValid(bandId)) {
      return res.status(400).json({ message: 'Invalid or missing bandId' });
    }
 
    const artistId = await resolveArtistId(bandId, bandName);
    if (!artistId) {
      return res.status(404).json({
        message: 'No Spotify artist linked to this band. Add a spotifyArtistId to their StreamingPlayers record.',
      });
    }
 
    const tracks = await getArtistTopTracks(artistId, market);
    return res.status(200).json({ artistId, tracks });
  } catch (err: any) {
    console.error('[Spotify] getTopTracks error:', err?.response?.data ?? err.message);
    return res.status(502).json({ message: 'Failed to fetch tracks from Spotify' });
  }
};
 
/**
 * GET /api/spotify/discography/:bandId
 * Returns all albums + singles with their track lists, sorted newest first.
 * Optional query param: ?market=US
 */
export const getDiscography = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { bandId } = req.params;
    const market = typeof req.query.market === 'string' ? req.query.market.toUpperCase() : 'US';
    const bandName = typeof req.query.bandName === 'string' ? req.query.bandName : undefined;
 
    if (!bandId || !Types.ObjectId.isValid(bandId)) {
      return res.status(400).json({ message: 'Invalid or missing bandId' });
    }
 
    const artistId = await resolveArtistId(bandId, bandName);
    if (!artistId) {
      return res.status(404).json({
        message: 'No Spotify artist linked to this band. Add a spotifyArtistId to their StreamingPlayers record.',
      });
    }
 
    const discography = await getArtistDiscography(artistId, market);
    return res.status(200).json({ artistId, discography });
  } catch (err: any) {
    console.error('[Spotify] getDiscography error:', err?.response?.data ?? err.message);
    return res.status(502).json({ message: 'Failed to fetch discography from Spotify' });
  }
};
 
/**
 * GET /api/spotify/profile/:bandId
 * Returns the Spotify artist profile (name, image, followers, genres).
 */
export const getProfile = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { bandId } = req.params;
    const bandName = typeof req.query.bandName === 'string' ? req.query.bandName : undefined;
 
    if (!bandId || !Types.ObjectId.isValid(bandId)) {
      return res.status(400).json({ message: 'Invalid or missing bandId' });
    }
 
    const artistId = await resolveArtistId(bandId, bandName);
    if (!artistId) {
      return res.status(404).json({
        message: 'No Spotify artist linked to this band.',
      });
    }
 
    const profile = await getArtistProfile(artistId);
    return res.status(200).json(profile);
  } catch (err: any) {
    console.error('[Spotify] getProfile error:', err?.response?.data ?? err.message);
    return res.status(502).json({ message: 'Failed to fetch artist profile from Spotify' });
  }
};
