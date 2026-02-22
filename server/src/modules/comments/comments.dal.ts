import CommentModel, { Comment } from './comments.model';
import { Types, UpdateQuery } from 'mongoose';

export class CommentsDAL {
  async create(data: Partial<Comment>): Promise<Comment> {
    const comment = new CommentModel(data);
    const saved = await comment.save();
    return saved.populate('userId', 'name avatarUrl');
  }

  async findById(id: string): Promise<Comment | null> {
    return CommentModel.findById(id).populate('userId', 'name avatarUrl').exec();
  }

  async findByRecipeId(recipeId: string): Promise<Comment[]> {
    return CommentModel.find({ recipeId: new Types.ObjectId(recipeId) })
      .populate('userId', 'name avatarUrl')
      .exec();
  }

  async updateById(id: string, data: UpdateQuery<Comment>): Promise<Comment | null> {
    return CommentModel.findByIdAndUpdate(id, data, { new: true })
      .populate('userId', 'name avatarUrl')
      .exec();
  }

  async deleteById(id: string): Promise<Comment | null> {
    return CommentModel.findByIdAndDelete(id).exec();
  }

  async countByRecipeId(recipeId: Types.ObjectId): Promise<number> {
    return CommentModel.countDocuments({ recipeId }).exec();
  }
}