// import { Request, Response, NextFunction } from 'express';
// import { CommentsService } from './comments.service';
// import { CreateCommentDTO, UpdateCommentDTO } from './comments.types';

// export class CommentsController {
//   constructor(private readonly service: CommentsService = new CommentsService()) {}

//   createComment = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       const input = req.body as CreateCommentDTO;

//       // Validation: Server-side check for required creation fields
//       if (!input.recipeId || !input.createdBy || !input.content) {
//         return res.status(400).json({ 
//           message: 'recipeId, createdBy, and content are required' 
//         });
//       }

//       const comment = await this.service.createComment(input);
//       res.status(201).json(comment);
//     } catch (err) {
//       next(err);
//     }
//   };

//   getCommentById = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       const { commentId } = req.params;
//       const comment = await this.service.getCommentById(commentId);
//       if (!comment) return res.status(404).json({ message: 'Comment not found' });
//       res.json(comment);
//     } catch (err) {
//       next(err);
//     }
//   };

//   getCommentsByRecipe = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       const { recipeId } = req.params;
//       if (!recipeId) return res.status(400).json({ message: 'recipeId is required' });

//       const comments = await this.service.getCommentsByRecipe(recipeId);
//       res.json(comments);
//     } catch (err) {
//       next(err);
//     }
//   };

//   updateComment = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       const { commentId } = req.params;
//       const input = req.body as UpdateCommentDTO;

//       if (!input.content) {
//         return res.status(400).json({ message: 'content is required for update' });
//       }

//       const comment = await this.service.updateComment(commentId, input);
//       if (!comment) return res.status(404).json({ message: 'Comment not found' });
//       res.json(comment);
//     } catch (err) {
//       next(err);
//     }
//   };

//   deleteComment = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       const { commentId } = req.params;
//       const comment = await this.service.deleteComment(commentId);
//       if (!comment) return res.status(404).json({ message: 'Comment not found' });
//       res.status(204).send();
//     } catch (err) {
//       next(err);
//     }
//   };
// }