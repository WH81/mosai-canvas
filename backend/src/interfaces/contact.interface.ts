export interface IContact {
    name: string;
    email: string;
    subject?: string;
    message: string;
    createdAt?: Date; // optional because MongoDB adds it automatically
  }
  