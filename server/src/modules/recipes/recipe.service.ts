import { Types } from 'mongoose';
import { Recipe, RecipeModel } from './recpies.model';
import { RecipeDTO, UpdateRecipeDTO, RecipeFilterDTO } from './recipe.types';
import { toRecipeDTO } from './recipe.mapper';
import { RecipeRepo } from './resipes.repo';
import { LikesRepo } from '../likes/likes.repo';
import { CommentsDAL } from '../comments/comments.dal';
import { AIService } from './ai.service';
import { AppError } from '../../common';
import fs from 'fs';
import path from 'path';

export class RecipeService {
    private readonly recipeRepo: RecipeRepo = new RecipeRepo();
    private readonly likesRepo: LikesRepo = new LikesRepo();
    private readonly commentsDal: CommentsDAL = new CommentsDAL();
    private readonly aiService: AIService = new AIService();

    private normalizeDifficulty(diff: string): string {
        const val = diff?.toLowerCase().trim();
        if (val === 'קל' || val === 'easy') return 'easy';
        if (val === 'בינוני' || val === 'medium') return 'medium';
        if (val === 'קשה' || val === 'hard') return 'hard';
        return 'easy';
    }

    async createRecipe(userId: string, input: RecipeDTO): Promise<RecipeDTO> {
        const createdBy = new Types.ObjectId(userId);

        const recipe = await this.recipeRepo.create({
            recipeBookId: input.recipeBookId ? new Types.ObjectId(input.recipeBookId) : null,
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
            status: input.status ?? 'draft'
        } as Partial<Recipe>);

        const dto = toRecipeDTO(recipe);
        dto.likesCount = await this.likesRepo.countByRecipe(recipe._id);
        dto.commentsCount = await this.commentsDal.countByRecipeId(recipe._id);
        return dto;
    }

    async generateAndSaveAIRecipes(query: string, viewerUserId?: string): Promise<RecipeDTO[]> {
        const aiRecipes = await this.aiService.generateFullRecipe(query);
        if (!aiRecipes) return [];

        const recipesToSave = aiRecipes.map((r: any) => {
            const { Id, id, _id, ...rest } = r;
            return {
                ...rest,
                difficulty: this.normalizeDifficulty(rest.difficulty),
                createdBy: new Types.ObjectId(process.env.AI_USER_ID),
                sourceType: 'ai',
                status: 'published',
                createdAt: new Date(),
                updatedAt: new Date()
            };
        });

        const savedRecipes = await RecipeModel.insertMany(recipesToSave);
        
        const savedIds = savedRecipes.map(r => r._id.toString());
        return this.getRecipesByIds(savedIds, viewerUserId);
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
            console.log(viewerObjectId);
            console.log(userId);
            dto.isUserLiked = viewerObjectId
                ? await this.likesRepo.exists(viewerObjectId, recipe._id)
                : false;
            console.log(dto.isUserLiked);
        } else {
            dto.isUserLiked = false;
        }

        return dto;
    }

    async getRecipesByUserId(userId: string): Promise<RecipeDTO[]> {
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

    async updateRecipe(id: string, userId: string, input: UpdateRecipeDTO): Promise<RecipeDTO | null> {
        const update: any = { ...input };
        if (input.recipeBookId) update.recipeBookId = new Types.ObjectId(input.recipeBookId);
        if (input.originalRecipeId) update.originalRecipeId = new Types.ObjectId(input.originalRecipeId);
        if (input.sourceId) update.sourceId = new Types.ObjectId(input.sourceId);

        const recipe = await this.recipeRepo.updateById(id, update);
        if (!recipe) return null;

        return this.getRecipeById(id, userId);
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
        const targetDir = path.join(process.cwd(), "uploads", "recipe_images");
        if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });
        const fileName = `${recipeId}${path.extname(file.originalname) || ".jpg"}`;
        const targetPath = path.join(targetDir, fileName);

        if (fs.existsSync(targetPath)) fs.unlinkSync(targetPath);
        if (file.path && fs.existsSync(file.path)) {
            fs.copyFileSync(file.path, targetPath);
            fs.unlinkSync(file.path);
        } else if ((file as any).buffer) {
            fs.writeFileSync(targetPath, (file as any).buffer);
        } else {
            throw new AppError(500, "Temporary file error");
        }

        const imageUrl = `/uploads/recipe_images/${fileName}`;
        await this.recipeRepo.updateById(recipeId, { coverImageUrl: imageUrl });
        return imageUrl;
    }

    async getRecipesByIds(ids: string[], userId?: string): Promise<RecipeDTO[]> {
        const recipes = await this.recipeRepo.findByIds(ids);

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
}