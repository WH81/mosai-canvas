import { Document } from 'mongoose';

export interface IGallery extends Omit<Document, '_id'> {
  _id: string;
  title: string;
  artist: string;
  category: 'Art' | 'Album Cover';
  imageUrl: string;
  publicId: string;
  altText: string;
  createdAt: Date;
}