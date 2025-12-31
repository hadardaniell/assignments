import { RecipeDTO } from './recipe.types';

export function toRecipeDTO(recipe: any): RecipeDTO {
  return {
    Id: recipe._id.toString(),
    recipeBookId: recipe.recipeBookId?.toString?.() ?? recipe.recipeBookId,
    createdBy: recipe.createdBy?.toString?.() ?? recipe.createdBy,
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
    createdAt: recipe.createdAt?.toISOString?.() ?? String(recipe.createdAt),
    updatedAt: recipe.updatedAt?.toISOString?.() ?? null,
  };
}
