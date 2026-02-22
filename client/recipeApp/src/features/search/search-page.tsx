import {
  Box,
  Container,
  TextField,
  InputAdornment,
  IconButton,
  Stack,
  Typography,
  CircularProgress,
  Chip,
} from "@mui/material";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import ClearRoundedIcon from "@mui/icons-material/ClearRounded";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { recipesApi } from "../../data-access/recipe.api";
import type { RecipeDTO } from "../../types/recipe.types";
import { RecipeCard } from "../../shared/recipe-card";
import { presetCategories } from "../../assets/consts";
import { ChipList } from "../../shared/chip-list";
import { FormControl, Select, MenuItem } from "@mui/material";
import { colors } from "../../assets/_colors";

const PAGE_SIZE = 10;

function recipeDateMs(r: RecipeDTO) {
  const iso = (r as any).createdAt ?? (r as any).updatedAt ?? "";
  const ms = Date.parse(iso);
  return Number.isFinite(ms) ? ms : 0;
}

export default function SearchPage() {
  const navigate = useNavigate();

  // UI state
  const [query, setQuery] = useState("");
  const [input, setInput] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  type SortOrder = "newest" | "oldest";
  const [sortOrder, setSortOrder] = useState<SortOrder>("newest");

  // data state
  const [items, setItems] = useState<RecipeDTO[]>([]);
  const [skip, setSkip] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  // loading states
  const [loadingFirst, setLoadingFirst] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const loadingMoreRef = useRef(false);

  // refs to avoid race conditions
  const requestIdRef = useRef(0);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // client-side filter + sort
  const filteredAndSortedItems = useMemo(() => {
    const filtered =
      selectedCategories.length === 0
        ? items
        : items.filter((r) => {
          const recipeCats = ((r as any).categories ?? []) as string[];
          return selectedCategories.some((c) => recipeCats.includes(c));
        });

    return [...filtered].sort((a, b) => {
      const diff = recipeDateMs(b) - recipeDateMs(a); // newest first
      return sortOrder === "newest" ? diff : -diff;   // flip for oldest first
    });
  }, [items, selectedCategories, sortOrder]);

  // show count based on filtered list
  const resultsCount = filteredAndSortedItems.length;

  const resetAndSearch = useCallback(async (nextQuery: string) => {
    const rid = ++requestIdRef.current;

    setQuery(nextQuery);
    setItems([]);
    setSkip(0);
    setHasMore(true);
    setLoadingFirst(true);

    try {
      const res = await recipesApi.getRecipes({
        search: nextQuery || undefined,
        skip: 0,
        limit: PAGE_SIZE,
      });

      if (requestIdRef.current !== rid) return;

      const data = res ?? [];
      setItems(data);
      setSkip(data.length);
      setHasMore(data.length === PAGE_SIZE);
    } finally {
      if (requestIdRef.current === rid) setLoadingFirst(false);
    }
  }, []);

  const loadMore = useCallback(async () => {
    if (!hasMore) return;
    if (loadingFirst) return;
    if (loadingMoreRef.current) return;

    loadingMoreRef.current = true;
    setLoadingMore(true);

    const rid = ++requestIdRef.current;

    try {
      const res = await recipesApi.getRecipes({
        search: query || undefined,
        skip,
        limit: PAGE_SIZE,
      });

      if (requestIdRef.current !== rid) return;

      const data = res ?? [];

      setItems((prev) => {
        const seen = new Set(prev.map((r) => ((r as any).Id ?? (r as any)._id ?? "") as string));
        const merged = [...prev];

        for (const r of data) {
          const id = ((r as any).Id ?? (r as any)._id ?? "") as string;
          if (!seen.has(id)) merged.push(r);
        }

        if (merged.length === prev.length) {
          setHasMore(false);
        }

        return merged;
      });

      setSkip((prev) => prev + data.length);
      setHasMore((prev) => prev && data.length === PAGE_SIZE);
    } finally {
      loadingMoreRef.current = false;
      setLoadingMore(false);
    }
  }, [hasMore, loadingFirst, query, skip]);

  // initial load
  useEffect(() => {
    resetAndSearch("");
  }, [resetAndSearch]);

  // infinite scroll observer
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;

    observerRef.current?.disconnect();

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first?.isIntersecting) loadMore();
      },
      { root: null, rootMargin: "800px 0px", threshold: 0 }
    );

    observerRef.current.observe(el);
    return () => observerRef.current?.disconnect();
  }, [loadMore]);

  // debounce search
  useEffect(() => {
    if (input.trim() === query) return;

    const handler = setTimeout(() => {
      resetAndSearch(input.trim());
    }, 500);

    return () => clearTimeout(handler);
  }, [input, query, resetAndSearch]);

  return (
    <Box sx={{ minHeight: "100vh", py: { xs: 3, md: 5 }, padding: "1em 0" }}>
      <Container
        maxWidth="lg"
        sx={{ direction: "rtl", display: "flex", flexDirection: "column", gap: 2 }}
      >
        <Stack spacing={1} dir="rtl" gap="1em">
          <TextField
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="מה בא לך להכין היום?"
            fullWidth
            sx={{
              maxWidth: "500px",
              "& .MuiOutlinedInput-root": {
                borderRadius: "40px",
                height: "48px",
                fontSize: "15px",
              },
            }}
            InputProps={{
              startAdornment: <InputAdornment position="start" />,
              endAdornment: (
                <InputAdornment position="end">
                  {input ? (
                    <IconButton
                      size="small"
                      onClick={() => {
                        setInput("");
                        resetAndSearch("");
                      }}
                    >
                      <ClearRoundedIcon />
                    </IconButton>
                  ) : null}

                  <IconButton onClick={() => resetAndSearch(input.trim())} disabled={loadingFirst}>
                    {loadingFirst ? <CircularProgress size={18} /> : <SearchRoundedIcon />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Stack direction="row" spacing={1} useFlexGap alignItems="center">
            <ChipList
              categories={[...presetCategories]}
              selectedCategories={selectedCategories}
              onSelectCategory={(category, selected) => {
                setSelectedCategories((prev) =>
                  selected ? [...prev, category] : prev.filter((c) => c !== category)
                );
              }}
            />
          </Stack>

          <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap" alignItems="center">
            <FormControl
              size="small"
              sx={{
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "#fff",
                  height: 35,
                  fontSize: 14,
                },
                "& fieldset": {
                  borderColor: colors.GREY[300],
                },
                "&:hover fieldset": {
                  borderColor: colors.BROWNKITCHEN.coffee,
                },
                "& .Mui-focused fieldset": {
                  borderColor: colors.BROWNKITCHEN.coffee,
                },
              }}
            >
              <Select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as "newest" | "oldest")}
                displayEmpty
              >
                <MenuItem value="newest" sx={{fontSize: 14}}>חדש → ישן</MenuItem>
                <MenuItem value="oldest" sx={{fontSize: 14}}>ישן → חדש</MenuItem>
              </Select>
            </FormControl>

            <Chip size="small" label={`תוצאות: ${resultsCount}`} />
            {loadingMore ? <Chip size="small" label="טוען עוד…" /> : null}
          </Stack>
        </Stack>

        {/* List */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 160px))",
            gap: 2,
            justifyContent: "left",
            direction: "ltr",
          }}
        >
          {filteredAndSortedItems.map((r) => (
            <RecipeCard
              sx={{ width: "160px" }}
              key={r.Id}
              recipe={r}
              onClick={() => navigate(`/recipe/${(r as any).Id ?? (r as any)._id}`)}
            />
          ))}
        </Box>

        {/* Footer loading / sentinel */}
        <Box sx={{ py: 5, display: "grid", placeItems: "center" }}>
          {loadingMore ? <CircularProgress /> : null}
          {!hasMore && items.length > 0 ? (
            <Typography color="text.secondary" sx={{ mt: 1 }}>
              סה״כ {resultsCount} מתכונים
            </Typography>
          ) : null}
          <div ref={sentinelRef} />
        </Box>
      </Container>
    </Box>
  );
}
