import mongoose, {
  Schema,
} from 'mongoose';

import {
  ICarouselItem,
} from '../interfaces/carousel-item.interface';

const CarouselItemSchema =
  new Schema<ICarouselItem>(
    {
      imageUrl: {
        type: String,
        required: true,
        trim: true,
        maxlength: 2048,
      },

      bandName: {
        type: String,
        trim: true,
        maxlength: 100,
      },

      songName: {
        type: String,
        trim: true,
        maxlength: 100,
      },

      releaseDate: {
        type: Date,
      },

      buttonText: {
        type: String,
        trim: true,
        maxlength: 50,
      },

      buttonLink: {
        type: String,
        trim: true,
        maxlength: 2048,
      },

      order: {
        type: Number,
        required: true,
        default: 0,
        min: 0,
        index: true,
      },
    },

    {
      timestamps: true,
    }
  );

export default mongoose.model<ICarouselItem>(
  'CarouselItem',
  CarouselItemSchema
);