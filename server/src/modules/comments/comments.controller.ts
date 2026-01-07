import { Request, Response, NextFunction } from 'express';
import { CommentsService } from './comments.service';
import { CommentDTO, UpdateCommentDTO } from './comments.types';

export class CommentsController {
  constructor(private readonly service: CommentsService = new CommentsService()) {}

  // POST /api/comments
  createComment = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const input = req.body as CommentDTO;
      if (!input.recipeId || !input.createdBy) {
        return res.status(400).json({ message: 'recipeId and createdBy are required' });
      }

      const comment = await this.service.createComment(input);
      res.status(201).json(comment);
    } catch (err) {
      next(err);
    }
  };

  // GET /api/comments/:id
  getCommentById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { commentId } = req.params;
      const comment = await this.service.getCommentById(commentId);
      if (!comment) return res.status(404).json({ message: 'Comment not found' });
      res.json(comment);
    } catch (err) {
      next(err);
    }
  };

  // GET /api/comments/recipe/:recipeId
  getCommentsByRecipe = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { recipeId } = req.params;
      if (!recipeId) return res.status(400).json({ message: 'recipeId is required' });

      const comments = await this.service.getCommentsByRecipe(recipeId);
      res.json(comments);
    } catch (err) {
      next(err);
    }
  };

  // PUT /api/comments/:id
  updateComment = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { commentId } = req.params;
      const input = req.body as UpdateCommentDTO;

      const comment = await this.service.updateComment(commentId, input);
      if (!comment) return res.status(404).json({ message: 'Comment not found' });
      res.json(comment);
    } catch (err) {
      next(err);
    }
  };

  // DELETE /api/comments/:id
  deleteComment = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { commentId } = req.params;

      const comment = await this.service.deleteComment(commentId);
      if (!comment) return res.status(404).json({ message: 'Comment not found' });
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  };
}
