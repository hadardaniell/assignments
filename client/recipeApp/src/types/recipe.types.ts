export type Difficulty = "easy" | "medium" | "hard";
export type RecipeStatus = "draft" | "published";
export type SourceType = "ai" | "manual" | "import";

export interface IngredientInput {
  name: string;
  quantity?: number;
  unit?: string;
  notes?: string | null;
}

export interface StepInput {
  index?: number;
  instruction: string;
  durationMinutes?: number;
}

export interface RecipeDTO {
  Id?: string;
  recipeBookId?: string;
  originalRecipeId?: string | null;
  title: string;
  description?: string | null;
  categories?: string[];
  prepTimeMinutes?: number | null;
  cookTimeMinutes?: number | null;
  totalTimeMinutes?: number | null;
  difficulty?: Difficulty;
  ingredients: IngredientInput[];
  steps: StepInput[];
  notes?: string | null;
  coverImageUrl?: string | null;
  sourceType?: SourceType;
  sourceId?: string | null;
  status?: RecipeStatus;
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string | null;
  commentsCount?: number;
}

export type DraftState = {
  recipeBookId: string;
  title: string;
  description: string;
  categories: string[];
  prepTimeMinutes: string;
  cookTimeMinutes: string;
  difficulty: Difficulty;
  coverImageUrl: string;

  ingredients: IngredientInput[];
  steps: StepInput[];
  notes: string;
};

export type RecipeSearchParams = {
  status?: string;
  difficulty?: string;
  search?: string;
  skip?: number;
  limit?: number;
};