import { Schema, model, Types, Document } from 'mongoose';

export interface Like extends Document {
  userId: Types.ObjectId;
  recipeId: Types.ObjectId;
  createdAt: Date;
}

const LikeSchema = new Schema<Like>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  recipeId: { type: Schema.Types.ObjectId, ref: 'Recipe', required: true },
  createdAt: { type: Date, default: Date.now }
});

// אינדקס ייחודי שמונע ממשתמש לעשות לייק למתכון יותר מפעם אחת ברמת ה-DB
LikeSchema.index({ userId: 1, recipeId: 1 }, { unique: true });

export const LikeModel = model<Like>('Like', LikeSchema);