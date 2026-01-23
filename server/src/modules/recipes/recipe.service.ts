import { Types } from 'mongoose';
import { Recipe } from './recpies.model';
import {
    RecipeDTO,
    UpdateRecipeDTO,
    RecipeFilterDTO
} from './recipe.types';
import { toRecipeDTO } from './recipe.mapper';
import { RecipeRepo } from './resipes.repo';
import { LikesRepo } from '../likes/likes.repo';
import { CommentsDAL } from '../comments/comments.dal';

export class RecipeService {
    private readonly recipeRepo: RecipeRepo = new RecipeRepo();
    private readonly likesRepo: LikesRepo = new LikesRepo();
    private readonly commentsDal: CommentsDAL = new CommentsDAL();

    async createRecipe(userId: string, input: RecipeDTO): Promise<RecipeDTO> {
        const createdBy = new Types.ObjectId(userId);

        const recipe = await this.recipeRepo.create({
            recipeBookId: input.recipeBookId ? new Types.ObjectId(input.recipeBookId) : null,
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
        } as Partial<Recipe>);
        
        const dto = toRecipeDTO(recipe);
        dto.likesCount = await this.likesRepo.countByRecipe(recipe._id);
        dto.commentsCount = await this.commentsDal.countByRecipeId(recipe._id);
        return dto;
    }

    async getRecipeById(id: string): Promise<RecipeDTO | null> {
        const recipe = await this.recipeRepo.findById(id);
        if (!recipe) return null;

        const dto = toRecipeDTO(recipe);
        const recipeId = new Types.ObjectId(id);
        dto.likesCount = await this.likesRepo.countByRecipe(recipeId);
        dto.commentsCount = await this.commentsDal.countByRecipeId(recipeId);
        return dto;
    }

    async getRecipesByUserId(userId: string) {
        const recipes = await this.recipeRepo.findMany({ createdBy: userId });
        return Promise.all(recipes.map(async (recipe) => {
            const dto = toRecipeDTO(recipe);
            dto.likesCount = await this.likesRepo.countByRecipe(recipe._id);
            dto.commentsCount = await this.commentsDal.countByRecipeId(recipe._id);
            return dto;
        }));
    }

    async listRecipes(filter: RecipeFilterDTO): Promise<RecipeDTO[]> {
        const recipes = await this.recipeRepo.findMany(filter);
        return Promise.all(recipes.map(async (recipe) => {
            const dto = toRecipeDTO(recipe);
            dto.likesCount = await this.likesRepo.countByRecipe(recipe._id);
            dto.commentsCount = await this.commentsDal.countByRecipeId(recipe._id);
            return dto;
        }));
    }

    async updateRecipe(
        id: string,
        userId: string,
        input: UpdateRecipeDTO
    ): Promise<RecipeDTO | null> {
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

        const recipe = await this.recipeRepo.updateById(id, update);
        if (!recipe) return null;

        const dto = toRecipeDTO(recipe);
        dto.likesCount = await this.likesRepo.countByRecipe(recipe._id);
        dto.commentsCount = await this.commentsDal.countByRecipeId(recipe._id);
        return dto;
    }

    async deleteRecipe(id: string): Promise<RecipeDTO | null> {
        const recipe = await this.recipeRepo.deleteById(id);
        if (!recipe) return null;

        const dto = toRecipeDTO(recipe);
        dto.likesCount = await this.likesRepo.countByRecipe(recipe._id);
        dto.commentsCount = await this.commentsDal.countByRecipeId(recipe._id);
        return dto;
    }
}