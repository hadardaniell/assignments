import { Box, Tab, Tabs } from "@mui/material";
import { useState } from "react";
import type { RecipeCardModel } from "../../shared/recipe-card";
import { RecipesGrid } from "./recipes-grid";
import { LikedRecipesGrid } from "./liked-recipes-grid";

type Props = {
    myRecipes: RecipeCardModel[];
    likedRecipes: RecipeCardModel[];
    onRecipeClick?: (id: string) => void;

    onLiked?: (recipe: RecipeCardModel) => void;
    onUnliked?: (recipeId: string) => void;
};

export function ProfileRecipesTabs({ myRecipes, likedRecipes, onRecipeClick, onLiked, onUnliked }: Props) {
    const [tab, setTab] = useState<0 | 1>(0);

    return (
        <Box sx={{ mt: 2 }}>
            <Tabs
                value={tab}
                onChange={(_, v) => setTab(v)}
                variant="fullWidth"
                sx={{
                    mb: 2,
                    "& .MuiTab-root": { fontWeight: 800 },
                }}
            >
                <Tab label={`המתכונים שלי (${myRecipes.length})`} sx={{
                    maxWidth: "fit-content",
                    margin: "0 0.5em"
                }} />
                <Tab label={`אהבתי (${likedRecipes.length})`} sx={{ maxWidth: "fit-content", margin: "0 0.5em" }} />
            </Tabs>

            {tab === 0 ? (
                <RecipesGrid recipes={myRecipes} onRecipeClick={onRecipeClick} 
                onLiked={onLiked} onUnliked={onUnliked} />
            ) : (
                <LikedRecipesGrid recipes={likedRecipes} onRecipeClick={onRecipeClick} 
                onLiked={onLiked} onUnliked={onUnliked} />
            )}
        </Box>
    );
}