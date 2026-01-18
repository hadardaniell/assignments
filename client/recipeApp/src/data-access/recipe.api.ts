import type { RecipeDTO } from "../features/create-recipe/recipe.types";
import type { RecipeCardModel } from "../features/feed/recipe-card";
import { getApi } from "../services";

export const recipesApi = {
  getRecipesByUser: (userId: string) =>
    getApi().get<RecipeCardModel[]>(`/recipes/getRecipesByUser/${userId}`),
  createRecipe: (body: RecipeDTO) => getApi().post<RecipeDTO>("/recipes/createRecipe", body),
  getRecipeById: (id: string) => getApi().get<RecipeDTO>(`/recipes/getRecipeById/${id}`),
  deleteRecipeById: (id: string) => getApi().delete<void>(`/recipes/deleteRecipe/${id}`),
};
