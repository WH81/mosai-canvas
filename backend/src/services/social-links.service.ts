import { SocialLinks } from '../models/social-links.model'; // adjust import to your model

// BAND social links
export const createSocialLinksForBand = async (bandId: string, data: any) => {
  const socialLinks = new SocialLinks({ band: bandId, ...data });
  return await socialLinks.save();
};

export const getSocialLinksForBand = async (bandId: string) => {
  return await SocialLinks.findOne({ band: bandId });
};

export const updateSocialLinksForBand = async (bandId: string, data: any) => {
  return await SocialLinks.findOneAndUpdate({ band: bandId }, data, { new: true });
};

export const deleteSocialLinksForBand = async (bandId: string) => {
  const deleted = await SocialLinks.findOneAndDelete({ band: bandId });
  return !!deleted;
};

// MEMBER social links
export const createSocialLinksForMember = async (memberId: string, data: any) => {
  const socialLinks = new SocialLinks({ member: memberId, ...data });
  return await socialLinks.save();
};

export const getSocialLinksForMember = async (memberId: string) => {
  return await SocialLinks.findOne({ member: memberId });
};

export const updateSocialLinksForMember = async (memberId: string, data: any) => {
  return await SocialLinks.findOneAndUpdate({ member: memberId }, data, { new: true });
};

export const deleteSocialLinksForMember = async (memberId: string) => {
  const deleted = await SocialLinks.findOneAndDelete({ member: memberId });
  return !!deleted;
};
