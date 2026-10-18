import { Request, Response, RequestHandler } from 'express';
import mongoose from 'mongoose';

import { Band } from '../models/band.model';
import { StreamingLinks } from '../models/streaming-links.model';
import { SocialLinks } from '../models/social-links.model';

/*
 * Resolve a band using either:
 *   - MongoDB ObjectId
 *   - band slug
 *
 * GET requests currently support both forms.
 * Write operations use the resolved MongoDB _id.
 */
const findBandByIdOrSlug = async (
  bandIdOrSlug: string
) => {
  if (mongoose.Types.ObjectId.isValid(bandIdOrSlug)) {
    return Band.findById(bandIdOrSlug);
  }

  return Band.findOne({
    slug: bandIdOrSlug,
  });
};

/*
 * Fields allowed when creating/updating a Band.
 *
 * Do not pass req.body directly into Mongoose.
 * Explicitly selecting fields prevents unexpected properties
 * from being written to the database.
 */
const getBandPayload = (
  body: Record<string, unknown>
) => ({
  name: body['name'],
  slug: body['slug'],
  bio: body['bio'],
  image: body['image'],
  bandLogo: body['bandLogo'],
  youtubeChannelId: body['youtubeChannelId'],
});

/*
 * Fields allowed for Social Links.
 */
const getSocialLinksPayload = (
  body: Record<string, unknown>
) => ({
  facebook: body['facebook'],
  instagram: body['instagram'],
  x: body['x'],
  youtube: body['youtube'],
  tiktok: body['tiktok'],
});

/*
 * Fields allowed for Streaming Links.
 */
const getStreamingLinksPayload = (
  body: Record<string, unknown>
) => ({
  spotify: body['spotify'],
  appleMusic: body['appleMusic'],
  soundCloud: body['soundCloud'],
});


// ============================================================
// BAND CRUD
// ============================================================

// POST /api/band
export const createBand: RequestHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const bandPayload = getBandPayload(req.body);

    const band = new Band(bandPayload);
    const savedBand = await band.save();

    res.status(201).json(savedBand);
  } catch (err) {
    console.error('Error creating band:', err);

    if (!res.headersSent) {
      res.status(500).json({
        message: 'Error creating band',
      });
    }
  }
};


// GET /api/band
export const getAllBands: RequestHandler = async (
  _req,
  res
): Promise<void> => {
  try {
    const bands = await Band.find()
      .populate('socialLinks')
      .populate('streamingLinks');

    res.json(bands);
  } catch (err) {
    console.error('Error fetching bands:', err);

    if (!res.headersSent) {
      res.status(500).json({
        message: 'Error fetching bands',
      });
    }
  }
};


// GET /api/band/:slug
export const getBandBySlug: RequestHandler<{
  slug: string;
}> = async (
  req: Request<{ slug: string }>,
  res: Response
): Promise<void> => {
  try {
    const { slug } = req.params;

    /*
     * Populate both related documents so the frontend receives
     * the actual social and streaming link data rather than
     * only their MongoDB ObjectIds.
     */
    const band = await Band.findOne({ slug })
      .populate('socialLinks')
      .populate('streamingLinks');

    if (!band) {
      res.status(404).json({
        message: 'Band not found',
      });

      return;
    }

    res.json(band);
  } catch (err) {
    console.error(
      'Error fetching band:',
      err
    );

    if (!res.headersSent) {
      res.status(500).json({
        message: 'Error fetching band',
      });
    }
  }
};


// PUT /api/band/:id
export const updateBand: RequestHandler<{
  id: string;
}> = async (
  req: Request<{ id: string }>,
  res: Response
): Promise<void> => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400).json({
      message: 'Invalid band ID',
    });

    return;
  }

  try {
    const bandPayload = getBandPayload(req.body);

    const updatedBand = await Band.findByIdAndUpdate(
      id,
      bandPayload,
      {
        new: true,
        runValidators: true,
      }
    )
      .populate('socialLinks')
      .populate('streamingLinks');

    if (!updatedBand) {
      res.status(404).json({
        message: 'Band not found',
      });

      return;
    }

    res.json(updatedBand);
  } catch (err) {
    console.error(
      'Error updating band:',
      err
    );

    if (!res.headersSent) {
      res.status(500).json({
        message: 'Error updating band',
      });
    }
  }
};


// DELETE /api/band/:id
export const deleteBand: RequestHandler<{
  id: string;
}> = async (
  req: Request<{ id: string }>,
  res: Response
): Promise<void> => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400).json({
      message: 'Invalid band ID',
    });

    return;
  }

  try {
    const deletedBand = await Band.findByIdAndDelete(id);

    if (!deletedBand) {
      res.status(404).json({
        message: 'Band not found',
      });

      return;
    }

    /*
     * Remove associated links so orphaned documents
     * aren't left behind.
     */
    await SocialLinks.deleteOne({
      band: deletedBand._id,
    });

    await StreamingLinks.deleteOne({
      band: deletedBand._id,
    });

    res.status(204).send();
  } catch (err) {
    console.error(
      'Error deleting band:',
      err
    );

    if (!res.headersSent) {
      res.status(500).json({
        message: 'Error deleting band',
      });
    }
  }
};


// ============================================================
// SOCIAL LINKS FOR BAND
// ============================================================


// GET /api/band/:bandId/social-links
export const getSocialLinksByBand: RequestHandler<{
  bandId: string;
}> = async (
  req: Request<{ bandId: string }>,
  res: Response
): Promise<void> => {
  const { bandId } = req.params;

  try {
    const band = await findBandByIdOrSlug(
      bandId
    );

    if (!band) {
      res.status(404).json({
        message: 'Band not found',
      });

      return;
    }

    const socialLinks = await SocialLinks.findOne({
      band: band._id,
    });

    if (!socialLinks) {
      /*
       * Return the same shape expected by the frontend.
       */
      res.json({
        facebook: '',
        instagram: '',
        x: '',
        youtube: '',
        tiktok: '',
      });

      return;
    }

    res.json(socialLinks);
  } catch (err) {
    console.error(
      'Error fetching social links:',
      err
    );

    if (!res.headersSent) {
      res.status(500).json({
        message: 'Error fetching social links',
      });
    }
  }
};


// POST /api/band/:bandId/social-links
export const createSocialLinksForBand: RequestHandler<{
  bandId: string;
}> = async (
  req: Request<{ bandId: string }>,
  res: Response
): Promise<void> => {
  const { bandId } = req.params;

  try {
    const band = await findBandByIdOrSlug(
      bandId
    );

    if (!band) {
      res.status(404).json({
        message: 'Band not found',
      });

      return;
    }

    const existing = await SocialLinks.findOne({
      band: band._id,
    });

    if (existing) {
      res.status(409).json({
        message:
          'Social links already exist for this band, use PUT to update',
      });

      return;
    }

    const socialLinks = new SocialLinks({
      ...getSocialLinksPayload(req.body),
      band: band._id,
    });

    const savedLinks = await socialLinks.save();

    /*
     * Keep the Band -> SocialLinks reference synchronized.
     */
    await Band.findByIdAndUpdate(
      band._id,
      {
        $set: {
          socialLinks: savedLinks._id,
        },
      },
      {
        runValidators: true,
      }
    );

    res.status(201).json(savedLinks);
  } catch (err) {
    console.error(
      'Error creating social links:',
      err
    );

    if (!res.headersSent) {
      res.status(500).json({
        message: 'Error creating social links',
      });
    }
  }
};


// PUT /api/band/:bandId/social-links
export const updateSocialLinksForBand: RequestHandler<{
  bandId: string;
}> = async (
  req: Request<{ bandId: string }>,
  res: Response
): Promise<void> => {
  const { bandId } = req.params;

  try {
    const band = await findBandByIdOrSlug(
      bandId
    );

    if (!band) {
      res.status(404).json({
        message: 'Band not found',
      });

      return;
    }

    const socialLinks = await SocialLinks.findOneAndUpdate(
      {
        band: band._id,
      },
      getSocialLinksPayload(req.body),
      {
        new: true,
        runValidators: true,
      }
    );

    if (!socialLinks) {
      res.status(404).json({
        message: 'Social links not found for this band',
      });

      return;
    }

    /*
     * Repair the Band reference if it is missing or points
     * to a different SocialLinks document.
     */
    if (
      !band.socialLinks ||
      !band.socialLinks.equals(
        socialLinks._id
      )
    ) {
      await Band.findByIdAndUpdate(
        band._id,
        {
          $set: {
            socialLinks: socialLinks._id,
          },
        },
        {
          runValidators: true,
        }
      );
    }

    res.json(socialLinks);
  } catch (err) {
    console.error(
      'Error updating social links:',
      err
    );

    if (!res.headersSent) {
      res.status(500).json({
        message: 'Error updating social links',
      });
    }
  }
};


// DELETE /api/band/:bandId/social-links
export const deleteSocialLinksForBand: RequestHandler<{
  bandId: string;
}> = async (
  req: Request<{ bandId: string }>,
  res: Response
): Promise<void> => {
  const { bandId } = req.params;

  try {
    const band = await findBandByIdOrSlug(
      bandId
    );

    if (!band) {
      res.status(404).json({
        message: 'Band not found',
      });

      return;
    }

    const deleted = await SocialLinks.findOneAndDelete({
      band: band._id,
    });

    if (!deleted) {
      res.status(404).json({
        message: 'Social links not found for this band',
      });

      return;
    }

    /*
     * Remove the Band -> SocialLinks reference after
     * successfully deleting the SocialLinks document.
     */
    await Band.findByIdAndUpdate(
      band._id,
      {
        $unset: {
          socialLinks: 1,
        },
      }
    );

    res.status(204).send();
  } catch (err) {
    console.error(
      'Error deleting social links:',
      err
    );

    if (!res.headersSent) {
      res.status(500).json({
        message: 'Error deleting social links',
      });
    }
  }
};


// ============================================================
// STREAMING LINKS FOR BAND
// ============================================================


// GET /api/band/:bandId/streaming-links
export const getStreamingLinksByBand: RequestHandler<{
  bandId: string;
}> = async (
  req: Request<{ bandId: string }>,
  res: Response
): Promise<void> => {
  const { bandId } = req.params;

  try {
    const band = await findBandByIdOrSlug(
      bandId
    );

    if (!band) {
      res.status(404).json({
        message: 'Band not found',
      });

      return;
    }

    const streamingLinks =
      await StreamingLinks.findOne({
        band: band._id,
      });

    if (!streamingLinks) {
      res.json({
        spotify: '',
        appleMusic: '',
        soundCloud: '',
      });

      return;
    }

    res.json(streamingLinks);
  } catch (err) {
    console.error(
      'Error fetching streaming links:',
      err
    );

    if (!res.headersSent) {
      res.status(500).json({
        message: 'Error fetching streaming links',
      });
    }
  }
};


// POST /api/band/:bandId/streaming-links
export const createStreamingLinksForBand: RequestHandler<{
  bandId: string;
}> = async (
  req: Request<{ bandId: string }>,
  res: Response
): Promise<void> => {
  const { bandId } = req.params;

  try {
    const band = await findBandByIdOrSlug(
      bandId
    );

    if (!band) {
      res.status(404).json({
        message: 'Band not found',
      });

      return;
    }

    const existing =
      await StreamingLinks.findOne({
        band: band._id,
      });

    if (existing) {
      res.status(409).json({
        message:
          'Streaming links already exist for this band, use PUT to update',
      });

      return;
    }

    const streamingLinks =
      new StreamingLinks({
        ...getStreamingLinksPayload(req.body),
        band: band._id,
      });

    const savedLinks =
      await streamingLinks.save();

    /*
     * Keep the Band -> StreamingLinks reference synchronized.
     */
    await Band.findByIdAndUpdate(
      band._id,
      {
        $set: {
          streamingLinks: savedLinks._id,
        },
      },
      {
        runValidators: true,
      }
    );

    res.status(201).json(savedLinks);
  } catch (err) {
    console.error(
      'Error creating streaming links:',
      err
    );

    if (!res.headersSent) {
      res.status(500).json({
        message: 'Error creating streaming links',
      });
    }
  }
};


// PUT /api/band/:bandId/streaming-links
export const updateStreamingLinksForBand: RequestHandler<{
  bandId: string;
}> = async (
  req: Request<{ bandId: string }>,
  res: Response
): Promise<void> => {
  const { bandId } = req.params;

  try {
    const band = await findBandByIdOrSlug(
      bandId
    );

    if (!band) {
      res.status(404).json({
        message: 'Band not found',
      });

      return;
    }

    const streamingLinks =
      await StreamingLinks.findOneAndUpdate(
        {
          band: band._id,
        },
        getStreamingLinksPayload(req.body),
        {
          new: true,
          runValidators: true,
        }
      );

    if (!streamingLinks) {
      res.status(404).json({
        message:
          'Streaming links not found for this band',
      });

      return;
    }

    /*
     * Repair the Band reference if it is missing or
     * points to a different StreamingLinks document.
     */
    if (
      !band.streamingLinks ||
      !band.streamingLinks.equals(
        streamingLinks._id
      )
    ) {
      await Band.findByIdAndUpdate(
        band._id,
        {
          $set: {
            streamingLinks:
              streamingLinks._id,
          },
        },
        {
          runValidators: true,
        }
      );
    }

    res.json(streamingLinks);
  } catch (err) {
    console.error(
      'Error updating streaming links:',
      err
    );

    if (!res.headersSent) {
      res.status(500).json({
        message:
          'Error updating streaming links',
      });
    }
  }
};


// DELETE /api/band/:bandId/streaming-links
export const deleteStreamingLinksForBand: RequestHandler<{
  bandId: string;
}> = async (
  req: Request<{ bandId: string }>,
  res: Response
): Promise<void> => {
  const { bandId } = req.params;

  try {
    const band = await findBandByIdOrSlug(
      bandId
    );

    if (!band) {
      res.status(404).json({
        message: 'Band not found',
      });

      return;
    }

    const deleted =
      await StreamingLinks.findOneAndDelete({
        band: band._id,
      });

    if (!deleted) {
      res.status(404).json({
        message:
          'Streaming links not found for this band',
      });

      return;
    }

    /*
     * Remove the Band -> StreamingLinks reference
     * after successfully deleting the document.
     */
    await Band.findByIdAndUpdate(
      band._id,
      {
        $unset: {
          streamingLinks: 1,
        },
      }
    );

    res.status(204).send();
  } catch (err) {
    console.error(
      'Error deleting streaming links:',
      err
    );

    if (!res.headersSent) {
      res.status(500).json({
        message:
          'Error deleting streaming links',
      });
    }
  }
};