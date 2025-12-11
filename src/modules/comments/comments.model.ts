import { Schema, model, Types, Document } from 'mongoose';

export interface Comment extends Document {
  recipeId: Types.ObjectId;
  userId: Types.ObjectId;
  text: string;
  createdAt: Date;
  updatedAt: Date | null;
}

const CommentSchema = new Schema<Comment>({
  recipeId: { type: Schema.Types.ObjectId, required: true, ref: 'Recipe' },
  userId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
  text: { type: String, required: true },
  createdAt: { type: Date, required: true, default: () => new Date() },
  updatedAt: { type: Date, default: null }
});

const CommentModel = model<Comment>('Comment', CommentSchema);
export default CommentModel;
