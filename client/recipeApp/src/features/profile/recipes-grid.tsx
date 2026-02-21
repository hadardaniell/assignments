import { Button, Card, CardContent, Typography, Grid } from "@mui/material";
import { RecipeCard, type RecipeCardModel } from "../../shared/recipe-card";
import { useNavigate } from "react-router-dom";

type Props = {
  recipes: RecipeCardModel[];
  onRecipeClick?: (id: string) => void;
};

export function RecipesGrid({ recipes, onRecipeClick }: Props) {
  const navigate = useNavigate();
  
  return (
    <>
      <Typography variant="h6" sx={{ fontWeight: 800, mb: 1.5 }}>
        המתכונים שלי
      </Typography>

      {recipes.length === 0 ? (
        <Card sx={{ borderRadius: 3 }}>
          <CardContent>
            <Typography sx={{ fontWeight: 700 }}>אין עדיין מתכונים</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              רוצה ליצור את המתכון הראשון שלך?
            </Typography>

            <Button
              sx={{ mt: 2 }}
              variant="contained"
              onClick={() => navigate("/recipes/new")}
            >
              יצירת מתכון
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={2}>
          {recipes.map((r) => (
            <RecipeCard key={r.Id} recipe={r} onClick={(id) => onRecipeClick?.(id)} sx={{ width: "160px", direction: "rtl" }} />
          ))}
        </Grid>
      )}
    </>
  );
}
