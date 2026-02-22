export type CommentDTO = {
  id?: string;           
  _id?: string;          
  recipeId: string;
  createdBy: string;
  content: string;
  createdAt?: string;
  updatedAt?: string | null;
  username?: string;
  avatarUrl?: string;
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