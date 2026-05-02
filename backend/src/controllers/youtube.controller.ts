import { Request, Response } from 'express';
import { Band } from '../models/band.model';
import { YouTubeService } from '../services/youtube.service';

export class YouTubeController {
  static async getBandVideos(req: Request, res: Response): Promise<void> {
    try {
      const { bandSlug } = req.params;

      const band = await Band.findOne({ slug: bandSlug });

      if (!band) {
        res.status(404).json({ message: 'Band not found' });
        return;
      }

      if (!band.youtubeChannelId) {
        console.log('❌ Missing YouTube channel ID');
        res.status(400).json({ message: 'Missing YouTube channel ID' });
        return;
      }

      const videos = await YouTubeService.getChannelVideos(
        band.youtubeChannelId
      );

      res.json(videos);
    } catch (err) {
      console.error('🔥 Controller error:', err);
      res.status(500).json({ message: 'Server error' });
    }
  }
}