import { Avatar, Chip, Divider, Paper, Stack, Typography } from "@mui/material";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import type { StepInput } from "../create-recipe/recipe.types";
import { useMemo } from "react";
import { colors } from "../../assets/_colors";

export function StepsList({ steps }: { steps: StepInput[] }) {
  const stepsWithIndex = useMemo(
    () => steps.map((s, idx) => ({ ...s, index: s.index ?? idx + 1 })),
    [steps]
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
        <Typography variant="h6">שלבי הכנה</Typography>
        <Chip size="small" label={`${steps.length} שלבים`} />
      </Stack>

      <Divider sx={{ my: 2, borderColor: "rgba(94,48,35,0.10)" }} />

      <Stack spacing={1.25}>
        {stepsWithIndex.map((s) => (
          <Paper
            key={s.index}
            elevation={0}
            sx={{
              p: 1.75,
              borderRadius: 3,
              border: "1px solid rgba(94,48,35,0.10)",
              display: "flex",
              gap: 1.5,
              alignItems: "center",
            }}
          >
            <Avatar
              sx={{
                bgcolor: colors.BROWNKITCHEN.cream,
                color: colors.BROWNKITCHEN.coffee,
                width: 36,
                height: 36,
                fontSize: 14,
                fontWeight: 800,
              }}
            >
              {s.index}
            </Avatar>

            <Stack spacing={0.75} sx={{ flex: 1 }}>
              <Typography sx={{ fontWeight: 800 }}>{s.instruction}</Typography>

              {typeof s.durationMinutes === "number" ? (
                <Chip
                  size="small"
                  icon={<AccessTimeRoundedIcon />}
                  label={`${s.durationMinutes} דק׳`}
                  sx={{ alignSelf: "flex-start" }}
                />
              ) : null}
            </Stack>
          </Paper>
        ))}
      </Stack>
    </Paper>
  );
}
