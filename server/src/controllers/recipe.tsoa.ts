import { Route, Tags, Controller, Post, Get, Put, Delete, Body, Path, Query } from 'tsoa';
import { RecipeService } from '../modules/recipes/recipe.service';
import { AppError } from '../common';
import { RecipeDTO, RecipeFilterDTO } from '../modules/recipes/recipe.types';

@Route('recipes')
@Tags('Recipes')
export class RecipeController extends Controller {
    private readonly service: RecipeService = new RecipeService();

    @Get('ai-search')
    public async aiSearch(@Query() q: string): Promise<RecipeDTO[]> {
        try {
            return await this.service.searchRecipesWithAI(q);
        } catch (err: any) {
            this.setStatus(500);
            throw err;
        }
    }

    @Post('createRecipe')
    public async createRecipe(@Body() body: RecipeDTO): Promise<RecipeDTO> {
        try {
            const userId = body.createdBy;
            if (!userId) {
                throw new AppError(400, 'createdBy is required');
            }
            const recipe = await this.service.createRecipe(userId, body);
            this.setStatus(201);
            return recipe;
        } catch (err: any) {
            this.setStatus(err.statusCode || 500);
            throw err;
        }
    }

    @Get('getRecipeById/{id}')
    public async getRecipeById(@Path() id: string): Promise<RecipeDTO> {
        try {
            const recipe = await this.service.getRecipeById(id);
            if (!recipe) {
                throw new AppError(404, 'Recipe not found');
            }
            return recipe;
        } catch (err: any) {
            this.setStatus(err.statusCode || 500);
            throw err;
        }
    }

    @Get('getRecipes')
    public async getRecipes(
        @Query() recipeBookId?: string,
        @Query() status?: any,
        @Query() difficulty?: any,
        @Query() search?: string
    ): Promise<RecipeDTO[]> {
        try {
            const filter: RecipeFilterDTO = { recipeBookId, status, difficulty, search };
            return await this.service.listRecipes(filter);
        } catch (err: any) {
            this.setStatus(500);
            throw err;
        }
    }

    @Put('updateRecipe/{id}')
    public async updateRecipe(@Path() id: string, @Body() body: Partial<RecipeDTO>): Promise<RecipeDTO> {
        try {
            const userId = body.createdBy || '';
            const recipe = await this.service.updateRecipe(id, userId, body);
            if (!recipe) {
                throw new AppError(404, 'Recipe not found');
            }
            return recipe;
        } catch (err: any) {
            this.setStatus(err.statusCode || 500);
            throw err;
        }
    }

    @Delete('deleteRecipe/{id}')
    public async deleteRecipe(@Path() id: string): Promise<void> {
        try {
            const recipe = await this.service.deleteRecipe(id);
            if (!recipe) {
                throw new AppError(404, 'Recipe not found');
            }
            this.setStatus(204);
            return;
        } catch (err: any) {
            this.setStatus(err.statusCode || 500);
            throw err;
        }
    }
}