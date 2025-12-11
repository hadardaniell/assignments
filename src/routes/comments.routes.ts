import { Router } from 'express';
import { CommentsController } from '../modules/comments/comments.controller';

const router = Router();
const controller = new CommentsController();

// CREATE
router.post('/', controller.createComment);

// GET all comments for a recipe
router.get('/recipe/:recipeId', controller.getCommentsByRecipe);

// GET single comment
router.get('/:commentId', controller.getCommentById);

// UPDATE
router.put('/:commentId', controller.updateComment);

// DELETE
router.delete('/:commentId', controller.deleteComment);

export default router;
