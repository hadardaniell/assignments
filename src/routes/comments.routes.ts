import { Router } from 'express';
import { CommentsController } from '../modules/comments/comments.controller';

const router = Router();
const controller = new CommentsController();

router.post('/', controller.createComment);
router.get('/recipe/:recipeId', controller.getCommentsByRecipe);
router.get('/:commentId', controller.getCommentById);
router.put('/:commentId', controller.updateComment);
router.delete('/:commentId', controller.deleteComment);

export default router;
