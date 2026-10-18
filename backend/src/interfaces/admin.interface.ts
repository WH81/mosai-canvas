import mongoose from 'mongoose';

export interface IAdmin {
  _id: mongoose.Types.ObjectId;

  username: string;

  displayName: string;

  email: string;

  passwordHash: string;

  role: 'admin' | 'super-admin';

  isActive: boolean;

  lastLogin: Date | null;

  createdAt: Date;

  updatedAt: Date;

  comparePassword(
    password: string
  ): Promise<boolean>;
}