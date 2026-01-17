import { Route, Tags, Controller, Post, Get, Put, Delete, Body, Path, Query, UploadedFile, Patch } from 'tsoa';
import { RecipeService } from '../modules/recipes/recipe.service';
import { AppError } from '../common';
import { RecipeDTO, RecipeFilterDTO } from '../modules/recipes/recipe.types';

@Route('recipes')
@Tags('Recipes')
export class RecipeController extends Controller {
    private readonly service: RecipeService = new RecipeService();

    @Post('{id}/image')
    public async uploadImage(
        @Path() id: string,
        @UploadedFile() file: Express.Multer.File
    ): Promise<{ url: string }> {
        try {
            if (!file) {
                throw new AppError(400, 'File is required');
            }
            const fileName = file.filename || (file.path ? file.path.split(/[\\/]/).pop() : null) || file.originalname;
            if (!fileName) {
                throw new AppError(500, 'Could not determine filename');
            }
            const imageUrl = `/uploads/${fileName}`;
            await this.service.updateRecipe(id, '', { coverImageUrl: imageUrl });
            return { url: imageUrl };
        } catch (err: any) {
            this.setStatus(err.statusCode || 500);
            throw err;
        }
    }

    @Patch('{id}/like')
    public async toggleLike(
        @Path() id: string,
        @Query() userId: string
    ): Promise<{ liked: boolean }> {
        try {
            const isLiked = await this.service.toggleLike(id, userId);
            return { liked: isLiked };
        } catch (err: any) {
            this.setStatus(err.statusCode || 500);
            throw err;
        }
    }

    @Patch('{id}/view')
    public async incrementViews(@Path() id: string): Promise<void> {
        try {
            await this.service.incrementViews(id);
            this.setStatus(204);
        } catch (err: any) {
            this.setStatus(err.statusCode || 500);
            throw err;
        }
    }

    @Patch('{id}/cooked')
    public async incrementCooked(@Path() id: string): Promise<void> {
        try {
            await this.service.incrementCooked(id);
            this.setStatus(204);
        } catch (err: any) {
            this.setStatus(err.statusCode || 500);
            throw err;
        }
    }

    @Get('ai-search')
    public async aiSearch(
        @Query('query') query: string,
        @Query() recipeBookId?: string,
        @Query() userId?: string
    ): Promise<RecipeDTO[]> {
        try {
            const finalUserId = userId || 'anonymous';
            return await this.service.searchRecipesWithAI(query, finalUserId, recipeBookId || '');
        } catch (err: any) {
            this.setStatus(500);
            throw err;
        }
    }

    @Post('createRecipe')
    public async createRecipe(@Body() body: RecipeDTO): Promise<RecipeDTO> {
        try {
            const userId = body.createdBy;
            if (!userId) throw new AppError(400, 'createdBy is required');
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
            if (!recipe) throw new AppError(404, 'Recipe not found');
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
            if (!recipe) throw new AppError(404, 'Recipe not found');
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
            if (!recipe) throw new AppError(404, 'Recipe not found');
            this.setStatus(204);
            return;
        } catch (err: any) {
            this.setStatus(err.statusCode || 500);
            throw err;
        }
    }
}