import { Types } from 'mongoose';
import { CommentsDAL } from './comments.dal';
import { Comment } from './comments.model';
import { CommentDTO, UpdateCommentDTO } from './comments.types';

export class CommentsService {
  constructor(private readonly dal: CommentsDAL = new CommentsDAL()) {}

  async createComment(input: CommentDTO): Promise<Comment> {
  return this.dal.create({
    recipeId: new Types.ObjectId(input.recipeId),
    userId: new Types.ObjectId(input.createdBy), // renamed to match validation
    text: input.content,                           // renamed to match validation
    createdAt: new Date(),
    updatedAt: null
  } as any);
}

  async getCommentById(id: string): Promise<Comment | null> {
    return this.dal.findById(id);
  }

  async getCommentsByRecipe(recipeId: string): Promise<Comment[]> {
    return this.dal.findByRecipeId(recipeId);
  }

  async updateComment(id: string, input: UpdateCommentDTO): Promise<Comment | null> {
    const update: any = { ...input };
    if (input.recipeId) update.recipeId = new Types.ObjectId(input.recipeId);
    if (input.createdBy) update.createdBy = new Types.ObjectId(input.createdBy);

    return this.dal.updateById(id, update);
  }

  async deleteComment(id: string): Promise<Comment | null> {
    return this.dal.deleteById(id);
  }
}
