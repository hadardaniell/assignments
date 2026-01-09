import { CommentDTO } from './comments.types';
import { Comment } from './comments.model';

export function toCommentDTO(comment: Comment): CommentDTO {
  return {
    id: (comment._id as any).toString(),
    recipeId: comment.recipeId?.toString?.() ?? comment.recipeId,
    content: comment.text,
    createdBy: comment.userId?.toString?.() ?? comment.userId,
    createdAt: comment.createdAt
  };
}