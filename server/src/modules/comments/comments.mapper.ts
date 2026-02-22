import { CommentDTO } from './comments.types';
import { Comment } from './comments.model';

export function toCommentDTO(comment: Comment): CommentDTO {
  const user = comment.userId as any;
  
  return {
    id: (comment._id as any).toString(),
    recipeId: comment.recipeId?.toString?.() ?? comment.recipeId,
    content: comment.text,
    createdBy: user?._id?.toString() ?? user?.toString() ?? comment.userId,
    username: user?.name || 'Unknown User',
    createdAt: comment.createdAt
  };
}