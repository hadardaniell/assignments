import { Schema, model, Document } from 'mongoose';

export interface UserSettings {
  language?: string;
}

export interface User extends Document {
  email: string;
  passwordHash?: string;
  name: string;
  avatarUrl?: string | null;
  role: 'admin' | 'user';
  settings?: UserSettings;
  googleId?: string;
  createdAt: Date;
  updatedAt?: Date;
}

const userSchema = new Schema<User>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
      lowercase: true,
    },
    passwordHash: {
      type: String,
      required: false,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true,
    },
    avatarUrl: {
      type: String,
      default: null,
    },
    role: {
      type: String,
      enum: ['admin', 'user'],
      default: 'user' 
    },
    settings: {
      language: {
        type: String,
        default: 'he',
      },
    },
    createdAt: {
      type: Date,
      required: true,
      default: () => new Date(),
    },
    updatedAt: {
      type: Date,
    },
  },
  {
    collection: 'users',
  }
);

userSchema.set('toJSON', {
  transform: (_doc, ret) => {
    delete ret.passwordHash;
    return ret;
  },
});

export const UserModel = model<User>('User', userSchema);