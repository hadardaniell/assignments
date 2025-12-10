import { Schema, model, Document, Types } from 'mongoose';

export interface Comment extends Document {
  recipeId: Types.ObjectId;
  userId: Types.ObjectId;
  text: string;
  createdAt: Date;
  updatedAt?: Date | null;
}

const CommentSchema = new Schema<Comment>(
  {
    recipeId: {
      type: Schema.Types.ObjectId,
      ref: 'Recipe',
      required: true
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    text: {
      type: String,
      required: true,
      minlength: 1
    },
    createdAt: {
      type: Date,
      required: true,
      default: () => new Date()
    },
    updatedAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: { createdAt: false, updatedAt: false }
  }
);

CommentSchema.pre('findOneAndUpdate', async function () {
  this.set({ updatedAt: new Date() });
});

CommentSchema.pre('save', async function () {
  if (!this.createdAt) {
    this.createdAt = new Date();
  }
});

export const CommentModel = model<Comment>('Comment', CommentSchema);
export default CommentModel;
