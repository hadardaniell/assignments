import { Box, Button, Card, CardContent, IconButton, MenuItem, TextField, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import type { DraftState, IngredientInput } from "../../../types/recipe.types";

export function IngredientsStep({
    draft,
    setDraft,
    units,
}: {
    draft: DraftState;
    setDraft: React.Dispatch<React.SetStateAction<DraftState>>;
    units: string[];
}) {
    const addRow = () => {
        setDraft((p) => ({
            ...p,
            ingredients: [...p.ingredients, { name: "", quantity: undefined, unit: "", notes: null }],
        }));
    };

    const removeRow = (index: number) => {
        setDraft((p) => ({ ...p, ingredients: p.ingredients.filter((_, i) => i !== index) }));
    };

    const updateRow = (index: number, patch: Partial<IngredientInput>) => {
        setDraft((p) => ({
            ...p,
            ingredients: p.ingredients.map((ing, i) => (i === index ? { ...ing, ...patch } : ing)),
        }));
    };

    return (
        <Box sx={{ display: "grid", gap: 2 }}>
            {draft.ingredients.map((ing, idx) => (
                <Card key={idx} variant="outlined" sx={{ borderRadius: 3 }}>
                    <CardContent sx={{ display: "flex", gap: 1.5 }}>
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <Typography sx={{ fontWeight: 800 }}>#{idx + 1}</Typography>

                        </Box>

                        <TextField
                            label="שם מצרך (חובה)"
                            value={ing.name}
                            onChange={(e) => updateRow(idx, { name: e.target.value })}
                            required
                            fullWidth
                            sx={{maxWidth: "150px"}}
                        />

                        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 2 }}>
                            <TextField
                                label="כמות"
                                type="number"
                                value={ing.quantity ?? ""}
                                onChange={(e) => updateRow(idx, { quantity: e.target.value ? Number(e.target.value) : undefined })}
                                fullWidth
                            />

                            <TextField
                                select
                                label="יחידה"
                                value={ing.unit ?? ""}
                                onChange={(e) => updateRow(idx, { unit: e.target.value })}
                                fullWidth
                                sx={{minWidth: "90px"}}
                            >
                                {units.map((unit) => (
                                    <MenuItem key={unit} value={unit}>
                                        {unit}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Box>
                        <TextField
                            label="הערות למצרך"
                            value={ing.notes ?? ""}
                            onChange={(e) => updateRow(idx, { notes: e.target.value })}
                            fullWidth
                        />
                        <IconButton onClick={() => removeRow(idx)} disabled={draft.ingredients.length === 1}>
                            <DeleteOutlineIcon />
                        </IconButton>
                    </CardContent>
                </Card>
            ))}

            <Button startIcon={<AddIcon />} variant="outlined" onClick={addRow}>
                הוספת מצרך
            </Button>
        </Box>
    );
}
