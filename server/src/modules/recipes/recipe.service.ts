import { Types } from 'mongoose';
import { RecipeModel, Recipe } from './recpies.model';
import { RecipeDTO, UpdateRecipeDTO, RecipeFilterDTO } from './recipe.types';
import { toRecipeDTO } from './recipe.mapper';
import { RecipeRepo } from './resipes.repo';
import { AIService } from './ai.service';
import { AppError } from '../../common';

export class RecipeService {
    private readonly recipeRepo: RecipeRepo = new RecipeRepo();
    private readonly aiService: AIService = new AIService();

    async toggleLike(recipeId: string, userId: string): Promise<boolean> {
        const recipe = await RecipeModel.findById(recipeId);
        if (!recipe) throw new AppError(404, 'Recipe not found');

        const userObjectId = new Types.ObjectId(userId);
        const hasLiked = recipe.likes?.some(id => id.equals(userObjectId));

        if (hasLiked) {
            await RecipeModel.findByIdAndUpdate(recipeId, { $pull: { likes: userObjectId } });
            return false;
        } else {
            await RecipeModel.findByIdAndUpdate(recipeId, { $addToSet: { likes: userObjectId } });
            return true;
        }
    }

    async searchRecipesWithAI(userQuery: string, userId: string, recipeBookId: string): Promise<RecipeDTO[]> {
        try {
            const generatedRecipes = await this.aiService.generateFullRecipe(userQuery);
            if (!generatedRecipes || !Array.isArray(generatedRecipes)) return [];

            return generatedRecipes.map((recipe, index) => ({
                ...recipe,
                Id: `ai-${Date.now()}-${index}`,
                recipeBookId: recipeBookId,
                createdBy: userId,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                sourceType: 'ai',
                status: 'published',
                likes: [],
                originalRecipeId: null,
                coverImageUrl: null
            }));
        } catch (error) {
            return [];
        }
    }

    async createRecipe(userId: string, input: RecipeDTO): Promise<RecipeDTO> {
        const createdBy = new Types.ObjectId(userId);
        const recipe = await this.recipeRepo.create({
            recipeBookId: input.recipeBookId ? new Types.ObjectId(input.recipeBookId) : undefined,
            createdBy,
            originalRecipeId: input.originalRecipeId ? new Types.ObjectId(input.originalRecipeId) : null,
            title: input.title,
            description: input.description ?? null,
            categories: input.categories ?? [],
            prepTimeMinutes: input.prepTimeMinutes ?? null,
            cookTimeMinutes: input.cookTimeMinutes ?? null,
            totalTimeMinutes: input.totalTimeMinutes ?? null,
            difficulty: input.difficulty ?? 'easy',
            ingredients: input.ingredients,
            steps: input.steps,
            notes: input.notes ?? null,
            coverImageUrl: input.coverImageUrl ?? null,
            sourceType: input.sourceType ?? 'manual',
            sourceId: input.sourceId ? new Types.ObjectId(input.sourceId) : null,
            status: input.status ?? 'draft',
            likes: []
        } as Partial<Recipe>);
        return toRecipeDTO(recipe);
    }

    async getRecipeById(id: string): Promise<RecipeDTO | null> {
        const recipe = await this.recipeRepo.findById(id);
        return recipe ? toRecipeDTO(recipe) : null;
    }

    async listRecipes(filter: RecipeFilterDTO): Promise<RecipeDTO[]> {
        const recipes = await this.recipeRepo.findMany(filter);
        return recipes.map(toRecipeDTO);
    }

    async updateRecipe(id: string, userId: string, input: UpdateRecipeDTO): Promise<RecipeDTO | null> {
        const update: any = { ...input };
        if (input.recipeBookId) update.recipeBookId = new Types.ObjectId(input.recipeBookId);
        const recipe = await this.recipeRepo.updateById(id, update);
        return recipe ? toRecipeDTO(recipe) : null;
    }

    async deleteRecipe(id: string): Promise<RecipeDTO | null> {
        const recipe = await this.recipeRepo.deleteById(id);
        return recipe ? toRecipeDTO(recipe) : null;
    }
}