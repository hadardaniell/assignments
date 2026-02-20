import { useMemo, useState } from "react";
import { Box, CircularProgress, Grow, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

import type { RecipeDTO } from "../../types/recipe.types"; // תעדכני נתיב
import { AiSearchBar } from "./ai-search-bar";
import { RecipeCard, type RecipeCardModel } from "../../shared/recipe-card";
import { recipesApi } from "../../data-access/recipe.api";

function toRecipeCardModel(r: RecipeDTO): RecipeCardModel {
  const anyR: any = r as any;
  return {
    Id: anyR.Id ?? anyR._id ?? "",
    title: anyR.title ?? "",
    imageUrl: anyR.imageUrl ?? anyR.image ?? null,
    description: anyR.description ?? anyR.summary ?? null,
    createdAt: anyR.createdAt ?? null,
    tags: anyR.tags ?? [],
    isUserLiked: anyR.isUserLiked ?? false,
  };
}

export function SearchAiPageContainer() {
  const navigate = useNavigate();

  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorText, setErrorText] = useState<string | null>(null);
  const [results, setResults] = useState<RecipeDTO[]>([]);

  const cards = useMemo(() => results.map(toRecipeCardModel), [results]);

  async function onSearch(q: string) {
    setQuery(q);
    setLoading(true);
    setErrorText(null);

    try {
      const res = await recipesApi.searchAIRecipes(q);
      const data = (res as any).data ?? res;
      setResults((data ?? []) as RecipeDTO[]);
    } catch (e: any) {
      setErrorText(e?.message ?? "שגיאה בחיפוש AI");
      setResults([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Box sx={{ minHeight: "100%", 
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-end",
        padding: "0 2em",
        marginTop: "-1em"
     }}>

      {loading && (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5}}>
          <CircularProgress size={20} />
          <Typography variant="body2">מחפש מתכונים…</Typography>
        </Box>
      )}

      {errorText && (
        <Typography>
          {errorText}
        </Typography>
      )}

      {!loading && !errorText && query && cards.length === 0 && (
        <Typography>
          לא נמצאו תוצאות.
        </Typography>
      )}

      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 2,
          mt: 2,
        }}
      >
        {cards.map((r, idx) => (
          <Grow
            key={r.Id || `${idx}`}
            in
            appear
            timeout={250 + idx * 90}
          >
            <Box>
              <RecipeCard
                sx={{ width: "160px" }}
                recipe={r}
                onClick={() => navigate(`/recipe/${(r as any).Id ?? (r as any)._id}`)}
              />
            </Box>
          </Grow>
        ))}
      </Box>

      <AiSearchBar value={query} loading={loading} onSubmit={onSearch} />
    </Box>
  );
}