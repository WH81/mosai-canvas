import mongoose, { Schema } from 'mongoose';
import { IMailingList } from '../interfaces/mailing-list.interface';

const MailingListSchema = new Schema<IMailingList>({
  email: { type: String, required: true, unique: true },
  name: { type: String },
  subscribedAt: { type: Date, default: Date.now }
});

export default mongoose.model<IMailingList>('MailingList', MailingListSchema);
