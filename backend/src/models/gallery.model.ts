import { Schema, model } from 'mongoose';
import { IGallery } from '../interfaces/gallery.interface';

const GallerySchema = new Schema<IGallery>({
  title: { type: String, required: true, trim: true },
  artist: { type: String, required: true, trim: true },
  category: { 
    type: String, 
    enum: ['Art', 'Album Cover'], 
    default: 'Art',
    required: true 
  },
  imageUrl: { type: String, required: true },
  publicId: { type: String, required: true },
  altText: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

export default model<IGallery>('Gallery', GallerySchema);
