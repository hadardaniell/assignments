import { getApi } from "../services"; // עדכני נתיב אם צריך
import type { CommentDTO, CreateCommentRequest, UpdateCommentRequest } from "../types/comments.types";

function getCommentId(c: CommentDTO) {
  return c.id ?? c._id ?? "";
}

export const commentsApi = {
  getCommentsByRecipe: (recipeId: string) =>
    getApi().get<CommentDTO[]>(`/comments/recipe/getCommentsByRecipe/${recipeId}`),

  createComment: (body: CreateCommentRequest) =>
    getApi().post<CommentDTO>(`/comments/create`, body),

  updateComment: (commentId: string, body: UpdateCommentRequest) =>
    getApi().put<CommentDTO>(`/comments/update/${commentId}`, body),

  deleteComment: (commentId: string) =>
    getApi().delete<void>(`/comments/delete/${commentId}`),

  getCommentId,
};
