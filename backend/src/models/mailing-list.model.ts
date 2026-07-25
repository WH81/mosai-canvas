import mongoose, { Schema } from 'mongoose';
import { IMailingList } from '../interfaces/mailing-list.interface';

const MailingListSchema = new Schema<IMailingList>({
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  subscribedAt: { type: Date, default: Date.now },
  senderSubscriberId: { type: String },
  isSubscribed: { type: Boolean, default: true },
});

export default mongoose.model<IMailingList>('MailingList', MailingListSchema);