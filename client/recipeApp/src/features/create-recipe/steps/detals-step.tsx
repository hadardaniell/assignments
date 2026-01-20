import { Box, Chip, Container, MenuItem, TextField, Typography } from "@mui/material";
import type { DraftState } from "../../../types/recipe.types";
import { colors } from "../../../assets/_colors";
import { ChipList } from "../../../shared/chip-list";

export function DetailsStep({
  draft,
  setDraft,
  presetCategories,
  totalTimeMinutes,
}: {
  draft: DraftState;
  setDraft: React.Dispatch<React.SetStateAction<DraftState>>;
  presetCategories: readonly string[];
  totalTimeMinutes: number | null;
}) {
  const toggleCategory = (c: string) => {
    setDraft((p) => {
      const exists = p.categories.includes(c);
      return {
        ...p,
        categories: exists ? p.categories.filter((x) => x !== c) : [...p.categories, c],
      };
    });
  };

  return (
    <Box sx={{ display: "grid", gap: 2 }}>
      <Container sx={{ display: "flex", gap: "1em", width: "100%", padding: "0 !important" }}>
        <TextField
          label="שם המתכון"
          value={draft.title}
          onChange={(e) => setDraft((p) => ({ ...p, title: e.target.value }))}
          required
          fullWidth
        />
        <TextField
          label="זמן הכנה (דקות)"
          type="number"
          value={Number(draft.prepTimeMinutes)}
          onChange={(e) => setDraft((p) => ({ ...p, prepTimeMinutes: e.target.value.toString() }))}
          fullWidth
          required
          sx={{ maxWidth: "130px" }}
        />

        <TextField
          select
          dir="rtl"
          label="רמת קושי"
          value={draft.difficulty ?? ""}
          onChange={(e) =>
            setDraft((p) => ({ ...p, difficulty: e.target.value as any }))
          }
          fullWidth
          required
        >
          <MenuItem value="easy" dir="rtl">קל</MenuItem>
          <MenuItem value="medium" dir="rtl">בינוני</MenuItem>
          <MenuItem value="hard" dir="rtl">קשה</MenuItem>
        </TextField>
      </Container>

      <TextField
        label="תיאור"
        value={draft.description}
        onChange={(e) => setDraft((p) => ({ ...p, description: e.target.value }))}
        fullWidth
        multiline
        minRows={2}
      />

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr 1fr" },
          gap: 2,
        }}
      >


      </Box>
      <Typography component="label" sx={{ direction: "rtl" }}>
        צרפו תמונה
      </Typography>
      <TextField
        type="file"
        value={draft.coverImageUrl}
        onChange={(e) => setDraft((p) => ({ ...p, coverImageUrl: e.target.value }))}
        fullWidth
      />

      <Box>
        <Typography sx={{ fontWeight: 800, mb: 1 }}>קטגוריות</Typography>

        <ChipList
          categories={[...presetCategories]}
          selectedCategories={draft.categories}
          onSelectCategory={(category, selected) => {
            setDraft((p) => ({
              ...p,
              categories: selected
                ? [...p.categories, category]
                : p.categories.filter((c) => c !== category),
            }));
          }}
        />

        {!!draft.categories.length && (
          <Typography
            variant="caption"
            sx={{ mt: 1, display: "block", color: "text.secondary" }}
          >
            נבחרו: {draft.categories.join(", ")}
          </Typography>
        )}
      </Box>
    </Box>
  );
}
