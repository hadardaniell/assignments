import { getApi } from "../services";
import type { LikeDTO } from "../types/like.types";

export const likesApi = {
    recipeLike: (body: { userId: string; recipeId: string }) =>
        getApi().post<LikeDTO[]>(`/likes/like`, body),

    recipeUnlike: (body: { userId: string; recipeId: string }) =>
        getApi().post<LikeDTO[]>(`/likes/unlike`, body),
}