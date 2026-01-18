import {
  Box,
  Checkbox,
  Paper,
  Stack,
  Typography,
  Divider,
  Chip,
} from "@mui/material";
import type { IngredientInput } from "../create-recipe/recipe.types";
import { useMemo, useState } from "react";

function fmtIngredient(i: IngredientInput) {
  const qty = i.quantity !== undefined && i.quantity !== null ? String(i.quantity) : "";
  const unit = i.unit ? i.unit : "";
  const main = [qty, unit, i.name].filter(Boolean).join(" ");
  return i.notes ? `${main} — ${i.notes}` : main;
}

export function IngredientsChecklist({ ingredients }: { ingredients: IngredientInput[] }) {
  const [checked, setChecked] = useState<Record<number, boolean>>({});

  const doneCount = useMemo(
    () => Object.values(checked).filter(Boolean).length,
    [checked]
  );

  return (
    <Paper
    dir="rtl"
      elevation={0}
      sx={{
        p: { xs: 2, md: 3 },
        borderRadius: 4,
        border: "1px solid rgba(94,48,35,0.10)",
        bgcolor: "rgba(255,255,255,0.78)",
        backdropFilter: "blur(10px)",
      }}
    >
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography variant="h6">מצרכים</Typography>
        <Chip size="small" label={`${doneCount}/${ingredients.length}`} />
      </Stack>

      <Divider sx={{ my: 2, borderColor: "rgba(94,48,35,0.10)" }} />

      <Stack spacing={1}>
        {ingredients.map((ing, idx) => {
          const isChecked = !!checked[idx];
          return (
            <Paper
              key={`${ing.name}-${idx}`}
              elevation={0}
              sx={{
                p: 1.25,
                borderRadius: 3,
                border: "1px solid rgba(94,48,35,0.08)",
                display: "flex",
                gap: 1,
                alignItems: "center",
              }}
              onClick={() => setChecked((p) => ({ ...p, [idx]: !p[idx] }))}
            >
              <Checkbox checked={isChecked} />
              <Box sx={{ flex: 1 }}>
                <Typography sx={{ fontWeight: 800 }}>{fmtIngredient(ing)}</Typography>
              </Box>
            </Paper>
          );
        })}
      </Stack>
    </Paper>
  );
}
