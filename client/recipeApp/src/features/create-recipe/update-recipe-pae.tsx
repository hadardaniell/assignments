import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, CircularProgress, Typography } from "@mui/material";
import type { DraftState, RecipeDTO } from "../../types/recipe.types";
import { recipesApi } from "../../data-access/recipe.api";
import { RecipeFormStepper } from "./recipe-form-stepper"; // הקומפוננטה החדשה שניצור

function dtoToDraft(r: RecipeDTO): DraftState {
  return {
    recipeBookId: r.recipeBookId ?? "",
    title: r.title ?? "",
    description: r.description ?? "",
    categories: r.categories ?? [],
    prepTimeMinutes: r.prepTimeMinutes?.toString() ?? "",
    cookTimeMinutes: r.cookTimeMinutes?.toString() ?? "",
    difficulty: (r.difficulty as any) ?? "",
    coverImageUrl: r.coverImageUrl ?? "",
    ingredients:
      r.ingredients?.length
        ? r.ingredients.map((i: any) => ({
            name: i.name ?? "",
            quantity: i.quantity ?? undefined,
            unit: i.unit ?? "",
            notes: i.notes ?? null,
          }))
        : [{ name: "", quantity: undefined, unit: "", notes: null }],
    steps:
      r.steps?.length
        ? r.steps
            .slice()
            .sort((a: any, b: any) => (a.index ?? 0) - (b.index ?? 0))
            .map((s: any) => ({
              instruction: s.instruction ?? "",
              durationMinutes: s.durationMinutes ?? undefined,
            }))
        : [{ instruction: "", durationMinutes: undefined }],
    notes: r.notes ?? "",
  };
}

export function EditRecipePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [recipe, setRecipe] = useState<RecipeDTO | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    (async () => {
      setLoading(true);
      setError(null);
      try {
        const r = await recipesApi.getRecipeById(id);
        setRecipe(r);
      } catch (e: any) {
        setError(e?.message ?? "שגיאה בטעינת המתכון");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const initialDraft = useMemo(() => (recipe ? dtoToDraft(recipe) : null), [recipe]);

  if (loading) {
    return (
      <Box sx={{ display: "grid", placeItems: "center", py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !recipe || !initialDraft) {
    return (
      <Box sx={{ py: 6 }}>
        <Typography color="error">{error ?? "מתכון לא נמצא"}</Typography>
      </Box>
    );
  }

  return (
    <RecipeFormStepper
      mode="edit"
      recipeId={(recipe as any).Id ?? (recipe as any)._id ?? id!}
      initialDraft={initialDraft}
      onDone={() => navigate(`/recipe/${(recipe as any).Id ?? (recipe as any)._id ?? id!}`)}
    />
  );
}
