export interface CommentDTO {
  recipeId: string;
  content: string;
  createdBy: string;
}

export type UpdateCommentDTO = Partial<CommentDTO>;
