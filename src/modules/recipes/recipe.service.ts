import { Types } from 'mongoose';
import { Recipe } from './recpies.model';
import { RecipeRepo } from './recipe.repo';
import {
    RecipeDTO,
    UpdateRecipeDTO,
    RecipeFilterDTO
} from './recipe.types';

export class RecipeService {
    constructor(private readonly recipeRepo: RecipeRepo) { }

    async createRecipe(userId: string, input: RecipeDTO): Promise<Recipe> {
        const createdBy = new Types.ObjectId(userId);

        return this.recipeRepo.create({
            recipeBookId: new Types.ObjectId(input.recipeBookId),
            createdBy,
            originalRecipeId: input.originalRecipeId
                ? new Types.ObjectId(input.originalRecipeId)
                : null,
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
            status: input.status ?? 'draft'
        } as any);
    }

    async getRecipeById(id: string): Promise<Recipe | null> {
        return this.recipeRepo.findById(id);
    }

    async getRecipesByUserId(userId: string) {
        return this.recipeRepo.findMany({ createdBy: userId });
    }

    async listRecipes(filter: RecipeFilterDTO): Promise<Recipe[]> {
        return this.recipeRepo.findMany(filter);
    }

    async updateRecipe(
        id: string,
        userId: string,
        input: UpdateRecipeDTO
    ): Promise<Recipe | null> {
        const update: any = { ...input };

        if (input.recipeBookId) {
            update.recipeBookId = new Types.ObjectId(input.recipeBookId);
        }
        if (input.originalRecipeId) {
            update.originalRecipeId = new Types.ObjectId(input.originalRecipeId);
        }
        if (input.sourceId) {
            update.sourceId = new Types.ObjectId(input.sourceId);
        }

        return this.recipeRepo.updateById(id, update);
    }

    async deleteRecipe(id: string): Promise<Recipe | null> {
        return this.recipeRepo.deleteById(id);
    }
}
