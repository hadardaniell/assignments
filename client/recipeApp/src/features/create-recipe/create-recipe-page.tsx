import type { DraftState } from "../../types/recipe.types";
import { RecipeFormStepper } from "./recipe-form-stepper";
import { useNavigate } from "react-router-dom";

export function CreateRecipePage() {
  const navigate = useNavigate();

  const emptyDraft: DraftState = {
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
  };

  return (
    <RecipeFormStepper
      mode="create"
      initialDraft={emptyDraft}
      onDone={() => navigate("/profile")}
    />
  );
}
