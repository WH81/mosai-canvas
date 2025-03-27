import mongoose, { Schema } from 'mongoose';
import { ICarouselItem } from '../interfaces/CarouselItem.interface';

const CarouselItemSchema: Schema = new mongoose.Schema(
  {
    imageUrl: { type: String, required: true },
    bandName: { type: String, required: true },
    songName: { type: String, required: true },
    releaseDate: { type: Date, required: true },
    buttonText: { type: String, required: true },
    buttonLink: { type: String, required: true }
  },
  { timestamps: true } // Adds createdAt & updatedAt fields
);

export default mongoose.model<ICarouselItem>('CarouselItem', CarouselItemSchema);
