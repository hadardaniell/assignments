import { Box, Button, Card, CardContent, IconButton, TextField, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import type { DraftState, StepInput } from "../recipe.types";

export function PreparationStepsStep({
  draft,
  setDraft,
}: {
  draft: DraftState;
  setDraft: React.Dispatch<React.SetStateAction<DraftState>>;
}) {
  const addRow = () => {
    setDraft((p) => ({ ...p, steps: [...p.steps, { instruction: "", durationMinutes: undefined }] }));
  };

  const removeRow = (index: number) => {
    setDraft((p) => ({ ...p, steps: p.steps.filter((_, i) => i !== index) }));
  };

  const updateRow = (index: number, patch: Partial<StepInput>) => {
    setDraft((p) => ({
      ...p,
      steps: p.steps.map((s, i) => (i === index ? { ...s, ...patch } : s)),
    }));
  };

  return (
    <Box sx={{ display: "grid", gap: 2 }}>
      {draft.steps.map((step, idx) => (
        <Card key={idx} variant="outlined" sx={{ borderRadius: 3 }}>
          <CardContent sx={{ display: "flex", gap: 1.5, alignItems: "center" }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Typography sx={{ fontWeight: 800 }}>שלב #{idx + 1}</Typography>
              <IconButton onClick={() => removeRow(idx)} disabled={draft.steps.length === 1}>
                <DeleteOutlineIcon />
              </IconButton>
            </Box>

            <TextField
              label="הוראה (חובה)"
              value={step.instruction}
              onChange={(e) => updateRow(idx, { instruction: e.target.value })}
              required
              fullWidth
              multiline
              minRows={2}
            />

            <TextField
              label="משך (דקות)"
              value={step.durationMinutes ?? ""}
              onChange={(e) =>
                updateRow(idx, { durationMinutes: e.target.value ? Number(e.target.value) : undefined })
              }
              
            />
          </CardContent>
        </Card>
      ))}

      <Button startIcon={<AddIcon />} variant="outlined" onClick={addRow}>
        הוספת שלב
      </Button>
    </Box>
  );
}
