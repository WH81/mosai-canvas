import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import slugify from 'slugify';

import Member from '../models/member.model';
import { Band } from '../models/band.model';

import {
  createSocialLinksForMember,
  updateSocialLinksForMember,
} from '../services/social-links.service';

import {
  createStreamingLinksForMember,
  updateStreamingLinksForMember,
} from '../services/streaming-links.service';

// ============================================================
// TYPES
// ============================================================

interface SocialLinksPayload {
  facebook?: string;
  instagram?: string;
  x?: string;
  youtube?: string;
  tiktok?: string;
}

interface StreamingLinksPayload {
  spotify?: string;
  appleMusic?: string;
  soundCloud?: string;
}

interface MemberRequestBody {
  name: string;
  instrument: string;
  band: string;
  image: string;
  bio: string;
  socialLinks?: SocialLinksPayload;
  streamingLinks?: StreamingLinksPayload;
}

interface BandSlugParams {
  bandSlug: string;
}

// ============================================================
// HELPERS
// ============================================================

/**
 * Validates a MongoDB ObjectId.
 *
 * Returns false instead of throwing so controllers can return
 * a proper 400 Bad Request response.
 */
const isValidObjectId = (id: string): boolean =>
  mongoose.Types.ObjectId.isValid(id);

/**
 * Converts a band's name into a fallback slug.
 *
 * The database slug is preferred whenever it exists.
 */
const getBandSlug = (band: {
  slug?: string;
  name: string;
}): string =>
  band.slug ||
  slugify(band.name, {
    lower: true,
    strict: true,
  });

/**
 * Validates the basic member fields.
 *
 * This controller intentionally performs lightweight validation.
 * Detailed URL validation for social/streaming links belongs to
 * the dedicated validation middleware/services.
 */
const validateMemberBody = (
  body: Partial<MemberRequestBody>
): string | null => {
  if (
    typeof body.name !== 'string' ||
    body.name.trim().length === 0
  ) {
    return 'Member name is required.';
  }

  if (
    typeof body.instrument !== 'string' ||
    body.instrument.trim().length === 0
  ) {
    return 'Member instrument is required.';
  }

  if (
    typeof body.band !== 'string' ||
    body.band.trim().length === 0
  ) {
    return 'Band ID is required.';
  }

  if (
    typeof body.image !== 'string' ||
    body.image.trim().length === 0
  ) {
    return 'Member image is required.';
  }

  if (
    typeof body.bio !== 'string' ||
    body.bio.trim().length === 0
  ) {
    return 'Member bio is required.';
  }

  return null;
};

/**
 * Creates the fields that are allowed to be written to a Member.
 *
 * Do not spread req.body directly into a Mongoose document.
 * Explicitly selecting fields prevents clients from attempting
 * to modify protected/internal properties.
 */
const getMemberPayload = (
  body: MemberRequestBody,
  band: {
    _id: mongoose.Types.ObjectId;
    name: string;
    slug?: string;
  }
) => ({
  name: body.name.trim(),
  instrument: body.instrument.trim(),
  band: band._id,
  bandSlug: getBandSlug(band),
  image: body.image.trim(),
  bio: body.bio.trim(),
});

/**
 * Returns a fully populated member.
 */
const getPopulatedMember = async (
  memberId: mongoose.Types.ObjectId | string
) =>
  Member.findById(memberId)
    .populate('band', 'name slug')
    .populate('socialLinks')
    .populate('streamingLinks');

// ============================================================
// GET MEMBERS BY BAND
// ============================================================

export const getMembersByBand = async (
  req: Request<BandSlugParams>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { bandSlug } = req.params;

    if (!bandSlug || bandSlug.trim().length === 0) {
      res.status(400).json({
        message: 'Band slug is required.',
      });

      return;
    }

    const members = await Member.find({
      bandSlug: bandSlug.trim(),
    })
      .populate('band', 'name slug')
      .populate('socialLinks')
      .populate('streamingLinks')
      .lean();

    /*
     * Preserve the existing public API behavior where the
     * `band` property returned by this endpoint is the band name.
     */
    const simplifiedMembers = members.map((member) => {
      const populatedBand = member.band as unknown as
        | {
            _id: mongoose.Types.ObjectId;
            name: string;
            slug: string;
          }
        | null;

      return {
        ...member,
        band:
          populatedBand &&
          typeof populatedBand === 'object'
            ? populatedBand.name
            : member.band,
      };
    });

    res.status(200).json(simplifiedMembers);
  } catch (error) {
    next(error);
  }
};

// ============================================================
// GET MEMBER BY ID
// ============================================================

export const getMemberById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { id } = req.params;

  if (!id) {
    res.status(400).json({
      message: 'Member ID is required.',
    });

    return;
  }

  // CodeQL safe: explicitly cast and validate string ID primitive
  const memberId = String(id);

  if (!isValidObjectId(memberId)) {
    res.status(400).json({
      message: 'Invalid member ID.',
    });

    return;
  }

  try {
    const member = await getPopulatedMember(memberId);

    if (!member) {
      res.status(404).json({
        message: 'Member not found.',
      });

      return;
    }

    res.status(200).json(member);
  } catch (error) {
    next(error);
  }
};

// ============================================================
// CREATE MEMBER
// ============================================================

export const createMember = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const body = req.body as Partial<MemberRequestBody>;

  const validationError = validateMemberBody(body);

  if (validationError) {
    res.status(400).json({
      message: validationError,
    });

    return;
  }

  if (!isValidObjectId(body.band!)) {
    res.status(400).json({
      message: 'Invalid band ID.',
    });

    return;
  }

  try {
    const band = await Band.findById(body.band!);

    if (!band) {
      res.status(404).json({
        message: 'Band not found.',
      });

      return;
    }

    const memberBody = body as MemberRequestBody;

    const member = new Member(
      getMemberPayload(memberBody, band)
    );

    const savedMember = await member.save();

    /*
     * Create related social links through the service layer.
     * This keeps link creation logic centralized.
     */
    if (memberBody.socialLinks) {
      const socialLinks =
        await createSocialLinksForMember(
          savedMember._id.toString(),
          memberBody.socialLinks
        );

      savedMember.socialLinks = socialLinks._id;
    }

    /*
     * Create related streaming links through the service layer.
     */
    if (memberBody.streamingLinks) {
      const streamingLinks =
        await createStreamingLinksForMember(
          savedMember._id.toString(),
          memberBody.streamingLinks
        );

      savedMember.streamingLinks =
        streamingLinks._id;
    }

    /*
     * Save the references to the related documents.
     */
    await savedMember.save();

    const populatedMember =
      await getPopulatedMember(savedMember._id);

    res.status(201).json(populatedMember);
  } catch (error) {
    next(error);
  }
};

// ============================================================
// CREATE MEMBERS BATCH
// ============================================================

export const createMembersBatch = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  if (!Array.isArray(req.body)) {
    res.status(400).json({
      message: 'Request body must be an array of members.',
    });

    return;
  }

  const members =
    req.body as Partial<MemberRequestBody>[];

  try {
    const createdMembers = [];

    for (const memberData of members) {
      /*
       * Validate each member independently.
       *
       * The existing API behavior is preserved: invalid entries
       * are skipped rather than causing the entire batch to fail.
       */
      const validationError =
        validateMemberBody(memberData);

      if (validationError) {
        continue;
      }

      if (!isValidObjectId(memberData.band!)) {
        continue;
      }

      const band = await Band.findById(
        memberData.band!
      );

      if (!band) {
        continue;
      }

      const memberBody =
        memberData as MemberRequestBody;

      const member = new Member(
        getMemberPayload(memberBody, band)
      );

      const savedMember = await member.save();

      // --------------------------------------------------------
      // Social Links
      // --------------------------------------------------------

      if (memberBody.socialLinks) {
        const socialLinks =
          await createSocialLinksForMember(
            savedMember._id.toString(),
            memberBody.socialLinks
          );

        savedMember.socialLinks =
          socialLinks._id;
      }

      // --------------------------------------------------------
      // Streaming Links
      // --------------------------------------------------------

      if (memberBody.streamingLinks) {
        const streamingLinks =
          await createStreamingLinksForMember(
            savedMember._id.toString(),
            memberBody.streamingLinks
          );

        savedMember.streamingLinks =
          streamingLinks._id;
      }

      await savedMember.save();

      const populatedMember =
        await getPopulatedMember(savedMember._id);

      createdMembers.push(populatedMember);
    }

    res.status(201).json(createdMembers);
  } catch (error) {
    next(error);
  }
};

// ============================================================
// UPDATE MEMBER
// ============================================================

export const updateMember = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { id } = req.params;
  const body = req.body as Partial<MemberRequestBody>;

  // ----------------------------------------------------------
  // Validate Member ID
  // ----------------------------------------------------------

  if (!id) {
    res.status(400).json({
      message: 'Member ID is required.',
    });

    return;
  }

  // CodeQL safe: explicitly cast and validate string ID primitive
  const memberId = String(id);

  if (!isValidObjectId(memberId)) {
    res.status(400).json({
      message: 'Invalid member ID.',
    });

    return;
  }

  // ----------------------------------------------------------
  // Validate Request Body
  // ----------------------------------------------------------

  const validationError = validateMemberBody(body);

  if (validationError) {
    res.status(400).json({
      message: validationError,
    });

    return;
  }

  if (!isValidObjectId(body.band!)) {
    res.status(400).json({
      message: 'Invalid band ID.',
    });

    return;
  }

  try {
    // --------------------------------------------------------
    // Verify Band
    // --------------------------------------------------------

    const band = await Band.findById(body.band!);

    if (!band) {
      res.status(404).json({
        message: 'Band not found.',
      });

      return;
    }

    // --------------------------------------------------------
    // Find Member
    // --------------------------------------------------------

    const member = await Member.findById(memberId);

    if (!member) {
      res.status(404).json({
        message: 'Member not found.',
      });

      return;
    }

    const memberBody =
      body as MemberRequestBody;

    // --------------------------------------------------------
    // Update Allowed Member Fields
    // --------------------------------------------------------

    const memberPayload =
      getMemberPayload(memberBody, band);

    member.set(memberPayload);

    await member.save();

    // --------------------------------------------------------
    // Social Links
    // --------------------------------------------------------

    if (memberBody.socialLinks) {
      if (member.socialLinks) {
        await updateSocialLinksForMember(
          member._id.toString(),
          memberBody.socialLinks
        );
      } else {
        const socialLinks =
          await createSocialLinksForMember(
            member._id.toString(),
            memberBody.socialLinks
          );

        member.socialLinks =
          socialLinks._id;

        await member.save();
      }
    }

    // --------------------------------------------------------
    // Streaming Links
    // --------------------------------------------------------

    if (memberBody.streamingLinks) {
      if (member.streamingLinks) {
        await updateStreamingLinksForMember(
          member._id.toString(),
          memberBody.streamingLinks
        );
      } else {
        const streamingLinks =
          await createStreamingLinksForMember(
            member._id.toString(),
            memberBody.streamingLinks
          );

        member.streamingLinks =
          streamingLinks._id;

        await member.save();
      }
    }

    // --------------------------------------------------------
    // Return Updated Member
    // --------------------------------------------------------

    const populatedMember =
      await getPopulatedMember(member._id);

    res.status(200).json(populatedMember);
  } catch (error) {
    next(error);
  }
};

// ============================================================
// DELETE MEMBER
// ============================================================

export const deleteMember = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { id } = req.params;

  // ----------------------------------------------------------
  // Validate Member ID
  // ----------------------------------------------------------

  if (!id) {
    res.status(400).json({
      message: 'Member ID is required.',
    });

    return;
  }

  // CodeQL safe: explicitly cast and validate string ID primitive
  const memberId = String(id);

  if (!isValidObjectId(memberId)) {
    res.status(400).json({
      message: 'Invalid member ID.',
    });

    return;
  }

  try {
    // --------------------------------------------------------
    // Find Member
    // --------------------------------------------------------

    const deletedMember =
      await Member.findByIdAndDelete(memberId);

    if (!deletedMember) {
      res.status(404).json({
        message: 'Member not found.',
      });

      return;
    }

    // --------------------------------------------------------
    // Delete Associated Social/Streaming Links
    // --------------------------------------------------------

    /*
     * These models are intentionally imported here so this
     * controller does not need to maintain additional model
     * imports when the rest of the controller is loaded.
     */

    const { SocialLinks } =
      await import('../models/social-links.model');

    const { StreamingLinks } =
      await import('../models/streaming-links.model');

    await Promise.all([
      SocialLinks.deleteOne({
        member: deletedMember._id,
      }),

      StreamingLinks.deleteOne({
        member: deletedMember._id,
      }),
    ]);

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};