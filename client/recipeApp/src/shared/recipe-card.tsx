import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Chip,
  type SxProps,
  Stack,
} from "@mui/material";
import noRecipeImg from "../assets/images/no_recipe3.jpg";
import { useNavigate } from "react-router-dom";
import { colors } from "../assets/_colors";
import ChatBubbleOutline from "@mui/icons-material/ChatBubbleOutline";
import { LikeComponent } from "./like";
import { useAuth } from "../context/auth.context";
import { getConfig } from "../services";

export type RecipeCardModel = {
  Id?: string;
  title: string;
  coverImageUrl?: string | null;
  description?: string | null;
  createdAt?: string | Date | null;
  tags?: string[];
  commentsCount?: number;
  likesCount?: number;
  isUserLiked: boolean;
  sourceType?: 'ai' | 'manual';
};

type Props = {
  recipe: RecipeCardModel;
  onClick?: (id: string) => void;
  sx?: SxProps;

  onLiked?: (recipe: RecipeCardModel) => void;
  onUnliked?: (recipeId: string) => void;
};

export function RecipeCard({ recipe, onClick, sx, onLiked, onUnliked }: Props) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { serverFields } = getConfig();



  const created = recipe.createdAt
    ? new Date(recipe.createdAt).toLocaleDateString("he-IL")
    : null;

  const imgSrc = recipe.coverImageUrl ? `${serverFields}${recipe.coverImageUrl}` : noRecipeImg;

  function toRecipePage(id: string) {
    if (onClick) return onClick(id);
    navigate(`/recipe/${id}`);
  }

  return (
    <Card
      sx={{
        direction: "rtl",
        borderRadius: 3,
        boxShadow: "none",
        border: "1px solid " + colors.GREY[200],
        overflow: "hidden",
        transform: "translateZ(0)", // smoother hover
        transition: "transform 220ms ease, box-shadow 220ms ease, border-color 220ms ease",
        "& .muirtl-1yeqsoz-MuiButtonBase-root-MuiCardActionArea-root": {
          direction: "rtl"
        },
        "&:hover": {
          transform: "scale(1.02)",
          borderColor: "rgba(94,48,35,0.22)",
          boxShadow: "0 14px 40px rgba(0,0,0,0.10)",
        },
        "&:hover .rc-media": {
          filter: "brightness(0.75)",
          transform: "scale(1.04)",
        },
        "&:hover .rc-overlay": {
          opacity: 1,
          transform: "translateY(0px)",
        },
        ...sx,
      }}
    >
      <CardActionArea onClick={() => toRecipePage(recipe.Id!)} sx={{ position: "relative" }}>
        {/* Image */}
        <Box sx={{ position: "relative" }}>
          <CardMedia
            className="rc-media"
            component="img"
            height="160"
            image={imgSrc}
            onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
              e.currentTarget.src = noRecipeImg;
            }}
            alt={recipe.title}
            sx={{
              transition: "filter 220ms ease, transform 220ms ease",
              transform: "scale(1.0)",
            }}
          />
          <Box
            sx={{
              position: "absolute",
              top: 8,
              left: "118px" + "!important",
              height: 24,
              zIndex: 3,
              bgcolor: "rgba(255,255,255,0.85)",
              borderRadius: "50%",
              p: 0.5,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            }}
          >
            <LikeComponent
              userId={user?._id}
              recipeId={recipe.Id!}
              isUserLike={recipe.isUserLiked}

              onLiked={() => onLiked?.(recipe)}
              onUnliked={() => onUnliked?.(recipe.Id!)}
            />
          </Box>
          {/* Overlay */}
          <Box
            className="rc-overlay"
            sx={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              p: 1.25,
              opacity: 0,
              transform: "translateY(6px)",
              transition: "opacity 220ms ease, transform 220ms ease",
              background:
                "linear-gradient(180deg, rgba(0,0,0,0.20) 0%, rgba(0,0,0,0.55) 70%, rgba(0,0,0,0.70) 100%)",
              color: "white",
              pointerEvents: "none",
            }}
          >
            <Box sx={{ display: "flex", direction: "rtl" }}>
              {!!recipe.tags?.length && (
                <Chip
                  size="small"
                  label={recipe.tags[0]}
                  sx={{
                    bgcolor: "rgba(255,255,255,0.18)",
                    color: "white",
                    border: "1px solid rgba(255,255,255,0.25)",
                    backdropFilter: "blur(6px)",
                  }}
                />
              )}
            </Box>

            <Box>
              <Typography sx={{ opacity: 0.85, mt: 0.75, display: "block", fontWeight: 600 }}
              >{recipe.title}</Typography>
              {recipe.description ? (
                <Typography
                  variant="body2"
                  sx={{
                    opacity: 0.95,
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {recipe.description}
                </Typography>
              ) : (
                <Typography variant="body2" sx={{ opacity: 0.85 }}>
                  לחצו לצפייה במתכון
                </Typography>
              )}

              <Stack>
                {created ? (
                  <Typography variant="caption" sx={{ opacity: 0.85, mt: 0.75, display: "block" }}>
                    נוצר: {created}
                  </Typography>
                ) : null}
              </Stack>
            </Box>
          </Box>
        </Box>

        {/* Content */}
        <CardContent sx={{ pb: 1.75 }}>
          <Typography variant="h6" sx={{ fontWeight: 800 }} noWrap>
            {recipe.title}
          </Typography>

          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 1.2 }}>
            {created ? (
              <Typography variant="caption" color="text.secondary">
                {created}
              </Typography>
            ) : (
              <span />
            )}
            {/* Comments count */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                color: colors.GREY[200],
                backdropFilter: "blur(6px)",
                fontSize: 12,
                pointerEvents: "none",
              }}
            >
              <Typography variant="caption" sx={{ color: "inherit", lineHeight: 1 }}>
                {recipe?.commentsCount ?? 0}
              </Typography>
              <ChatBubbleOutline sx={{ fontSize: 18 }} />
            </Box>
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
