import { Types } from 'mongoose';
import { CommentsDAL } from './comments.dal';
import { Comment } from './comments.model';
import { CommentDTO, UpdateCommentDTO } from './comments.types';
import { toCommentDTO } from './comments.mapper'; // <-- כאן המיפר שלנו

export class CommentsService {
  constructor(private readonly dal: CommentsDAL = new CommentsDAL()) {}

  async createComment(input: CommentDTO): Promise<CommentDTO> {
    const comment = await this.dal.create({
      recipeId: new Types.ObjectId(input.recipeId),
      userId: new Types.ObjectId(input.createdBy), // renamed to match validation
      text: input.content,                           // renamed to match validation
      createdAt: new Date(),
      updatedAt: null
    } as any);

    return toCommentDTO(comment);
  }

  async getCommentById(id: string): Promise<CommentDTO | null> {
    const comment = await this.dal.findById(id);
    if (!comment) return null;
    return toCommentDTO(comment);
  }

  async getCommentsByRecipe(recipeId: string): Promise<CommentDTO[]> {
    const comments = await this.dal.findByRecipeId(recipeId);
    return comments.map(toCommentDTO);
  }

  async updateComment(id: string, input: UpdateCommentDTO): Promise<CommentDTO | null> {
    const update: any = { ...input, updatedAt: new Date() };

    if (input.recipeId) update.recipeId = new Types.ObjectId(input.recipeId);
    if (input.createdBy) update.createdBy = new Types.ObjectId(input.createdBy);

    const updatedComment = await this.dal.updateById(id, update);
    if (!updatedComment) return null;
    return toCommentDTO(updatedComment);
  }

  async deleteComment(id: string): Promise<CommentDTO | null> {
    const deletedComment = await this.dal.deleteById(id);
    if (!deletedComment) return null;
    return toCommentDTO(deletedComment);
  }
}
