import mongoose, { ClientSession } from 'mongoose';

import { StreamingLinks } from '../models/streaming-links.model';
import { Band } from '../models/band.model';
import Member from '../models/member.model';

// ============================================================
// TYPES
// ============================================================

export interface StreamingLinksPayload {
  spotify?: string;
  appleMusic?: string;
  soundcloud?: string;
  bandcamp?: string;
  youtubeMusic?: string;
}

// ============================================================
// HELPERS
// ============================================================

const getStreamingLinksPayload = (
  data: StreamingLinksPayload
): StreamingLinksPayload => ({
  spotify: data.spotify ?? '',
  appleMusic: data.appleMusic ?? '',
  soundcloud: data.soundcloud ?? '',
  bandcamp: data.bandcamp ?? '',
  youtubeMusic: data.youtubeMusic ?? '',
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

export const createStreamingLinksForBand = async (
  bandIdentifier: string,
  data: StreamingLinksPayload,
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

  const existingQuery = StreamingLinks.findOne({
    band: band._id,
  });

  if (session) {
    existingQuery.session(session);
  }

  const existing = await existingQuery;

  if (existing) {
    const error = new Error(
      'Streaming links already exist for this band.'
    );
    error.name = 'ConflictError';
    throw error;
  }

  const streamingLinks = new StreamingLinks({
    band: band._id,
    ...getStreamingLinksPayload(data),
  });

  await streamingLinks.save(
    session ? { session } : undefined
  );

  band.set('streamingLinks', streamingLinks._id);

  await band.save(
    session ? { session } : undefined
  );

  return streamingLinks;
};

export const getStreamingLinksForBand = async (
  bandIdentifier: string
) => {
  const bandId = await resolveBandId(bandIdentifier);

  return StreamingLinks.findOne({
    band: bandId,
  });
};

export const updateStreamingLinksForBand = async (
  bandIdentifier: string,
  data: StreamingLinksPayload,
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

  const updateQuery = StreamingLinks.findOneAndUpdate(
    { band: band._id },
    getStreamingLinksPayload(data),
    {
      new: true,
      runValidators: true,
    }
  );

  if (session) {
    updateQuery.session(session);
  }

  const streamingLinks = await updateQuery;

  if (!streamingLinks) {
    const error = new Error(
      'Streaming links not found for this band.'
    );
    error.name = 'NotFoundError';
    throw error;
  }

  if (
    !band.streamingLinks ||
    !band.streamingLinks.equals(streamingLinks._id)
  ) {
    band.set('streamingLinks', streamingLinks._id);

    await band.save(
      session ? { session } : undefined
    );
  }

  return streamingLinks;
};

export const deleteStreamingLinksForBand = async (
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

  const deleteQuery = StreamingLinks.findOneAndDelete({
    band: band._id,
  });

  if (session) {
    deleteQuery.session(session);
  }

  const deleted = await deleteQuery;

  if (!deleted) {
    const error = new Error(
      'Streaming links not found for this band.'
    );
    error.name = 'NotFoundError';
    throw error;
  }

  band.set('streamingLinks', undefined);

  await band.save(
    session ? { session } : undefined
  );
};

// ============================================================
// MEMBER
// ============================================================

export const createStreamingLinksForMember = async (
  memberId: string,
  data: StreamingLinksPayload,
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

  const existingQuery = StreamingLinks.findOne({
    member: member._id,
  });

  if (session) {
    existingQuery.session(session);
  }

  const existing = await existingQuery;

  if (existing) {
    const error = new Error(
      'Streaming links already exist for this member.'
    );
    error.name = 'ConflictError';
    throw error;
  }

  const streamingLinks = new StreamingLinks({
    member: member._id,
    ...getStreamingLinksPayload(data),
  });

  await streamingLinks.save(
    session ? { session } : undefined
  );

  member.set('streamingLinks', streamingLinks._id);

  await member.save(
    session ? { session } : undefined
  );

  return streamingLinks;
};

export const getStreamingLinksForMember = async (
  memberId: string
) => {
  validateObjectId(memberId, 'member ID');

  return StreamingLinks.findOne({
    member: memberId,
  });
};

export const updateStreamingLinksForMember = async (
  memberId: string,
  data: StreamingLinksPayload,
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

  const updateQuery = StreamingLinks.findOneAndUpdate(
    { member: member._id },
    getStreamingLinksPayload(data),
    {
      new: true,
      runValidators: true,
    }
  );

  if (session) {
    updateQuery.session(session);
  }

  const streamingLinks = await updateQuery;

  if (!streamingLinks) {
    const error = new Error(
      'Streaming links not found for this member.'
    );
    error.name = 'NotFoundError';
    throw error;
  }

  if (
    !member.streamingLinks ||
    !member.streamingLinks.equals(streamingLinks._id)
  ) {
    member.set('streamingLinks', streamingLinks._id);

    await member.save(
      session ? { session } : undefined
    );
  }

  return streamingLinks;
};

export const deleteStreamingLinksForMember = async (
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

  const deleteQuery = StreamingLinks.findOneAndDelete({
    member: member._id,
  });

  if (session) {
    deleteQuery.session(session);
  }

  const deleted = await deleteQuery;

  if (!deleted) {
    const error = new Error(
      'Streaming links not found for this member.'
    );
    error.name = 'NotFoundError';
    throw error;
  }

  member.set('streamingLinks', undefined);

  await member.save(
    session ? { session } : undefined
  );
};