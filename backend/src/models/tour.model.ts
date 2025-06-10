import { Schema, model, Document } from 'mongoose';
import { ITour } from '../interfaces/tour.interface';

const TourSchema = new Schema<ITour & Document>({
  date: { type: String, required: true },
  band: { type: String, required: true },
  venue: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true }
});

const Tour = model<ITour & Document>('Tour', TourSchema);
export default Tour;
