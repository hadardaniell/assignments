import { RecipeDTO } from './recipe.types';

export function toRecipeDTO(recipe: any): RecipeDTO {
  const creatorName = 
    recipe.creatorName || 
    (recipe.createdBy?.firstName ? `${recipe.createdBy.firstName} ${recipe.createdBy.lastName || ''}`.trim() : null) ||
    recipe.createdBy?.name || 
    null;

  const data = recipe.toObject ? recipe.toObject() : recipe;

  return {
    Id: data._id?.toString() || data.Id || data.id,
    recipeBookId: data.recipeBookId?.toString() || data.recipeBookId,
    createdBy: data.createdBy?._id?.toString() || data.createdBy?.toString() || data.createdBy,
    creatorName: creatorName,
    title: data.title,
    description: data.description ?? null,
    categories: data.categories ?? [],
    prepTimeMinutes: data.prepTimeMinutes ?? null,
    cookTimeMinutes: data.cookTimeMinutes ?? null,
    totalTimeMinutes: data.totalTimeMinutes ?? null,
    difficulty: data.difficulty,
    ingredients: data.ingredients ?? [],
    steps: data.steps ?? [],
    notes: data.notes ?? null,
    coverImageUrl: data.coverImageUrl || null,
    sourceType: data.sourceType,
    likesCount: data.likesCount ?? 0,
    commentsCount: data.commentsCount ?? 0,
    createdAt: data.createdAt instanceof Date ? data.createdAt.toISOString() : String(data.createdAt),
    updatedAt: data.updatedAt instanceof Date ? data.updatedAt.toISOString() : (data.updatedAt ?? null),
    isUserLiked: data.isUserLiked ?? false
  };
}