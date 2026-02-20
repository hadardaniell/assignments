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
import fs from 'fs';
import path from 'path';
import { AppError } from '../../common';

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

    async getRecipeById(id: string, userId?: string | null): Promise<RecipeDTO | null> {
        const recipe = await this.recipeRepo.findById(id);
        if (!recipe) return null;

        const dto = toRecipeDTO(recipe);
        const recipeId = new Types.ObjectId(id);

        dto.likesCount = await this.likesRepo.countByRecipe(recipeId);
        dto.commentsCount = await this.commentsDal.countByRecipeId(recipeId);

        if (userId) {
            const viewerObjectId = userId ? new Types.ObjectId(userId) : null;
            console.log(viewerObjectId)
            console.log(userId)
            dto.isUserLiked = viewerObjectId
                ? await this.likesRepo.exists(viewerObjectId, recipe._id)
                : false;

                console.log(dto.isUserLiked)


        } else {
            dto.isUserLiked = false;
        }

        return dto;
    }


    async getRecipesByUserId(userId: string) {
        const recipes = await this.recipeRepo.findMany({ createdBy: userId });

        const viewerObjectId = userId ? new Types.ObjectId(userId) : null;

        return Promise.all(
            recipes.map(async (recipe) => {
                const dto = toRecipeDTO(recipe);

                dto.likesCount = await this.likesRepo.countByRecipe(recipe._id);
                dto.commentsCount = await this.commentsDal.countByRecipeId(recipe._id);

                dto.isUserLiked = viewerObjectId
                    ? await this.likesRepo.exists(viewerObjectId, recipe._id)
                    : false;

                return dto;
            })
        );
    }


    async listRecipes(filter: RecipeFilterDTO, viewerUserId?: string): Promise<RecipeDTO[]> {
        const recipes = await this.recipeRepo.findMany(filter);

        const viewerObjectId = viewerUserId ? new Types.ObjectId(viewerUserId) : null;
        return Promise.all(
            recipes.map(async (recipe) => {
                const dto = toRecipeDTO(recipe);

                dto.likesCount = await this.likesRepo.countByRecipe(recipe._id);
                dto.commentsCount = await this.commentsDal.countByRecipeId(recipe._id);

                dto.isUserLiked = viewerObjectId
                    ? await this.likesRepo.exists(viewerObjectId, recipe._id)
                    : false;

                return dto;
            })
        );
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

    async uploadRecipeImage(recipeId: string, file: Express.Multer.File): Promise<string> {
        const targetDir = path.join(process.cwd(), 'uploads', 'recipe_images');

        if (!fs.existsSync(targetDir)) {
            fs.mkdirSync(targetDir, { recursive: true });
        }

        const fileName = `${Date.now()}-${file.originalname}`;
        const targetPath = path.join(targetDir, fileName);

        if (fs.existsSync(file.path)) {
            fs.copyFileSync(file.path, targetPath);
            fs.unlinkSync(file.path);
        } else {
            throw new AppError(500, 'Temporary file error');
        }

        const imageUrl = `/uploads/recipe_images/${fileName}`;
        const updatedRecipe = await this.updateRecipe(recipeId, '', { coverImageUrl: imageUrl });

        if (!updatedRecipe) {
            throw new AppError(404, 'Recipe not found');
        }

        return imageUrl;
    }
}