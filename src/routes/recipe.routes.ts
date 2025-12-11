// src/modules/recipes/recipe.routes.ts
import { Router } from 'express';
import { RecipeDAL } from '../modules/recipes/recipe.dal';
import { RecipeService } from '../modules/recipes/recipe.service';
import { RecipeController } from '../modules/recipes/recipe.controller';

const router = Router();

const dal = new RecipeDAL();
const service = new RecipeService(dal);
const controller = new RecipeController(service);

/**
 * @openapi
 * /api/recipes:
 *   post:
 *     summary: Create a new recipe
 *     tags:
 *       - Recipes
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: Recipe payload
 *     responses:
 *       201:
 *         description: Recipe created successfully
 */
router.post('/', controller.createRecipe);

/**
 * @openapi
 * /api/recipes:
 *   get:
 *     summary: Get all recipes
 *     tags:
 *       - Recipes
 *     responses:
 *       200:
 *         description: List of recipes
 */
router.get('/', controller.getRecipes);

/**
 * @openapi
 * /api/recipes/user/{userId}:
 *   get:
 *     summary: Get all recipes created by a specific user
 *     tags:
 *       - Recipes
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of user recipes
 */
router.get('/user/:userId', controller.getRecipesByUser);

/**
 * @openapi
 * /api/recipes/{id}:
 *   get:
 *     summary: Get a recipe by ID
 *     tags:
 *       - Recipes
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Recipe object
 *       404:
 *         description: Recipe not found
 */
router.get('/:id', controller.getRecipeById);

/**
 * @openapi
 * /api/recipes/{id}:
 *   put:
 *     summary: Update a recipe
 *     tags:
 *       - Recipes
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Recipe updated successfully
 *       404:
 *         description: Recipe not found
 */
router.put('/:id', controller.updateRecipe);

/**
 * @openapi
 * /api/recipes/{id}:
 *   delete:
 *     summary: Delete a recipe
 *     tags:
 *       - Recipes
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Recipe deleted successfully
 *       404:
 *         description: Recipe not found
 */
router.delete('/:id', controller.deleteRecipe);

export default router;
