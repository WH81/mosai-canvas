import mongoose, {
  Schema,
} from 'mongoose';

import bcrypt from 'bcrypt';

import {
  IAdmin,
} from '../interfaces/admin.interface';

const AdminSchema =
  new Schema<IAdmin>(
    {
      username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        minlength: 4,
        maxlength: 50,
      },

      displayName: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100,
      },

      email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        maxlength: 255,
      },

      passwordHash: {
        type: String,
        required: true,
        select: false,
      },

      role: {
        type: String,
        enum: [
          'admin',
          'super-admin',
        ],
        default: 'admin',
      },

      isActive: {
        type: Boolean,
        default: true,
      },

      lastLogin: {
        type: Date,
        default: null,
      },
    },

    {
      timestamps: true,
    }
  );

/**
 * Hash password before saving.
 */
AdminSchema.pre(
  'save',
  async function (next) {
    if (
      !this.isModified(
        'passwordHash'
      )
    ) {
      return next();
    }

    try {
      const salt =
        await bcrypt.genSalt(12);

      this.passwordHash =
        await bcrypt.hash(
          this.passwordHash,
          salt
        );

      next();
    } catch (error) {
      next(error as Error);
    }
  }
);

/**
 * Compare supplied password with
 * stored bcrypt hash.
 */
AdminSchema.methods.comparePassword =
  async function (
    password: string
  ): Promise<boolean> {
    if (!this.passwordHash) {
      throw new Error(
        'Password hash not selected.'
      );
    }

    return bcrypt.compare(
      password,
      this.passwordHash
    );
  };

/**
 * Never expose passwordHash.
 */
AdminSchema.set('toJSON', {
  transform(_doc: any, ret: Record<string, any>) {
    delete ret.password;
    delete ret.__v;
    return ret;
  },
});

export default mongoose.model<IAdmin>(
  'Admin',
  AdminSchema
);