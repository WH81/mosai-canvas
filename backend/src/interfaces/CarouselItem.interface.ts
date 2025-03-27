import { Document } from 'mongoose';

export interface ICarouselItem extends Document {
  imageUrl: string;
  bandName: string;
  songName: string;
  releaseDate: Date;
  buttonText: string;
  buttonLink: string;
}