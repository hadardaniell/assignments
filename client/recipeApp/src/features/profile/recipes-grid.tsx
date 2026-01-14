import { Button, Card, CardContent, Typography, Grid } from "@mui/material";
import { RecipeCard, type RecipeCardModel } from "../feed/recipe-card";

type Props = {
  recipes: RecipeCardModel[];
  onRecipeClick?: (id: string) => void;
};

export function RecipesGrid({ recipes, onRecipeClick }: Props) {
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
              onClick={() => console.log("go create recipe")}
            >
              יצירת מתכון
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={2}>
          {recipes.map((r) => (
            // <Grid key={r._id} xs={12} sm={6} md={4} lg={3}>
              <RecipeCard recipe={r} onClick={(id) => onRecipeClick?.(id)} />
            // </Grid>
          ))}
        </Grid>
      )}
    </>
  );
}
