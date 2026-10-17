import mongoose, { ClientSession } from 'mongoose';

import { SocialLinks } from '../models/social-links.model';
import { Band } from '../models/band.model';
import Member from '../models/member.model';

// ============================================================
// TYPES
// ============================================================

export interface SocialLinksPayload {
  facebook?: string;
  instagram?: string;
  x?: string;
  youtube?: string;
  tiktok?: string;
}

// ============================================================
// HELPERS
// ============================================================

const getSocialLinksPayload = (
  data: SocialLinksPayload
): SocialLinksPayload => ({
  facebook: data.facebook ?? '',
  instagram: data.instagram ?? '',
  x: data.x ?? '',
  youtube: data.youtube ?? '',
  tiktok: data.tiktok ?? '',
});

const validateObjectId = (
  id: string,
  fieldName: string
): void => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error(`Invalid ${fieldName}.`);
  }
};

const resolveBandId = async (
  bandIdOrSlug: string,
  session?: ClientSession
): Promise<mongoose.Types.ObjectId> => {
  const query = mongoose.Types.ObjectId.isValid(bandIdOrSlug)
    ? { _id: bandIdOrSlug }
    : { slug: bandIdOrSlug };

  const bandQuery = Band.findOne(query).select('_id');
  if (session) {
    bandQuery.session(session);
  }

  const band = await bandQuery;
  if (!band) {
    const error = new Error('Band not found.');
    error.name = 'NotFoundError';
    throw error;
  }

  return band._id as mongoose.Types.ObjectId;
};

// ============================================================
// BAND
// ============================================================

export const createSocialLinksForBand = async (
  bandIdentifier: string,
  data: SocialLinksPayload,
  session?: ClientSession
) => {
  const bandId = await resolveBandId(bandIdentifier, session);

  const bandQuery = Band.findById(bandId);

  if (session) {
    bandQuery.session(session);
  }

  const band = await bandQuery;

  if (!band) {
    const error = new Error('Band not found.');
    error.name = 'NotFoundError';
    throw error;
  }

  const existingQuery = SocialLinks.findOne({
    band: band._id,
  });

  if (session) {
    existingQuery.session(session);
  }

  const existing = await existingQuery;

  if (existing) {
    const error = new Error(
      'Social links already exist for this band.'
    );
    error.name = 'ConflictError';
    throw error;
  }

  const socialLinks = new SocialLinks({
    band: band._id,
    ...getSocialLinksPayload(data),
  });

  await socialLinks.save(
    session ? { session } : undefined
  );

  band.set('socialLinks', socialLinks._id);

  await band.save(
    session ? { session } : undefined
  );

  return socialLinks;
};

export const getSocialLinksForBand = async (
  bandIdentifier: string
) => {
  const bandId = await resolveBandId(bandIdentifier);

  return SocialLinks.findOne({
    band: bandId,
  });
};

export const updateSocialLinksForBand = async (
  bandIdentifier: string,
  data: SocialLinksPayload,
  session?: ClientSession
) => {
  const bandId = await resolveBandId(bandIdentifier, session);

  const bandQuery = Band.findById(bandId);

  if (session) {
    bandQuery.session(session);
  }

  const band = await bandQuery;

  if (!band) {
    const error = new Error('Band not found.');
    error.name = 'NotFoundError';
    throw error;
  }

  const updateQuery = SocialLinks.findOneAndUpdate(
    { band: band._id },
    getSocialLinksPayload(data),
    {
      new: true,
      runValidators: true,
    }
  );

  if (session) {
    updateQuery.session(session);
  }

  const socialLinks = await updateQuery;

  if (!socialLinks) {
    const error = new Error(
      'Social links not found for this band.'
    );
    error.name = 'NotFoundError';
    throw error;
  }

  if (
    !band.socialLinks ||
    !band.socialLinks.equals(socialLinks._id)
  ) {
    band.set('socialLinks', socialLinks._id);

    await band.save(
      session ? { session } : undefined
    );
  }

  return socialLinks;
};

export const deleteSocialLinksForBand = async (
  bandIdentifier: string,
  session?: ClientSession
): Promise<void> => {
  const bandId = await resolveBandId(bandIdentifier, session);

  const bandQuery = Band.findById(bandId);

  if (session) {
    bandQuery.session(session);
  }

  const band = await bandQuery;

  if (!band) {
    const error = new Error('Band not found.');
    error.name = 'NotFoundError';
    throw error;
  }

  const deleteQuery = SocialLinks.findOneAndDelete({
    band: band._id,
  });

  if (session) {
    deleteQuery.session(session);
  }

  const deleted = await deleteQuery;

  if (!deleted) {
    const error = new Error(
      'Social links not found for this band.'
    );
    error.name = 'NotFoundError';
    throw error;
  }

  band.set('socialLinks', undefined);

  await band.save(
    session ? { session } : undefined
  );
};

// ============================================================
// MEMBER
// ============================================================

export const createSocialLinksForMember = async (
  memberId: string,
  data: SocialLinksPayload,
  session?: ClientSession
) => {
  validateObjectId(memberId, 'member ID');

  const memberQuery = Member.findById(memberId);

  if (session) {
    memberQuery.session(session);
  }

  const member = await memberQuery;

  if (!member) {
    const error = new Error('Member not found.');
    error.name = 'NotFoundError';
    throw error;
  }

  const existingQuery = SocialLinks.findOne({
    member: member._id,
  });

  if (session) {
    existingQuery.session(session);
  }

  const existing = await existingQuery;

  if (existing) {
    const error = new Error(
      'Social links already exist for this member.'
    );
    error.name = 'ConflictError';
    throw error;
  }

  const socialLinks = new SocialLinks({
    member: member._id,
    ...getSocialLinksPayload(data),
  });

  await socialLinks.save(
    session ? { session } : undefined
  );

  member.set('socialLinks', socialLinks._id);

  await member.save(
    session ? { session } : undefined
  );

  return socialLinks;
};

export const getSocialLinksForMember = async (
  memberId: string
) => {
  validateObjectId(memberId, 'member ID');

  return SocialLinks.findOne({
    member: memberId,
  });
};

export const updateSocialLinksForMember = async (
  memberId: string,
  data: SocialLinksPayload,
  session?: ClientSession
) => {
  validateObjectId(memberId, 'member ID');

  const memberQuery = Member.findById(memberId);

  if (session) {
    memberQuery.session(session);
  }

  const member = await memberQuery;

  if (!member) {
    const error = new Error('Member not found.');
    error.name = 'NotFoundError';
    throw error;
  }

  const updateQuery = SocialLinks.findOneAndUpdate(
    { member: member._id },
    getSocialLinksPayload(data),
    {
      new: true,
      runValidators: true,
    }
  );

  if (session) {
    updateQuery.session(session);
  }

  const socialLinks = await updateQuery;

  if (!socialLinks) {
    const error = new Error(
      'Social links not found for this member.'
    );
    error.name = 'NotFoundError';
    throw error;
  }

  if (
    !member.socialLinks ||
    !member.socialLinks.equals(socialLinks._id)
  ) {
    member.set('socialLinks', socialLinks._id);

    await member.save(
      session ? { session } : undefined
    );
  }

  return socialLinks;
};

export const deleteSocialLinksForMember = async (
  memberId: string,
  session?: ClientSession
): Promise<void> => {
  validateObjectId(memberId, 'member ID');

  const memberQuery = Member.findById(memberId);

  if (session) {
    memberQuery.session(session);
  }

  const member = await memberQuery;

  if (!member) {
    const error = new Error('Member not found.');
    error.name = 'NotFoundError';
    throw error;
  }

  const deleteQuery = SocialLinks.findOneAndDelete({
    member: member._id,
  });

  if (session) {
    deleteQuery.session(session);
  }

  const deleted = await deleteQuery;

  if (!deleted) {
    const error = new Error(
      'Social links not found for this member.'
    );
    error.name = 'NotFoundError';
    throw error;
  }

  member.set('socialLinks', undefined);

  await member.save(
    session ? { session } : undefined
  );
};