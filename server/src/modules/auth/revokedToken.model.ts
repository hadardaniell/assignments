import { Schema, model } from "mongoose";

const RevokedTokenSchema = new Schema({
  token: { type: String, required: true },
  expiresAt: { type: Date, required: true },
});

export const RevokedTokenModel = model("RevokedToken", RevokedTokenSchema);