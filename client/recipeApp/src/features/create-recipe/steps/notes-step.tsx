import { Box, TextField } from "@mui/material";
import type { DraftState } from "../recipe.types";

export function NotesStep({
  draft,
  setDraft,
}: {
  draft: DraftState;
  setDraft: React.Dispatch<React.SetStateAction<DraftState>>;
}) {
  return (
    <Box sx={{ display: "grid", gap: 2 }}>
      <TextField
        label="הערות מיוחדות"
        value={draft.notes}
        onChange={(e) => setDraft((p) => ({ ...p, notes: e.target.value }))}
        fullWidth
        multiline
        minRows={4}
      />
    </Box>
  );
}
