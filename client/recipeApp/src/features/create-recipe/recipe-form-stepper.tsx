import { useMemo, useState } from "react";
import { Box, Button, Card, CardContent, Divider, Step, StepLabel, Stepper, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import type { DraftState, RecipeDTO, RecipeStatus } from "../../types/recipe.types";
import { DetailsStep } from "./steps/detals-step";
import { IngredientsStep } from "./steps/ingredients-step";
import { PreparationStepsStep } from "./steps/preparationSteps-step";
import { NotesStep } from "./steps/notes-step";
import { recipesApi } from "../../data-access/recipe.api";
import { useAuth } from "../../context/auth.context";
import { colors } from "../../assets/_colors";
import { presetCategories, stepLabels, UNITS } from "../../assets/consts";

type Props = {
    mode: "create" | "edit";
    recipeId?: string;
    initialDraft: DraftState;
    onDone?: (recipe?: any) => void;
};

export function RecipeFormStepper({ mode, recipeId, initialDraft, onDone }: Props) {
    const { user } = useAuth();

    const [activeStep, setActiveStep] = useState(0);
    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [coverFile, setCoverFile] = useState<File | null>(null);
    const [draft, setDraft] = useState<DraftState>(initialDraft);

    const totalTimeMinutes = useMemo(() => {
        const p = Number(draft.prepTimeMinutes || 0);
        const c = Number(draft.cookTimeMinutes || 0);
        const sum = (Number.isFinite(p) ? p : 0) + (Number.isFinite(c) ? c : 0);
        return sum > 0 ? sum : null;
    }, [draft.prepTimeMinutes, draft.cookTimeMinutes]);

    const canGoNext = useMemo(() => {
        if (activeStep === 0) {
            return (
                draft.title.trim().length > 0 &&
                draft.prepTimeMinutes !== "" &&
                !Number.isNaN(Number(draft.prepTimeMinutes)) &&
                Number(draft.prepTimeMinutes) > 0 &&
                !!draft.difficulty &&
                draft.categories.length > 0
            );
        }
        if (activeStep === 1) return draft.ingredients.every((i) => i.name.trim().length > 0);
        if (activeStep === 2) return draft.steps.every((s) => s.instruction.trim().length > 0);
        return true;
    }, [activeStep, draft]);

    const buildDTO = (status: RecipeStatus): RecipeDTO => {
        const prep = draft.prepTimeMinutes ? Number(draft.prepTimeMinutes) : null;
        const cook = draft.cookTimeMinutes ? Number(draft.cookTimeMinutes) : null;

        return {
            title: draft.title.trim(),
            description: draft.description.trim() || null,
            categories: draft.categories.length ? draft.categories : undefined,
            prepTimeMinutes: Number.isFinite(prep as any) ? prep : null,
            cookTimeMinutes: Number.isFinite(cook as any) ? cook : null,
            totalTimeMinutes,
            difficulty: draft.difficulty || undefined,
            ingredients: draft.ingredients.map((i) => ({
                name: i.name.trim(),
                quantity: i.quantity,
                unit: i.unit?.trim() || undefined,
                notes: i.notes?.trim() || null,
            })),
            steps: draft.steps.map((s, idx) => ({
                index: idx,
                instruction: s.instruction.trim(),
                durationMinutes: s.durationMinutes,
            })),
            notes: draft.notes.trim() || null,
            coverImageUrl: draft.coverImageUrl.trim() || null,
            sourceType: "manual",
            status,
            createdBy: user?._id,
        };
    };

    const buildUpdateDTO = (): Partial<RecipeDTO> => {
        const dto: Partial<RecipeDTO> = {};

        const prep = draft.prepTimeMinutes ? Number(draft.prepTimeMinutes) : null;
        const cook = draft.cookTimeMinutes ? Number(draft.cookTimeMinutes) : null;

        if (draft.title.trim()) {
            dto.title = draft.title.trim();
        }

        if (draft.description.trim()) {
            dto.description = draft.description.trim();
        }

        if (draft.difficulty) {
            dto.difficulty = draft.difficulty;
        }

        if (draft.coverImageUrl.trim()) {
            dto.coverImageUrl = draft.coverImageUrl.trim();
        }

        if (draft.notes.trim()) {
            dto.notes = draft.notes.trim();
        }

        if (draft.categories.length > 0) {
            dto.categories = draft.categories;
        }

        if (Number.isFinite(prep) && prep! > 0) {
            dto.prepTimeMinutes = prep!;
        }

        if (Number.isFinite(cook) && cook! > 0) {
            dto.cookTimeMinutes = cook!;
        }

        if (totalTimeMinutes && totalTimeMinutes > 0) {
            dto.totalTimeMinutes = totalTimeMinutes;
        }

        if (draft.ingredients.some((i) => i.name.trim())) {
            dto.ingredients = draft.ingredients.map((i) => ({
                name: i.name.trim(),
                quantity: i.quantity,
                unit: i.unit?.trim() || undefined,
                notes: i.notes?.trim() || null,
            }));
        }

        if (draft.steps.some((s) => s.instruction.trim())) {
            dto.steps = draft.steps.map((s, idx) => ({
                index: idx,
                instruction: s.instruction.trim(),
                durationMinutes: s.durationMinutes,
            }));
        }

        return dto;
    };


    const onSubmit = async () => {
        setSubmitting(true);
        setSubmitError(null);

        try {
            if (mode === "create") {
                const dto = buildDTO("published");
                const created = await recipesApi.createRecipe(dto);
                if (coverFile && created) {
                    await recipesApi.uploadRecipeImage(created.Id!, coverFile!);
                }
                onDone?.(created);
                return;
            }

            if (!recipeId) throw new Error("Missing recipeId for edit mode");
            let dto = buildUpdateDTO();
            const updated = await recipesApi.updateRecipe(recipeId, dto);
            if(updated && coverFile) {
                await recipesApi.uploadRecipeImage(updated.Id!, coverFile!);
            }
            onDone?.(updated);
        } catch (err: any) {
            const msg = err?.response?.data?.message || err?.message || "שגיאה בשמירה, נסה שוב";
            setSubmitError(msg);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Box dir="rtl" sx={{ padding: "1em" }}>
            <Typography
                variant="h5"
                sx={{
                    fontWeight: 900,
                    mb: 2,
                    display: "flex",
                    justifyContent: "center",
                    color: colors.BROWNKITCHEN.brownie,
                }}
            >
                {mode === "edit" ? "עריכת מתכון" : "יצירת מתכון חדש"}
            </Typography>

            <Card sx={{ borderRadius: 3, boxShadow: "none" }}>
                <CardContent>
                    <Stepper activeStep={activeStep} alternativeLabel>
                        {stepLabels.map((label) => (
                            <Step
                                key={label}
                                sx={{ "& .Mui-completed": { color: colors.COLORFUL.fresh_green + " !important" } }}
                            >
                                <StepLabel sx={{ "& .MuiStepLabel-label.Mui-active": { fontWeight: 700 } }}>
                                    {label}
                                </StepLabel>
                            </Step>
                        ))}
                    </Stepper>

                    <Divider sx={{ my: 2 }} />

                    {activeStep === 0 && (
                        <DetailsStep
                            draft={draft}
                            setDraft={setDraft}
                            presetCategories={presetCategories}
                            onCoverFileChange={setCoverFile}
                        />
                    )}
                    {activeStep === 1 && <IngredientsStep draft={draft} setDraft={setDraft} units={UNITS} />}
                    {activeStep === 2 && <PreparationStepsStep draft={draft} setDraft={setDraft} />}
                    {activeStep === 3 && <NotesStep draft={draft} setDraft={setDraft} />}

                    <Divider sx={{ my: 2 }} />

                    <Box sx={{ display: "flex", justifyContent: "space-between", gap: 1 }}>
                        <Button
                            variant="text"
                            startIcon={<ArrowForwardIcon />}
                            disabled={activeStep === 0 || submitting}
                            onClick={() => setActiveStep((s) => Math.max(0, s - 1))}
                        >
                            הקודם
                        </Button>

                        {activeStep < stepLabels.length - 1 ? (
                            <Button
                                variant="contained"
                                endIcon={<ArrowBackIcon />}
                                disabled={!canGoNext || submitting}
                                onClick={() => setActiveStep((s) => Math.min(stepLabels.length - 1, s + 1))}
                            >
                                הבא
                            </Button>
                        ) : (
                            <Button variant="contained" disabled={!canGoNext || submitting} onClick={onSubmit}>
                                {submitting ? "שומר..." : mode === "edit" ? "עדכון" : "פרסום"}
                            </Button>
                        )}
                    </Box>

                    {submitError ? (
                        <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                            {submitError}
                        </Typography>
                    ) : null}

                    {!canGoNext ? (
                        <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                            יש להשלים את השדות החיוניים בשלב הנוכחי.
                        </Typography>
                    ) : null}
                </CardContent>
            </Card>
        </Box>
    );
}
