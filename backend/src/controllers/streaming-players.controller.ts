import { Request, Response } from 'express';
import StreamingPlayers from '../models/streaming-players.model';
import { Band } from '../models/band.model';
import { Types } from 'mongoose';
 
/**
 * GET /api/streaming-players
 * Optional query param: ?bandId=<objectId>
 */
export const getStreamingPlayers = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { bandId } = req.query;
    const query: Record<string, unknown> = {};
 
    if (bandId && typeof bandId === 'string') {
      if (!Types.ObjectId.isValid(bandId)) {
        return res.status(400).json({ message: 'Invalid bandId' });
      }
      query.bandId = new Types.ObjectId(bandId);
    }
 
    const players = await StreamingPlayers.find(query).lean().exec();
    return res.status(200).json(players);
  } catch (err) {
    console.error('[StreamingPlayers] getStreamingPlayers error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};
 
/**
 * POST /api/streaming-players
 * Upsert: creates or updates the streaming players doc for a band.
 * Accepts: bandId, spotifyArtistId, spotifyUrl, appleMusicUrl
 */
export const upsertStreamingPlayer = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { spotifyArtistId, spotifyUrl, appleMusicUrl, bandId } = req.body;
 
    if (!bandId || !Types.ObjectId.isValid(bandId)) {
      return res.status(400).json({ message: 'Invalid or missing bandId' });
    }
 
    const bandObjectId = new Types.ObjectId(bandId);
 
    // Build update payload — only include defined fields
    const updateFields: Record<string, unknown> = { bandId: bandObjectId };
    if (spotifyArtistId !== undefined) updateFields.spotifyArtistId = spotifyArtistId || undefined;
    if (spotifyUrl !== undefined) updateFields.spotifyUrl = spotifyUrl || undefined;
    if (appleMusicUrl !== undefined) updateFields.appleMusicUrl = appleMusicUrl || undefined;
 
    const playerDoc = await StreamingPlayers.findOneAndUpdate(
      { bandId: bandObjectId },
      { $set: updateFields },
      {
        new: true,
        upsert: true,
        runValidators: true,
        setDefaultsOnInsert: true,
      }
    )
      .lean()
      .exec();
 
    // BUG FIX: previous code had a scoped re-declaration of playerDoc in the
    // fallback block that silently shadowed the outer variable, meaning the
    // Band reference update below was never reached. Fixed by using a single
    // variable throughout.
    if (!playerDoc) {
      return res.status(404).json({ message: 'Streaming player not found after upsert' });
    }
 
    // Keep the Band document's streamingPlayers reference in sync
    if (playerDoc._id) {
      await Band.findByIdAndUpdate(bandObjectId, {
        streamingPlayers: playerDoc._id,
      }).exec();
    }
 
    return res.status(200).json(playerDoc);
  } catch (err) {
    console.error('[StreamingPlayers] upsertStreamingPlayer error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};
 
/**
 * PUT /api/streaming-players/:id
 * Update by StreamingPlayers document ID.
 */
export const updateStreamingPlayerById = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    const { spotifyArtistId, spotifyUrl, appleMusicUrl } = req.body;
 
    if (!id || !Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid player ID' });
    }
 
    const updateFields: Record<string, unknown> = {};
    if (spotifyArtistId !== undefined) updateFields.spotifyArtistId = spotifyArtistId || undefined;
    if (spotifyUrl !== undefined) updateFields.spotifyUrl = spotifyUrl || undefined;
    if (appleMusicUrl !== undefined) updateFields.appleMusicUrl = appleMusicUrl || undefined;
 
    if (Object.keys(updateFields).length === 0) {
      return res.status(400).json({ message: 'No valid fields provided for update' });
    }
 
    const updatedPlayer = await StreamingPlayers.findByIdAndUpdate(
      id,
      { $set: updateFields },
      { new: true, runValidators: true }
    )
      .lean()
      .exec();
 
    if (!updatedPlayer) {
      return res.status(404).json({ message: 'Streaming player not found' });
    }
 
    // Keep Band reference consistent
    if (updatedPlayer.bandId) {
      await Band.findByIdAndUpdate(updatedPlayer.bandId, {
        streamingPlayers: updatedPlayer._id,
      }).exec();
    }
 
    return res.status(200).json(updatedPlayer);
  } catch (err) {
    console.error('[StreamingPlayers] updateStreamingPlayerById error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};
 
/**
 * DELETE /api/streaming-players/:id
 */
export const deleteStreamingPlayerById = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
 
    if (!id || !Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid player ID' });
    }
 
    const deletedPlayer = await StreamingPlayers.findByIdAndDelete(id).lean().exec();
 
    if (!deletedPlayer) {
      return res.status(404).json({ message: 'Streaming player not found' });
    }
 
    // Remove the reference from the Band document
    if (deletedPlayer.bandId) {
      await Band.findByIdAndUpdate(deletedPlayer.bandId, {
        $unset: { streamingPlayers: '' },
      }).exec();
    }
 
    return res.status(200).json({ message: 'Streaming player deleted successfully' });
  } catch (err) {
    console.error('[StreamingPlayers] deleteStreamingPlayerById error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};
