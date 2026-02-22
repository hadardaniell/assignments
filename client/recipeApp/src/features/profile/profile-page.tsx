import { useEffect, useState } from "react";
import { Box } from "@mui/material";
import { ProfileCard } from "./profile-card";
import { useAuth } from "../../context/auth.context";
import { recipesApi } from "../../data-access/recipe.api";
import { useNavigate } from "react-router-dom";
import type { RecipeCardModel } from "../../shared/recipe-card";
import { ProfileRecipesTabs } from "./profiles-recipes-tabs";
import { likesApi } from "../../data-access/likes.api";

export function ProfilePage() {
    const { user, setUser } = useAuth();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [myRecipes, setMyRecipes] = useState<RecipeCardModel[]>([]);
    const [likedRecipes, setLikedRecipes] = useState<RecipeCardModel[]>([]);

    useEffect(() => {
        if (!user?._id) return;

        (async () => {
            setLoading(true);
            try {
                const myRes = await recipesApi.getRecipesByUser(user._id);
                setMyRecipes(myRes ?? []);

                const likesRes = await likesApi.getUserLikes(user._id);
                const ids = Array.from(
                    new Set(likesRes.map((l: any) => l.recipeId).filter(Boolean))
                );

                if (ids.length === 0) {
                    setLikedRecipes([]);
                } else {
                    const likedRes = await recipesApi.getRecipesByIds(ids);
                    setLikedRecipes(likedRes ?? []);
                }
            } catch (e) {
                console.error("failed to load profile recipes", e);
            } finally {
                setLoading(false);
            }
        })();
    }, [user?._id]);

    const onLiked = (recipe: RecipeCardModel) => {
        setLikedRecipes((prev) => {
            if (prev.some((r) => r.Id === recipe.Id)) return prev;
            const updatedRecipe = { ...recipe, isUserLiked: true };
            return [updatedRecipe, ...prev];
        });

        setMyRecipes((prev) =>
            prev.map((r) => (r.Id === recipe.Id ? { ...r, isUserLiked: true } : r))
        );
    };

    const onUnliked = (recipeId: string) => {
        setLikedRecipes((prev) => prev.filter((r) => r.Id !== recipeId));

        setMyRecipes((prev) =>
            prev.map((r) => (r.Id === recipeId ? { ...r, isUserLiked: false } : r))
        );
    };

    if (!user) return <Box dir="rtl">לא מחובר/ת</Box>;

    const onRecipeClick = (id: string) => navigate("/recipe/" + id);

    return (
        <Box dir="rtl" sx={{ p: 3 }}>
            <ProfileCard user={user} recipeCount={myRecipes.length} onUserUpdated={(updated) => setUser(updated)} />

            <ProfileRecipesTabs
                myRecipes={myRecipes}
                likedRecipes={likedRecipes}
                onRecipeClick={onRecipeClick}
                onLiked={onLiked}
                onUnliked={onUnliked}
            />
        </Box>
    );
}