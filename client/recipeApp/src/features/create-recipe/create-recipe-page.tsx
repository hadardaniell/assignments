import { useMemo, useState } from "react";
import { Box, Button, Card, CardContent, Divider, Step, StepLabel, Stepper, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import type { DraftState, RecipeDTO, RecipeStatus } from "./recipe.types";
import { DetailsStep } from "./steps/detals-step";
import { IngredientsStep } from "./steps/ingredients-step";
import { PreparationStepsStep } from "./steps/preparationSteps-step";
import { NotesStep } from "./steps/notes-step";
import { useNavigate } from "react-router-dom";
import { recipesApi } from "../../data-access/recipe.api";
import { useAuth } from "../../context/auth.context";
import { colors } from '../../assets/_colors';

const stepLabels = ["פרטים יבשים", "מצרכים", "שלבי הכנה", "הערות מיוחדות"];
const presetCategories = [
    "איטלקי",
    "קינוחים",
    "בשרי",
    "טבעוני",
    "צמחוני",
    "חלבי",
    "ארוחת בוקר",
    "מרקים",
    "סלטים",
    "אפייה",
] as const;

const UNITS = [
    "כוס",
    "כף",
    "כפית",
    "גרם",
    "ק״ג",
    "מ״ל",
    "ליטר",
    "יחידה",
    "שן",
    "חבילה",
];

export function CreateRecipePage() {
    const { user } = useAuth();

    const navigate = useNavigate();
    const [activeStep, setActiveStep] = useState(0);
    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);

    const [draft, setDraft] = useState<DraftState>({
        recipeBookId: "",
        title: "",
        description: "",
        categories: [],
        prepTimeMinutes: "",
        cookTimeMinutes: "",
        difficulty: "",
        coverImageUrl: "",
        ingredients: [{ name: "", quantity: undefined, unit: "", notes: null }],
        steps: [{ instruction: "", durationMinutes: undefined }],
        notes: "",
    });

    const totalTimeMinutes = useMemo(() => {
        const p = Number(draft.prepTimeMinutes || 0);
        const c = Number(draft.cookTimeMinutes || 0);
        const sum = (Number.isFinite(p) ? p : 0) + (Number.isFinite(c) ? c : 0);
        return sum > 0 ? sum : null;
    }, [draft.prepTimeMinutes, draft.cookTimeMinutes]);

    const canGoNext = useMemo(() => {
        if (activeStep === 0) return !!draft.title.trim();
        if (activeStep === 1) return draft.ingredients.every((i) => i.name.trim().length > 0);
        if (activeStep === 2) return draft.steps.every((s) => s.instruction.trim().length > 0);
        return true;
    }, [activeStep, draft]);

    const buildDTO = (status: RecipeStatus): RecipeDTO => {
        const prep = draft.prepTimeMinutes ? Number(draft.prepTimeMinutes) : null;
        const cook = draft.cookTimeMinutes ? Number(draft.cookTimeMinutes) : null;

        return {
            recipeBookId: draft.recipeBookId,
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
            createdBy: user?._id
        };
    };

    const onSaveDraft = async () => {
        const dto = buildDTO("draft");
        console.log("SAVE DRAFT DTO:", dto);
        try {
            const res = await recipesApi.createRecipe(dto);
            console.log("Draft saved:", res);
            navigate("/profile");
        } catch (err) {
            console.error("Failed to save draft", err);
        }
    };

    const onPublish = async () => {
        const dto = buildDTO("published");
        setSubmitting(true);
        setSubmitError(null);

        try {
            const created = await recipesApi.createRecipe(dto);
            console.log("PUBLISHED RECIPE:", created);

            // אופציה: נווטי לפרופיל / פיד / עמוד מתכון
            // navigate(`/recipes/${created.Id ?? created._id}`); // תלוי איך המודל אצלך חוזר
            navigate("/profile");
        } catch (err: any) {
            console.error("publish failed", err);
            const msg =
                err?.response?.data?.message ||
                err?.message ||
                "שגיאה בפרסום המתכון, נסי שוב";
            setSubmitError(msg);
        } finally {
            setSubmitting(false);
        }
    };


    return (
        <Box dir="rtl" sx={{
            maxWidth: 980, mx: "auto",
        }}>
            <Typography variant="h5" sx={{ fontWeight: 900, mb: 2, display: 'flex', justifyContent: 'center',
                color: colors.BROWNKITCHEN.brownie
             }}>
                יצירת מתכון חדש
            </Typography>

            <Card sx={{ borderRadius: 3, boxShadow: "none" }}>
                <CardContent>
                    <Stepper activeStep={activeStep} alternativeLabel>
                        {stepLabels.map((label) => (
                            <Step key={label} sx={{
                                "& .Mui-completed": { color: colors.COLORFUL.fresh_green + " !important" }
                            }}>
                                <StepLabel sx={{
                                    "& .MuiStepLabel-label.Mui-active": {
                                        fontWeight: 700
                                    }
                                }}>{label}</StepLabel>
                            </Step>
                        ))}
                    </Stepper>

                    <Divider sx={{ my: 2 }} />

                    {activeStep === 0 && (
                        <DetailsStep draft={draft} setDraft={setDraft} totalTimeMinutes={totalTimeMinutes} presetCategories={presetCategories} />
                    )}
                    {activeStep === 1 && <IngredientsStep draft={draft} setDraft={setDraft} units={UNITS} />}
                    {activeStep === 2 && <PreparationStepsStep draft={draft} setDraft={setDraft} />}
                    {activeStep === 3 && <NotesStep draft={draft} setDraft={setDraft} />}

                    <Divider sx={{ my: 2 }} />

                    <Box sx={{ display: "flex", justifyContent: "space-between", gap: 1 }}>
                        <Button
                            variant="text"
                            startIcon={<ArrowForwardIcon />}
                            disabled={activeStep === 0}
                            onClick={() => setActiveStep((s) => Math.max(0, s - 1))}
                        >
                            הקודם
                        </Button>

                        <Box sx={{ display: "flex", gap: 1 }}>
                            <Button variant="outlined" onClick={onSaveDraft}>
                                שמירה כטיוטה
                            </Button>

                            {activeStep < stepLabels.length - 1 ? (
                                <Button
                                    variant="contained"
                                    endIcon={<ArrowBackIcon />}
                                    disabled={!canGoNext}
                                    onClick={() => setActiveStep((s) => Math.min(stepLabels.length - 1, s + 1))}
                                >
                                    הבא
                                </Button>
                            ) : (
                                <Button
                                    variant="contained"
                                    disabled={!canGoNext || submitting}
                                    onClick={onPublish}
                                >
                                    {submitting ? "מפרסם..." : "פרסום"}
                                </Button>
                            )}
                        </Box>
                    </Box>
                    {submitError && (
                        <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                            {submitError}
                        </Typography>
                    )}
                    {!canGoNext && (
                        <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                            יש להשלים את השדות החיוניים בשלב הנוכחי.
                        </Typography>
                    )}
                </CardContent>
            </Card>
        </Box >
    );
}
