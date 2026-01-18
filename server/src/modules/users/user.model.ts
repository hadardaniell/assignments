import { Schema, model, Document } from 'mongoose';

export interface UserSettings {
  language?: string;
}

export interface User extends Document {
  email: string;
  passwordHash?: string; // הפיכת השדה לאופציונלי כדי לאפשר delete ב-transform
  name: string;
  avatarUrl?: string | null;
  role: 'admin' | 'user';
  settings?: UserSettings;
  refreshTokens?: string[]; // הפיכת השדה לאופציונלי כדי לאפשר delete ב-transform
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
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
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
    refreshTokens: {
      type: [String],
      default: [],
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
    delete ret.refreshTokens;
    return ret;
  },
});

export const UserModel = model<User>('User', userSchema);