import { StreamingLinks } from '../models/streaming-links.model';
import { IStreamingLinks } from '../interfaces/streaming-links.interface';
import { Band } from '../models/band.model';

export const createStreamingLinks = async (bandId: string, links: Partial<IStreamingLinks>) => {
  const existing = await StreamingLinks.findOne({ band: bandId });
  if (existing) {
    throw new Error('Streaming links already exist for this band');
  }

  const created = await StreamingLinks.create({ ...links, band: bandId });

  // ⬅️ Update the band with the new streamingLinks reference
  await Band.findByIdAndUpdate(bandId, { streamingLinks: created._id });

  return created;
};

export const updateStreamingLinks = async (bandId: string, updates: Partial<IStreamingLinks>) => {
  return await StreamingLinks.findOneAndUpdate({ band: bandId }, updates, { new: true });
};

export const getStreamingLinks = async (bandId: string) => {
  return await StreamingLinks.findOne({ band: bandId });
};

export const deleteStreamingLinks = async (bandId: string) => {
  return await StreamingLinks.findOneAndDelete({ band: bandId });
};