import { SocialLinks } from '../models/social-links.model';
import { ISocialLinks } from '../interfaces/social-links.interface';

export const createSocialLinks = async (bandId: string, links: Partial<ISocialLinks>) => {
  return await SocialLinks.create({ ...links, band: bandId });
};

export const updateSocialLinks = async (bandId: string, updates: Partial<ISocialLinks>) => {
  return await SocialLinks.findOneAndUpdate({ band: bandId }, updates, { new: true });
};

export const getSocialLinks = async (bandId: string) => {
  return await SocialLinks.findOne({ band: bandId });
};

export const deleteSocialLinks = async (bandId: string) => {
  return await SocialLinks.findOneAndDelete({ band: bandId });
};
