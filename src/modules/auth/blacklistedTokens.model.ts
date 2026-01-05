import e from "express";
import { Schema, model, Document } from "mongoose";

export interface BlacklistedToken extends Document {
  token: string;
  expiresAt: Date;
}

const BlacklistedTokenSchema = new Schema<BlacklistedToken>(
  {
    token: {
      type: String,
      required: true,
      unique: true,
      minlength: 10
    },
    expiresAt: {
      type: Date,
      required: true
    }
  },
  {
    collection: "blacklistedTokens",
    versionKey: false,
    timestamps: false
  }
);

BlacklistedTokenSchema.index(
  { expiresAt: 1 },
  { expireAfterSeconds: 0 }
);

export const BlacklistedTokenModel = model<BlacklistedToken>(
  "Blacklisted_token",
  BlacklistedTokenSchema
);

export default BlacklistedTokenModel;