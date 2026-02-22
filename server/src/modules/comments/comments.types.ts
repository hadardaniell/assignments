/**
 * Request body for creating a comment.
 * TSOA uses this to build the POST Swagger model.
 */
export interface CreateCommentRequest {
  recipeId: string;
  content: string;
  createdBy: string;
}

/**
 * The full comment object returned by the API.
 */
export interface CommentDTO extends CreateCommentRequest {
  id: string;
  createdAt: Date;
  username?: string;
}

/**
 * Request body for updating a comment.
 * Only 'content' is allowed here.
 */
export interface UpdateCommentDTO {
  content: string;
}