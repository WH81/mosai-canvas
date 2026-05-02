import { Schema, model, Document } from 'mongoose';

export interface IGallery extends Document {
  title: string;
  artist: string;
  category: 'Art' | 'Album Cover';
  imageUrl: string;
  altText: string;
  createdAt: Date;
}

const GallerySchema = new Schema<IGallery>({
  title: { type: String, required: true, trim: true },
  artist: { type: String, required: true, trim: true },
  category: { type: String, enum: ['Art', 'Album Cover'], default: 'Art' },
  imageUrl: { type: String, required: true },
  altText: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

export default model<IGallery>('Gallery', GallerySchema);