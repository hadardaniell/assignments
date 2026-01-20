import { RecipeDTO } from './recipe.types';

export function toRecipeDTO(recipe: any): RecipeDTO {
  const creatorName = 
    recipe.creatorName || 
    (recipe.createdBy?.firstName ? `${recipe.createdBy.firstName} ${recipe.createdBy.lastName || ''}`.trim() : null) ||
    recipe.createdBy?.name || 
    null;

  return {
    Id: recipe._id?.toString?.() ?? recipe.Id ?? String(recipe._id),
    recipeBookId: recipe.recipeBookId?.toString?.() ?? recipe.recipeBookId,
    createdBy: recipe.createdBy?._id?.toString?.() ?? recipe.createdBy?.toString?.() ?? recipe.createdBy,
    creatorName: creatorName,
    title: recipe.title,
    description: recipe.description ?? null,
    categories: recipe.categories ?? [],
    prepTimeMinutes: recipe.prepTimeMinutes ?? null,
    cookTimeMinutes: recipe.cookTimeMinutes ?? null,
    totalTimeMinutes: recipe.totalTimeMinutes ?? null,
    difficulty: recipe.difficulty,
    ingredients: recipe.ingredients ?? [],
    steps: recipe.steps ?? [],
    notes: recipe.notes ?? null,
    coverImageUrl: recipe.coverImageUrl ?? null,
    sourceType: recipe.sourceType,
    createdAt: recipe.createdAt instanceof Date ? recipe.createdAt.toISOString() : String(recipe.createdAt),
    updatedAt: recipe.updatedAt instanceof Date ? recipe.updatedAt.toISOString() : (recipe.updatedAt ?? null),
  };
}