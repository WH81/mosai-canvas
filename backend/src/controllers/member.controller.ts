import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import slugify from 'slugify';
import Member from '../models/member.model';
import Band from '../models/band.model';
import SocialLinks from '../models/social-links.model';

// GET /api/members/band/:bandSlug
export const getMembersByBand = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const bandSlug = req.params.bandSlug;
    const members = await Member.find({ bandSlug })
      .populate('band', 'name')
      .populate('socialLinks');

    const simplifiedMembers = members.map((member) => ({
      ...member.toObject(),
      band: typeof member.band === 'object' && member.band !== null
        ? (member.band as any).name
        : member.band
    }));

    res.json(simplifiedMembers);
  } catch (error) {
    next(error);
  }
};

// GET /api/members/:id
export const getMemberById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const member = await Member.findById(req.params.id)
      .populate('band', 'name slug')
      .populate('socialLinks');
    if (!member) {
      res.status(404).json({ message: 'Member not found' });
      return;
    }
    res.json(member);
  } catch (error) {
    next(error);
  }
};

// POST /api/members
export const createMember = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { name, instrument, band: bandName, image, bio, socialLinks } = req.body;

  if (!name || !instrument || !bandName || !image || !bio) {
    res.status(400).json({ message: 'Missing required fields: name, instrument, band, image, bio' });
    return;
  }

  try {
    const bandDoc = await Band.findOne({ name: bandName });
    if (!bandDoc) {
      res.status(404).json({ message: `Band '${bandName}' not found` });
      return;
    }

    const bandSlug = bandDoc.slug || slugify(bandName, { lower: true });

    const newMember = new Member({
      name,
      instrument,
      band: bandDoc._id,
      bandSlug,
      image,
      bio,
    });

    if (socialLinks && typeof socialLinks === 'object') {
      const newLinks = new SocialLinks({ ...socialLinks, member: newMember._id });
      const savedLinks = await newLinks.save();
      newMember.socialLinks = savedLinks._id;
    }

    const savedMember = await newMember.save();

    // Return populated member for consistency
    const populatedMember = await Member.findById(savedMember._id)
      .populate('band', 'name slug')
      .populate('socialLinks');

    res.status(201).json(populatedMember);
  } catch (error) {
    next(error);
  }
};

// POST /api/members/batch
export const createMembersBatch = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const members = req.body;

    if (!Array.isArray(members)) {
      res.status(400).json({ message: 'Request body must be an array of member objects' });
      return;
    }

    const createdMembers = [];

    for (const memberData of members) {
      const { name, instrument, band: bandName, image, bio, socialLinks } = memberData;

      if (!name || !instrument || !bandName || !image || !bio) {
        continue; // Skip incomplete entries
      }

      const bandDoc = await Band.findOne({ name: bandName });
      if (!bandDoc) {
        continue; // Skip if band not found
      }

      const bandSlug = bandDoc.slug || slugify(bandName, { lower: true });

      const newMember = new Member({
        name,
        instrument,
        band: bandDoc._id,
        bandSlug,
        image,
        bio,
      });

      if (socialLinks && typeof socialLinks === 'object') {
        const newLinks = new SocialLinks({ ...socialLinks, member: newMember._id });
        const savedLinks = await newLinks.save();
        newMember.socialLinks = savedLinks._id;
      }

      const savedMember = await newMember.save();
      const populated = await Member.findById(savedMember._id)
        .populate('band', 'name slug')
        .populate('socialLinks');

      createdMembers.push(populated);
    }

    res.status(201).json(createdMembers);
  } catch (error) {
    next(error);
  }
};

// PUT /api/members/:id
export const updateMember = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { id } = req.params;
  const { name, instrument, band: bandName, image, bio, socialLinks } = req.body;

  if (!name || !instrument || !bandName || !image || !bio) {
    res.status(400).json({ message: 'Missing required fields: name, instrument, band, image, bio' });
    return;
  }

  try {
    // Find the band by name
    const bandDoc = await Band.findOne({ name: bandName });
    if (!bandDoc) {
      res.status(404).json({ message: `Band '${bandName}' not found` });
      return;
    }

    const bandSlug = bandDoc.slug || slugify(bandName, { lower: true });

    // Update member fields
    const updatedMember = await Member.findByIdAndUpdate(
      id,
      {
        name,
        instrument,
        band: bandDoc._id,
        bandSlug,
        image,
        bio,
      },
      { new: true }
    );

    if (!updatedMember) {
      res.status(404).json({ message: 'Member not found' });
      return;
    }

    // Update or create socialLinks if provided
    if (socialLinks && typeof socialLinks === 'object') {
      const updatedLinks = await SocialLinks.findOneAndUpdate(
        { member: updatedMember._id },
        { ...socialLinks, member: updatedMember._id },
        { new: true, upsert: true }
      );
      updatedMember.socialLinks = updatedLinks._id;
      await updatedMember.save();
    }

    const populatedMember = await Member.findById(updatedMember._id)
      .populate('band', 'name slug')
      .populate('socialLinks');

    res.json(populatedMember);
  } catch (error) {
    next(error);
  }
};

// DELETE /api/members/:id
export const deleteMember = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { id } = req.params;

  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    res.status(400).json({ message: 'Invalid member ID' });
    return;
  }

  try {
    const deletedMember = await Member.findByIdAndDelete(id);

    if (!deletedMember) {
      res.status(404).json({ message: 'Member not found' });
      return;
    }

    await SocialLinks.deleteOne({ member: id });

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
