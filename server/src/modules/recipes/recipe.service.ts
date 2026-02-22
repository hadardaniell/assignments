import { Types } from 'mongoose';
import { Recipe, RecipeModel } from './recpies.model';
import { RecipeDTO, UpdateRecipeDTO, RecipeFilterDTO } from './recipe.types';
import { toRecipeDTO } from './recipe.mapper';
import { RecipeRepo } from './resipes.repo';
import { LikesRepo } from '../likes/likes.repo';
import { AIService } from './ai.service';
import { AppError } from '../../common';
import fs from 'fs';
import path from 'path';

export class RecipeService {
    private readonly recipeRepo: RecipeRepo = new RecipeRepo();
    private readonly likesRepo: LikesRepo = new LikesRepo();
    private readonly aiService: AIService = new AIService();

    private normalizeDifficulty(diff: string): string {
        const val = diff?.toLowerCase().trim();
        if (val === 'קל' || val === 'easy') return 'easy';
        if (val === 'בינוני' || val === 'medium') return 'medium';
        if (val === 'קשה' || val === 'hard') return 'hard';
        return 'easy';
    }

    // יצירת מתכון ידני - קריטי לבדיקות האינטגרציה
    async createRecipe(userId: string, input: RecipeDTO): Promise<RecipeDTO> {
        const recipe = await this.recipeRepo.create({
            ...input,
            createdBy: new Types.ObjectId(userId),
            recipeBookId: input.recipeBookId ? new Types.ObjectId(input.recipeBookId) : null,
            originalRecipeId: input.originalRecipeId ? new Types.ObjectId(input.originalRecipeId) : null,
        } as Partial<Recipe>);
        
        return toRecipeDTO(recipe);
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

        try {
            const savedRecipes = await RecipeModel.insertMany(recipesToSave);
            const viewerObjectId = viewerUserId ? new Types.ObjectId(viewerUserId) : null;

            return Promise.all(savedRecipes.map(async (recipe) => {
                const dto = toRecipeDTO(recipe);
                dto.isUserLiked = viewerObjectId ? await this.likesRepo.exists(viewerObjectId, recipe._id) : false;
                return dto;
            }));
        } catch (err: any) {
            console.error("Database Save Error:", err.message);
            throw new AppError(500, `שגיאת שמירה בבסיס הנתונים: ${err.message}`);
        }
    }

    async getRecipeById(id: string, userId?: string | null): Promise<RecipeDTO | null> {
        const recipe = await this.recipeRepo.findById(id);
        if (!recipe) return null;
        const dto = toRecipeDTO(recipe);
        if (userId) {
            dto.isUserLiked = await this.likesRepo.exists(new Types.ObjectId(userId), recipe._id);
        }
        return dto;
    }

    async listRecipes(filter: RecipeFilterDTO, viewerUserId?: string): Promise<RecipeDTO[]> {
        const recipes = await this.recipeRepo.findMany(filter);
        const viewerObjectId = viewerUserId ? new Types.ObjectId(viewerUserId) : null;
        return Promise.all(recipes.map(async (recipe) => {
            const dto = toRecipeDTO(recipe);
            dto.isUserLiked = viewerObjectId ? await this.likesRepo.exists(viewerObjectId, recipe._id) : false;
            return dto;
        }));
    }

    async updateRecipe(id: string, userId: string, input: UpdateRecipeDTO): Promise<RecipeDTO | null> {
        // המרה ל-ObjectId במידת הצורך עבור שדות מיוחדים
        const updateData: any = { ...input };
        if (input.recipeBookId) updateData.recipeBookId = new Types.ObjectId(input.recipeBookId);
        
        const recipe = await this.recipeRepo.updateById(id, updateData);
        return recipe ? toRecipeDTO(recipe) : null;
    }

    async deleteRecipe(id: string): Promise<RecipeDTO | null> {
        const recipe = await this.recipeRepo.deleteById(id);
        return recipe ? toRecipeDTO(recipe) : null;
    }

    async getRecipesByUserId(userId: string) {
        const recipes = await this.recipeRepo.findMany({ createdBy: userId });
        return Promise.all(recipes.map(async (r) => toRecipeDTO(r)));
    }

    // העלאת תמונות - חובה עבור הבדיקות
    async uploadRecipeImage(recipeId: string, file: Express.Multer.File): Promise<string> {
        const targetDir = path.join(process.cwd(), "uploads", "recipe_images");

        if (!fs.existsSync(targetDir)) {
            fs.mkdirSync(targetDir, { recursive: true });
        }

        const ext = path.extname(file.originalname) || ".jpg";
        const fileName = `${recipeId}${ext}`;
        const targetPath = path.join(targetDir, fileName);

        if (file.path && fs.existsSync(file.path)) {
            fs.copyFileSync(file.path, targetPath);
            fs.unlinkSync(file.path);
        } else if ((file as any).buffer) {
            fs.writeFileSync(targetPath, (file as any).buffer);
        } else {
            throw new AppError(500, "שגיאה בעיבוד קובץ התמונה");
        }

        const imageUrl = `/uploads/recipe_images/${fileName}`;
        await this.recipeRepo.updateById(recipeId, { coverImageUrl: imageUrl });

        return imageUrl;
    }
}