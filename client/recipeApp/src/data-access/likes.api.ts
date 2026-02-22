import { getApi } from "../services";
import type { LikeDTO } from "../types/like.types";

export const likesApi = {
    recipeLike: (body: { userId: string; recipeId: string }) =>
        getApi().post<LikeDTO[]>(`/likes/like`, body),

    recipeUnlike: (params: { userId: string; recipeId: string }) =>
        getApi().delete<void>(`/likes/unlike`, { params }),

    getUserLikes: (userId: string) =>
        getApi().get<any[]>(`/likes/byUser/${userId}`),
}