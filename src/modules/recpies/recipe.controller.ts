import { Request, Response, NextFunction } from 'express';
import { RecipeService } from './recipe.service';
import { RecipeDTO, RecipeFilterDTO } from './recipe.types';

export class RecipeController {
  constructor(private readonly service: RecipeService) {}

  // POST /api/recipes
  createRecipe = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const _recipe = req.body as RecipeDTO;

      const userId = _recipe.createdBy ?? '';

      if (!userId) {
        return res.status(400).json({ message: 'createdBy is required' });
      }

      const recipe = await this.service.createRecipe(userId, _recipe);
      return res.status(201).json(recipe);
    } catch (err) {
      next(err);
    }
  };

  // GET /api/recipes/:id
  getRecipeById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const recipe = await this.service.getRecipeById(id);
      if (!recipe) {
        return res.status(404).json({ message: 'Recipe not found' });
      }
      res.json(recipe);
    } catch (err) {
      next(err);
    }
  };

  // GET /api/recipes
  getRecipes = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const filter: RecipeFilterDTO = {
        recipeBookId: req.query.recipeBookId as string | undefined,
        status: req.query.status as any,
        difficulty: req.query.difficulty as any,
        search: req.query.search as string | undefined,
        skip: req.query.skip ? Number(req.query.skip) : undefined,
        limit: req.query.limit ? Number(req.query.limit) : undefined
      };

      const recipes = await this.service.listRecipes(filter);
      res.json(recipes);
    } catch (err) {
      next(err);
    }
  };

  // GET /api/recipes/user/:userId
getRecipesByUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ message: 'userId is required' });
    }

    const recipes = await this.service.getRecipesByUserId(userId);
    res.json(recipes);
  } catch (err) {
    next(err);
  }
};

  // PUT /api/recipes/:id
  updateRecipe = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      const input = req.body;

      const userId = input.createdBy ?? '';

      if (!userId) {
        return res.status(400).json({ message: 'createdBy is required' });
      }

      const recipe = await this.service.updateRecipe(id, userId, input);
      if (!recipe) {
        return res.status(404).json({ message: 'Recipe not found' });
      }

      res.json(recipe);
    } catch (err) {
      next(err);
    }
  };

  // DELETE /api/recipes/:id
  deleteRecipe = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;

      const recipe = await this.service.deleteRecipe(id);
      if (!recipe) {
        return res.status(404).json({ message: 'Recipe not found' });
      }

      res.status(204).send();
    } catch (err) {
      next(err);
    }
  };
}
