import {
  Route,
  Tags,
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Path,
  Query
} from 'tsoa';

import { RecipeService } from '../modules/recipes/recipe.service';
import { AppError } from '../common';
import { RecipeDTO, RecipeFilterDTO } from '../modules/recipes/recipe.types';

@Route('recipes')
@Tags('Recipes')
export class RecipeController extends Controller {

  private readonly service: RecipeService = new RecipeService();

  // POST /api/recipes
  @Post('createRecipe')
  public async createRecipe(
    @Body() body: RecipeDTO
  ): Promise<RecipeDTO> {
    try {
      const userId = body.createdBy ?? '';

      if (!userId) {
        throw new AppError(400,'createdBy is required');
      }

      const recipe = await this.service.createRecipe(userId, body);
      this.setStatus(201);
      return recipe;
    } catch (err: any) {
      if (err instanceof AppError) {
        this.setStatus(err.statusCode);
        throw { message: err.message, code: err.code };
      }

      this.setStatus(500);
      throw err;
    }
  }

  // GET /api/recipes/{id}
  @Get('getRecipeById/{id}')
  public async getRecipeById(
    @Path() id: string
  ): Promise<RecipeDTO> {
    try {
      const recipe = await this.service.getRecipeById(id);

      if (!recipe) {
        throw new AppError(404, 'Recipe not found');
      }

      return recipe;
    } catch (err: any) {
      if (err instanceof AppError) {
        this.setStatus(err.statusCode);
        throw { message: err.message, code: err.code };
      }

      this.setStatus(500);
      throw err;
    }
  }

  // GET /api/recipes
  @Get('getRecipes')
  public async getRecipes(
    @Query() recipeBookId?: string,
    @Query() status?: any,
    @Query() difficulty?: any,
    @Query() search?: string,
    @Query() skip?: number,
    @Query() limit?: number
  ): Promise<RecipeDTO[]> {
    try {
      const filter: RecipeFilterDTO = {
        recipeBookId,
        status,
        difficulty,
        search,
        skip,
        limit
      };

      return await this.service.listRecipes(filter);
    } catch (err: any) {
      this.setStatus(500);
      throw err;
    }
  }

  // GET /api/recipes/user/{userId}
  @Get('getRecipesByUser/{userId}')
  public async getRecipesByUser(
    @Path() userId: string
  ): Promise<RecipeDTO[]> {
    try {
      if (!userId) {
        throw new AppError(400, 'userId is required');
      }

      return await this.service.getRecipesByUserId(userId);
    } catch (err: any) {
      if (err instanceof AppError) {
        this.setStatus(err.statusCode);
        throw { message: err.message, code: err.code };
      }

      this.setStatus(500);
      throw err;
    }
  }

  // PUT /api/recipes/{id}
  @Put('updateRecipe/{id}')
  public async updateRecipe(
    @Path() id: string,
    @Body() body: Partial<RecipeDTO>
  ): Promise<RecipeDTO | void> {
    try {
      const userId = body.createdBy ?? '';

      if (!userId) {
        throw new AppError(400, 'createdBy is required');
      }

      const recipe = await this.service.updateRecipe(id, userId, body);

      if (!recipe) {
        throw new AppError(404, 'Recipe not found');
      }

      return recipe;
    } catch (err: any) {
      if (err instanceof AppError) {
        this.setStatus(err.statusCode);
        throw { message: err.message, code: err.code };
      }

      this.setStatus(500);
      throw err;
    }
  }

  // DELETE /api/recipes/{id}
  @Delete('deleteRecipe/{id}')
  public async deleteRecipe(
    @Path() id: string
  ): Promise<RecipeDTO | void> {
    try {
      const recipe = await this.service.deleteRecipe(id);

      if (!recipe) {
        throw new AppError(404, 'Recipe not found');
      }

      this.setStatus(204);
      return;
    } catch (err: any) {
      if (err instanceof AppError) {
        this.setStatus(err.statusCode);
        throw { message: err.message, code: err.code };
      }

      this.setStatus(500);
      throw err;
    }
  }
}
