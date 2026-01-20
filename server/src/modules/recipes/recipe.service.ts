import { Types } from 'mongoose';
import { RecipeModel, Recipe } from './recpies.model';
import { LikeModel } from '../likes/like.model'; 
import { RecipeDTO, UpdateRecipeDTO, RecipeFilterDTO, PaginatedRecipes } from './recipe.types';
import { toRecipeDTO } from './recipe.mapper';
import { RecipeRepo } from './resipes.repo';
import { AIService } from './ai.service';
import { AppError } from '../../common';

export class RecipeService {
    private readonly recipeRepo: RecipeRepo = new RecipeRepo();
    private readonly aiService: AIService = new AIService();

    async listRecipes(
        filter: RecipeFilterDTO, 
        page: number = 1, 
        limit: number = 10
    ): Promise<PaginatedRecipes> {
        const skip = (page - 1) * limit;

        const query: any = {};
        if (filter.recipeBookId) query.recipeBookId = new Types.ObjectId(filter.recipeBookId);
        if (filter.status) query.status = filter.status;
        if (filter.difficulty) query.difficulty = filter.difficulty;
        if (filter.search) {
            query.title = { $regex: filter.search, $options: 'i' };
        }

        const [recipes, total] = await Promise.all([
            RecipeModel.find(query)
                .skip(skip)
                .limit(limit)
                .sort({ createdAt: -1 }),
            RecipeModel.countDocuments(query)
        ]);

        return {
            recipes: recipes.map(toRecipeDTO),
            total,
            page,
            totalPages: Math.ceil(total / limit)
        };
    }

    async toggleLike(recipeId: string, userId: string): Promise<boolean> {
        const recipe = await RecipeModel.findById(recipeId);
        if (!recipe) throw new AppError(404, 'Recipe not found');

        const userObjectId = new Types.ObjectId(userId);
        const recipeObjectId = new Types.ObjectId(recipeId);

        const existingLike = await LikeModel.findOne({ userId: userObjectId, recipeId: recipeObjectId });

        if (existingLike) {
            await LikeModel.deleteOne({ _id: existingLike._id });
            await RecipeModel.findByIdAndUpdate(recipeId, { 
                $inc: { "stats.likesCount": -1 } 
            });
            return false;
        } else {
            await LikeModel.create({ userId: userObjectId, recipeId: recipeObjectId });
            await RecipeModel.findByIdAndUpdate(recipeId, { 
                $inc: { "stats.likesCount": 1 } 
            });
            return true;
        }
    }

    async incrementViews(recipeId: string): Promise<void> {
        await RecipeModel.findByIdAndUpdate(recipeId, {
            $inc: { "stats.viewsCount": 1 }
        });
    }

    async incrementCooked(recipeId: string): Promise<void> {
        await RecipeModel.findByIdAndUpdate(recipeId, {
            $inc: { "stats.cookedCount": 1 }
        });
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
                originalRecipeId: null,
                coverImageUrl: null,
                stats: { likesCount: 0, viewsCount: 0, cookedCount: 0 }
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
            stats: { likesCount: 0, viewsCount: 0, cookedCount: 0, ratingsCount: 0, avgRating: 0 }
        } as Partial<Recipe>);
        return toRecipeDTO(recipe);
    }

    async getRecipeById(id: string): Promise<RecipeDTO | null> {
        const recipe = await this.recipeRepo.findById(id);
        return recipe ? toRecipeDTO(recipe) : null;
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