// src/modules/recipes/recipe.routes.ts
import { Router } from 'express';
import { RecipeDAL } from '../modules/recpies/recipe.dal';
import { RecipeService } from '../modules/recpies/recipe.service';
import { RecipeController } from '../modules/recpies/recipe.controller';

const router = Router();

const dal = new RecipeDAL();
const service = new RecipeService(dal);
const controller = new RecipeController(service);

router.post('/', controller.createRecipe);
router.get('/', controller.getRecipes);
router.get('/:id', controller.getRecipeById);
router.get('/user/:userId', controller.getRecipesByUser);
router.put('/:id', controller.updateRecipe);
router.delete('/:id', controller.deleteRecipe);

export default router;
