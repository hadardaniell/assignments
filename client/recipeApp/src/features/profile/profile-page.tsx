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

import { RecipeCard, type RecipeCardModel } from "../../shared/recipe-card";
import { RecipesGrid } from "./recipes-grid";
import { ProfileCard } from "./profile-card";
import type { User } from "../../types/auth.types";
import { useAuth } from "../../context/auth.context";
import { recipesApi } from "../../data-access/recipe.api";
import { useNavigate } from "react-router-dom";

export function ProfilePage() {
    const { user } = useAuth();
    const { setUser } = useAuth();
    const navigate = useNavigate();

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
        navigate('/recipe/' + id)
    };

    return (
        <Box dir="rtl" sx={{ p: 3 }}>
            <ProfileCard
                user={user}
                recipeCount={recipeCount}
                onUserUpdated={(updated) => setUser(updated)}
            />
            <RecipesGrid recipes={recipes} onRecipeClick={(id) => onRecipeClick(id)} />
        </Box>
    );
}
