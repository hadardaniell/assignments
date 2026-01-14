import type { RecipeCardModel } from "../features/feed/recipe-card";
import { getApi } from "../services";

export const recipesApi = {
  getRecipesByUser: (userId: string) =>
    getApi().get<RecipeCardModel[]>(`/recipes/getRecipesByUser/${userId}`),
};
