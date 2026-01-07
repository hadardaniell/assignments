// src/modules/comments/comments.routes.ts
import { Router } from 'express';
import { CommentsController } from '../modules/comments/comments.controller';

const router = Router();
const controller = new CommentsController();

/**
 * @openapi
 * /api/comments:
 *   post:
 *     summary: Create a new comment
 *     tags:
 *       - Comments
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               recipeId:
 *                 type: string
 *                 description: ID of the recipe
 *               createdBy:
 *                 type: string
 *                 description: ID of the user creating the comment
 *               content:
 *                 type: string
 *                 description: Text content of the comment
 *             required:
 *               - recipeId
 *               - createdBy
 *               - content
 *     responses:
 *       201:
 *         description: Comment created successfully
 */
router.post('/', controller.createComment);

/**
 * @openapi
 * /api/comments/recipe/{recipeId}:
 *   get:
 *     summary: Get all comments for a specific recipe
 *     tags:
 *       - Comments
 *     parameters:
 *       - in: path
 *         name: recipeId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of comments for the recipe
 */
router.get('/recipe/:recipeId', controller.getCommentsByRecipe);

/**
 * @openapi
 * /api/comments/{commentId}:
 *   get:
 *     summary: Get a comment by ID
 *     tags:
 *       - Comments
 *     parameters:
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Comment object
 *       404:
 *         description: Comment not found
 */
router.get('/:commentId', controller.getCommentById);

/**
 * @openapi
 * /api/comments/{commentId}:
 *   put:
 *     summary: Update a comment
 *     tags:
 *       - Comments
 *     parameters:
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *                 description: Updated comment text
 *     responses:
 *       200:
 *         description: Comment updated successfully
 *       404:
 *         description: Comment not found
 */
router.put('/:commentId', controller.updateComment);

/**
 * @openapi
 * /api/comments/{commentId}:
 *   delete:
 *     summary: Delete a comment
 *     tags:
 *       - Comments
 *     parameters:
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Comment deleted successfully
 *       404:
 *         description: Comment not found
 */
router.delete('/:commentId', controller.deleteComment);

export default router;
