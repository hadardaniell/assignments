import { Types } from 'mongoose';
import { CommentsDAL } from './comments.dal';
import { CommentDTO, CreateCommentRequest, UpdateCommentDTO } from './comments.types';
import { toCommentDTO } from './comments.mapper';

export class CommentsService {
  constructor(private readonly dal: CommentsDAL = new CommentsDAL()) {}

  async createComment(input: CreateCommentRequest): Promise<CommentDTO> {
    const comment = await this.dal.create({
      recipeId: new Types.ObjectId(input.recipeId),
      userId: new Types.ObjectId(input.createdBy),
      text: input.content,
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
    const update: any = { 
      text: input.content, 
      updatedAt: new Date() 
    };

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