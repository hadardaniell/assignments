import { Box, Chip, MenuItem, TextField, Typography } from "@mui/material";
import type { DraftState } from "../../../types/recipe.types";
import { colors } from "../../../assets/_colors";

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
      <TextField
        label="שם המתכון (חובה)"
        value={draft.title}
        onChange={(e) => setDraft((p) => ({ ...p, title: e.target.value }))}
        required
        fullWidth
      />

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
        <TextField
          label="זמן הכנה (דקות)"
          value={draft.prepTimeMinutes}
          onChange={(e) => setDraft((p) => ({ ...p, prepTimeMinutes: e.target.value }))}
          fullWidth
        />

        <TextField
          select
          label="רמת קושי"
          value={draft.difficulty}
          onChange={(e) => setDraft((p) => ({ ...p, difficulty: e.target.value as any }))}
          fullWidth
        >
         <div dir="rtl">
          <MenuItem value="">ללא</MenuItem>
          <MenuItem value="easy">קל</MenuItem>
          <MenuItem value="medium">בינוני</MenuItem>
          <MenuItem value="hard">קשה</MenuItem>
         </div>
        </TextField>

      </Box>
        <label style={{direction: "rtl"}}>צרפו תמונה</label>
        <TextField
          type="file"
          value={draft.coverImageUrl}
          onChange={(e) => setDraft((p) => ({ ...p, coverImageUrl: e.target.value }))}
          fullWidth
        />

      <Box>
        <Typography sx={{ fontWeight: 800, mb: 1 }}>קטגוריות</Typography>

        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
          {presetCategories.map((c) => {
            const selected = draft.categories.includes(c);
            return (
              <Chip
                key={c}
                label={c}
                clickable
                onClick={() => toggleCategory(c)}
                variant={selected ? "filled" : "outlined"}
                sx={{
                  borderColor: colors.BROWNKITCHEN.olive,
                  ...(selected
                    ? { backgroundColor: colors.BROWNKITCHEN.olive, color: "white" }
                    : { color: colors.BROWNKITCHEN.olive }),
                }}
              />
            );
          })}
        </Box>

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
