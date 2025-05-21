import mongoose from 'mongoose';

const socialLinksSchema = new mongoose.Schema({
  facebook: String,
  instagram: String,
  x: String,
  youtube: String,
  tiktok: String,
}, { timestamps: true });

const SocialLinks = mongoose.model('SocialLinks', socialLinksSchema);
export default SocialLinks;
