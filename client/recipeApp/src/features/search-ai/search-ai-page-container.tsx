import { useEffect, useMemo, useState } from "react";
import { Box, CircularProgress, Grow, Typography } from "@mui/material";
import { useNavigate, useNavigationType } from "react-router-dom";

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
    const navType = useNavigationType();

    const [query, setQuery] = useState("");
    const [loading, setLoading] = useState(false);
    const [errorText, setErrorText] = useState<string | null>(null);
    const [results, setResults] = useState<RecipeDTO[]>([]);

    const cards = useMemo(() => results.map(toRecipeCardModel), [results]);

    useEffect(() => {
        const savedQuery = sessionStorage.getItem("ai_search_query");
        const savedResults = sessionStorage.getItem("ai_search_results");

        if (navType === "POP") {
            if (savedQuery && savedResults) {
                setQuery(savedQuery);
                try {
                    setResults(JSON.parse(savedResults));
                } catch {
                    setResults([]);
                }
            }
        } else {
            sessionStorage.removeItem("ai_search_query");
            sessionStorage.removeItem("ai_search_results");
            setQuery("");
            setResults([]);
            setErrorText(null);
        }
    }, [navType]);

    // useEffect(() => {
    //     const savedQuery = sessionStorage.getItem("ai_search_query");
    //     const savedResults = sessionStorage.getItem("ai_search_results");

    //     if (savedQuery && savedResults) {
    //         setQuery(savedQuery);
    //         try {
    //             setResults(JSON.parse(savedResults));
    //         } catch {
    //             setResults([]);
    //         }
    //     }
    // }, []);

    async function onSearch(q: string) {
        setQuery(q);
        setLoading(true);
        setErrorText(null);

        try {
            const res = await recipesApi.searchAIRecipes(q);
            const data = (res as any).data ?? res;
            setResults((data ?? []) as RecipeDTO[]);
            sessionStorage.setItem("ai_search_query", q);
            sessionStorage.setItem("ai_search_results", JSON.stringify(data ?? []));
        } catch (e: any) {
            if (e?.status === 429) {
                setErrorText('הגענו למגבלת השימוש היומית של Google. נסו שוב בעוד דקה!');
            }
            else setErrorText('אופס... נראה שצריך לדייק את החיפוש');
            setResults([]);
        } finally {
            setLoading(false);
        }
    }

    return (
        <Box sx={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "flex-end",
            padding: "0 2em",
            marginTop: "-1em"
        }}>
            <Box sx={{
                height: "100%", display: "flex",
                flexDirection: "column",
                justifyContent: "center",
            }}>
                {loading && (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, direction: "rtl" }}>
                        <CircularProgress size={20} />
                        <Typography variant="body2">מחפש מתכונים…</Typography>
                    </Box>
                )}

                {errorText && (
                    <Typography dir="rtl" color="error">
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
                            <Box sx={{ gap: "2em" }}>
                                <RecipeCard
                                    sx={{ width: "160px" }}
                                    recipe={r}
                                    onClick={() => navigate(`/recipe/${(r as any).Id ?? (r as any)._id}`)}
                                />
                            </Box>
                        </Grow>
                    ))}
                </Box>
            </Box>

            <AiSearchBar value={query} loading={loading} onSubmit={onSearch} />
        </Box>
    );
}