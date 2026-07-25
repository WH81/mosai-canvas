export interface IMailingList {
  _id?: string;
  firstName: string;
  lastName: string;
  email: string;
  subscribedAt?: Date;
  senderSubscriberId?: string; // Sender.net subscriber ID for unsubscribe
  isSubscribed?: boolean;
}