import type { RecipeDTO, RecipeSearchParams } from "../types/recipe.types";
import type { RecipeCardModel } from "../shared/recipe-card";
import { getApi } from "../services";

export const recipesApi = {
  getRecipesByUser: (userId: string) =>
    getApi().get<RecipeCardModel[]>(`/recipes/getRecipesByUser/${userId}`),
  createRecipe: (body: RecipeDTO) => getApi().post<RecipeDTO>("/recipes/createRecipe", body),
  getRecipeById: (id: string) => getApi().get<RecipeDTO>(`/recipes/getRecipeById/${id}`),
  deleteRecipeById: (id: string) => getApi().delete<void>(`/recipes/deleteRecipe/${id}`),
  getRecipes: (params: Partial<RecipeSearchParams>) =>
    getApi().get<RecipeDTO[]>(`/recipes/getRecipes`,
      params,
    ),
  updateRecipe: (id: string, body: Partial<RecipeDTO>) =>
    getApi().put<RecipeDTO>(`/recipes/updateRecipe/${id}`, body),
};
