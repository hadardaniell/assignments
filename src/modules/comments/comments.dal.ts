import CommentModel, { Comment } from './comments.model';
import { Types, UpdateQuery } from 'mongoose';

export class CommentsDAL {
  async create(data: Partial<Comment>): Promise<Comment> {
    const comment = new CommentModel(data);
    return comment.save();
  }

  async findById(id: string): Promise<Comment | null> {
    return CommentModel.findById(id).exec();
  }

  async findByRecipeId(recipeId: string): Promise<Comment[]> {
    return CommentModel.find({ recipeId: new Types.ObjectId(recipeId) }).exec();
  }

    async updateById(id: string, data: UpdateQuery<Comment>): Promise<Comment | null> {
      return CommentModel.findByIdAndUpdate(id, data, { new: true }).exec();
    }

  async deleteById(id: string): Promise<Comment | null> {
    return CommentModel.findByIdAndDelete(id).exec();
  }
}
