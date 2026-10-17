import mongoose from 'mongoose';

export interface ICarouselItem {
  _id: mongoose.Types.ObjectId;

  imageUrl: string;

  bandName?: string;

  songName?: string;

  releaseDate?: Date;

  buttonText?: string;

  buttonLink?: string;

  order: number;

  createdAt: Date;

  updatedAt: Date;
}