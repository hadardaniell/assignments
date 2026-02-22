import type { RecipeCardModel } from "../../shared/recipe-card";
import { RecipesGrid } from "./recipes-grid";

type Props = {
    recipes: RecipeCardModel[];
    onRecipeClick?: (id: string) => void;

    onLiked?: (recipe: RecipeCardModel) => void;
    onUnliked?: (recipeId: string) => void;
};

export function LikedRecipesGrid({ recipes, onRecipeClick, onLiked, onUnliked }: Props) {
    return (
        <RecipesGrid
            title="אהבתי"
            emptyTitle="אין עדיין מתכונים שאהבת"
            emptySubtitle="תני לייק למתכונים כדי שישמרו לך כאן."
            emptyCtaLabel="למצוא מתכונים"
            emptyCtaTo="/recipes" // תעדכני לנתיב החיפוש שלך אם שונה
            recipes={recipes}
            onRecipeClick={onRecipeClick}
            onLiked={onLiked}
            onUnliked={onUnliked}
        />
    );
}