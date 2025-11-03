// src/controllers/streaming-players.controller.ts
import { Request, Response } from 'express';
import StreamingPlayers from '../models/streaming-players.model';
import { Band } from '../models/band.model';
import { Types } from 'mongoose';

/**
 * GET /api/streaming-players
 * Optional query param: bandId
 */
export const getStreamingPlayers = async (req: Request, res: Response) => {
  try {
    const { bandId } = req.query;
    const query: any = {};

    if (bandId && typeof bandId === 'string') {
      if (!Types.ObjectId.isValid(bandId)) {
        return res.status(400).json({ message: 'Invalid bandId' });
      }
      query.bandId = new Types.ObjectId(bandId);
    }

    const players = await StreamingPlayers.find(query).lean().exec();
    return res.status(200).json(players);
  } catch (err) {
    console.error('Error fetching streaming players:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

/**
 * POST /api/streaming-players
 * Upsert: creates or updates the single streaming players doc for a band.
 */
export const upsertStreamingPlayer = async (req: Request, res: Response) => {
  try {
    const { spotifyUrl, appleMusicUrl, bandId } = req.body;

    if (!bandId || !Types.ObjectId.isValid(bandId)) {
      return res.status(400).json({ message: 'Invalid or missing bandId' });
    }

    const bandObjectId = new Types.ObjectId(bandId);

    const updatedOrCreatedPlayer = await StreamingPlayers.findOneAndUpdate(
      { bandId: bandObjectId },
      { $set: { bandId: bandObjectId, spotifyUrl: spotifyUrl || undefined, appleMusicUrl: appleMusicUrl || undefined } },
      {
        new: true,
        upsert: true,
        runValidators: true,
        setDefaultsOnInsert: true
      }
    ).lean().exec();

    // findOneAndUpdate with upsert + new may return the doc. If using older mongoose that returned raw result,
    // fetch it explicitly to be safe.
    let playerDoc = updatedOrCreatedPlayer;
    if (!playerDoc) {
      // fallback: fetch it
      const playerDoc = await StreamingPlayers.findOne({ bandId: bandObjectId }).lean().exec();

      if (!playerDoc) {
        return res.status(404).json({ message: 'Streaming player not found' });
      }
    }

    // Ensure the Band document references this streaming players doc.
    if (playerDoc && playerDoc._id) {
      await Band.findByIdAndUpdate(bandObjectId, { streamingPlayers: playerDoc._id }).exec();
    }

    return res.status(200).json(playerDoc);
  } catch (err) {
    console.error('Error upserting streaming player:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

/**
 * PUT /api/streaming-players/:id
 */
export const updateStreamingPlayerById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { spotifyUrl, appleMusicUrl } = req.body;

    if (!id || !Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid player ID' });
    }

    const updatedPlayer = await StreamingPlayers.findByIdAndUpdate(
      id,
      { $set: { spotifyUrl: spotifyUrl || undefined, appleMusicUrl: appleMusicUrl || undefined } },
      { new: true, runValidators: true }
    ).lean().exec();

    if (!updatedPlayer) {
      return res.status(404).json({ message: 'Streaming player not found' });
    }

    // Keep Band reference consistent (safe-guard)
    if (updatedPlayer.bandId) {
      await Band.findByIdAndUpdate(updatedPlayer.bandId, { streamingPlayers: updatedPlayer._id }).exec();
    }

    return res.status(200).json(updatedPlayer);
  } catch (err) {
    console.error('Error updating streaming player:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

/**
 * DELETE /api/streaming-players/:id
 */
export const deleteStreamingPlayerById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id || !Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid player ID' });
    }

    const deletedPlayer = await StreamingPlayers.findByIdAndDelete(id).lean().exec();

    if (!deletedPlayer) {
      return res.status(404).json({ message: 'Streaming player not found' });
    }

    // Remove the reference to the deleted player from the corresponding Band document.
    if (deletedPlayer.bandId) {
      await Band.findByIdAndUpdate(deletedPlayer.bandId, { $unset: { streamingPlayers: '' } }).exec();
    }

    return res.status(200).json({ message: 'Streaming player deleted successfully' });
  } catch (err) {
    console.error('Error deleting streaming player:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};
