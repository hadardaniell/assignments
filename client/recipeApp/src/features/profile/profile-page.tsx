import { useEffect, useMemo, useState } from "react";
import {
    Avatar,
    Box,
    Card,
    CardContent,
    IconButton,
    Typography,
    Grid,
    Divider,
    Button,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";

import { RecipeCard, type RecipeCardModel } from "../feed/recipe-card";
import { RecipesGrid } from "./recipes-grid";
import { ProfileCard } from "./profile-card";
import type { User } from "../auth/auth.types";
import { useAuth } from "../../context/auth.context";
import { recipesApi } from "../../data-access/recipe.api";

export function ProfilePage() {
    const { user } = useAuth();
    // const [recipes, setRecipes] = useState<RecipeCardModel[]>([]);
    const [loading, setLoading] = useState(false);
    const [recipes, setRecipes] = useState<RecipeCardModel[]>([]);

    useEffect(() => {
        if (!user?._id) return;

        (async () => {
            setLoading(true);
            try {
                const data = await recipesApi.getRecipesByUser(user._id);
                setRecipes(data);
            } catch (e) {
                console.error("failed to load user recipes", e);
            } finally {
                setLoading(false);
            }
        })();
    }, [user?._id]);

    if (!user) {
        return <Box dir="rtl">לא מחובר/ת</Box>;
    }
    const recipeCount = recipes.length;

    const onRecipeClick = (id: string) => {
        console.log("open recipe", id);
    };

    return (
        <Box dir="rtl" sx={{ p: 3 }}>
            <ProfileCard user={user!} recipeCount={recipeCount} />
            <RecipesGrid recipes={recipes} onRecipeClick={(id) => onRecipeClick(id)} />
        </Box>
    );
}
