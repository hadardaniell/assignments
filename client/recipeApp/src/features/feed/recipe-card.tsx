import { Card, CardActionArea, CardContent, CardMedia, Typography, Box, Chip } from "@mui/material";

export type RecipeCardModel = {
  _id: string;
  title: string;
  imageUrl?: string | null;
  description?: string | null;
  createdAt?: string | Date | null;
  tags?: string[];
};

type Props = {
  recipe: RecipeCardModel;
  onClick?: (id: string) => void;
};

export function RecipeCard({ recipe, onClick }: Props) {
  const created =
    recipe.createdAt
      ? new Date(recipe.createdAt).toLocaleDateString("he-IL")
      : null;

  return (
    <Card sx={{ borderRadius: 3 }}>
      <CardActionArea onClick={() => onClick?.(recipe._id)}>
        <CardMedia
          component="img"
          height="160"
          image={recipe.imageUrl || "https://via.placeholder.com/600x400?text=Recipe"}
          alt={recipe.title}
        />
        <CardContent>
          <Typography variant="h6" sx={{ fontWeight: 700 }} noWrap>
            {recipe.title}
          </Typography>

          {recipe.description && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }} noWrap>
              {recipe.description}
            </Typography>
          )}

          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 1.2 }}>
            {created ? (
              <Typography variant="caption" color="text.secondary">
                {created}
              </Typography>
            ) : (
              <span />
            )}

            {!!recipe.tags?.length && (
              <Chip size="small" label={recipe.tags[0]} sx={{background: "#cffafe", color: "#0891b2"}}/>
            )}
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
