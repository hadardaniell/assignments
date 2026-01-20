export type CommentDTO = {
  id?: string;           // או commentId אצלך
  _id?: string;          // אם מונגו
  recipeId: string;
  createdBy: string;
  content: string;
  createdAt?: string;
  updatedAt?: string | null;
};

export type CreateCommentRequest = {
  recipeId: string;
  content: string;
  createdBy: string;
};

export type UpdateCommentRequest = {
  content: string;
  createdBy?: string;
};