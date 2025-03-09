import mongoose, { Schema, Document } from 'mongoose';

export interface ICarouselItem extends Document {
  imageUrl: string;
  bandName: string;
  songName: string;
  releaseDate: Date;
  buttonText: string;
  buttonLink: string;
}

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
