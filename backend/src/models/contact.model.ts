import mongoose, { Schema, Document } from 'mongoose';
import { IContact } from '../interfaces/contact.interface';

export interface IContactDocument extends IContact, Document {}

const ContactSchema: Schema = new Schema<IContactDocument>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    subject: { type: String },
    message: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { collection: 'contact' }
);

export default mongoose.model<IContactDocument>('Contact', ContactSchema);
