import { Schema, model, Types, Document } from "mongoose";

export interface Like extends Document {
  userId: Types.ObjectId;
  recipeId: Types.ObjectId;
  likedAt: Date;
}

const LikeSchema = new Schema<Like>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    recipeId: {
      type: Schema.Types.ObjectId,
      ref: "Recipe",
      required: true,
    },
    likedAt: {
      type: Date,
      required: true,
      default: Date.now,
    },
  },
  {
    timestamps: false, 
    versionKey: false,
  }
);

LikeSchema.index({ userId: 1, recipeId: 1 }, { unique: true });

export const LikeModel = model<Like>("Like", LikeSchema);
