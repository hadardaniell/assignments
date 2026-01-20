import { Alert, Box, Container, Grid, Skeleton, Card, Divider } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import type { RecipeDTO, IngredientInput } from "../../types/recipe.types";
import { colors } from "../../assets/_colors";
import { RecipeDetailsCard } from "./recipe-details-card";
import { IngredientsChecklist } from "./integration-checklist";
import { StepsList } from "./steps-list";
import { recipesApi } from "../../data-access/recipe.api";
import { RecipeComments } from "./comments/recipe-comments";
import { useAuth } from "../../context/auth.context";


function fmtIngredient(i: IngredientInput) {
  const qty = i.quantity !== undefined && i.quantity !== null ? String(i.quantity) : "";
  const unit = i.unit ? i.unit : "";
  const main = [qty, unit, i.name].filter(Boolean).join(" ");
  return i.notes ? `${main} — ${i.notes}` : main;
}

export default function RecipePage() {
  const { id } = useParams<{ id: string }>();

  const [recipe, setRecipe] = useState<RecipeDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { user } = useAuth();

  useEffect(() => {
    let alive = true;

    async function load() {
      if (!id) {
        setLoading(false);
        setError("חסר מזהה מתכון ב-URL");
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const res = await recipesApi.getRecipeById(id);
        if (!alive) return;
        setRecipe(res);
      } catch (e: any) {
        if (!alive) return;
        const msg = e?.response?.data?.message || e?.message || "שגיאה בטעינת מתכון";
        setError(msg);
        setRecipe(null);
      } finally {
        if (!alive) return;
        setLoading(false);
      }
    }

    load();
    return () => {
      alive = false;
    };
  }, [id]);

  const shareText = useMemo(() => {
    if (!recipe) return "";
    const ingredientsText = recipe.ingredients.map(fmtIngredient).join("\n");
    const stepsText = recipe.steps
      .map((s, idx) => `${s.index ?? idx + 1}. ${s.instruction}${s.durationMinutes ? ` (${s.durationMinutes} דק')` : ""}`)
      .join("\n");
    return `${recipe.title}\n\nמצרכים:\n${ingredientsText}\n\nשלבים:\n${stepsText}\n\nהערות:\n${recipe.notes ?? ""}`;
  }, [recipe]);

  if (loading) {
    return (
      <Box sx={{ minHeight: "100vh", py: 4 }}>
        <Container maxWidth="lg">
          <Card sx={{ p: 2, borderRadius: 4 }}>
            <Skeleton height={60} />
            <Skeleton height={30} width="80%" />
            <Skeleton height={30} width="60%" />
          </Card>
        </Container>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ minHeight: "100vh", py: 4 }}>
        <Container maxWidth="md">
          <Alert severity="error" sx={{ borderRadius: 3 }}>
            {error}
          </Alert>
        </Container>
      </Box>
    );
  }

  if (!recipe) {
    return (
      <Box sx={{ minHeight: "100vh", bgcolor: colors.BROWNKITCHEN.cream, py: 4 }}>
        <Container maxWidth="md">
          <Alert severity="warning" sx={{ borderRadius: 3 }}>
            לא נמצא מתכון
          </Alert>
        </Container>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        width: "100%",
        py: { xs: 3, md: 5 },
      }}
    >
      <Container maxWidth="lg" sx={{ flexDirection: "column", direction: "rtl", gap: 2, display: "flex" }}>
        <RecipeDetailsCard recipe={recipe} shareText={shareText} />

        <IngredientsChecklist ingredients={recipe.ingredients} />

        <StepsList steps={recipe.steps} />

        <Divider sx={{ my: 2, borderColor: "rgba(94,48,35,0.10)" }} />

        <RecipeComments recipeId={id!} currentUserId={user?._id!} />
      </Container>
    </Box>
  );
}
