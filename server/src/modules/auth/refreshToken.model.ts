import { Schema, model, Types, Document } from "mongoose";

export interface RefreshTokenDocument extends Document {
  userId: Types.ObjectId;
  tokenHash: string;
  expiresAt: Date;
  revoked: boolean;
  createdAt: Date;
}

const RefreshTokenSchema = new Schema<RefreshTokenDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    tokenHash: {
      type: String,
      required: true,
      unique: true
    },
    expiresAt: {
      type: Date,
      required: true
    },
    revoked: {
      type: Boolean,
      required: true,
      default: false
    },
    createdAt: {
      type: Date,
      required: true,
      default: Date.now
    }
  },
  {
    collection: "refresh_tokens",
    versionKey: false
  }
);

export const RefreshTokenModel = model<RefreshTokenDocument>(
  "RefreshToken",
  RefreshTokenSchema
);