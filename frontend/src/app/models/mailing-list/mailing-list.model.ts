export interface MailingList {
  _id?: string;
  firstName: string;
  lastName: string;
  email: string;
  subscribedAt?: string;
  isSubscribed?: boolean;
}