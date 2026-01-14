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

    // const recipes: RecipeCardModel[] = useMemo(
    //     () => [
    //         {
    //             _id: "r1",
    //             title: "פסטה שמנת פטריות",
    //             description: "מהיר, טעים, מנחם",
    //             imageUrl: "https://via.placeholder.com/600x400?text=Pasta",
    //             createdAt: new Date(),
    //             tags: ["איטלקי"],
    //         },
    //         {
    //             _id: "r2",
    //             title: "שקשוקה ביתית",
    //             description: "עם פלפל חריף ובצל",
    //             imageUrl: "https://via.placeholder.com/600x400?text=Shakshuka",
    //             createdAt: new Date(),
    //             tags: ["ישראלי"],
    //         },
    //     ],
    //     []
    // );

    const recipeCount = recipes.length;

    // const [isEditing, setIsEditing] = useState(false);

    // const onEdit = () => setIsEditing(true);

    const onRecipeClick = (id: string) => {
        console.log("open recipe", id);
    };

    return (
        <Box dir="rtl">
            <ProfileCard user={user!} recipeCount={recipeCount} />
            <RecipesGrid recipes={recipes} onRecipeClick={(id) => onRecipeClick(id)} />
        </Box>
    );
}
