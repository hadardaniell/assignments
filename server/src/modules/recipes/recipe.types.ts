export type Difficulty = 'easy' | 'medium' | 'hard';
export type RecipeStatus = 'draft' | 'published';
export type SourceType = 'ai' | 'manual' | 'import';

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
  recipeBookId: string;
  originalRecipeId?: string | null;
  title: string;
  description?: string | null;
  creatorName?: string; // <--- השדה החדש עבור ה-UI (שם השף או המשתמש)
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
  createdBy?: string; // ה-ID הטכני של המשתמש
  createdAt?: string;
  updatedAt?: string | null;
}

export type UpdateRecipeDTO = Partial<RecipeDTO>;

export interface RecipeFilterDTO {
  recipeBookId?: string;
  createdBy?: string;
  status?: RecipeStatus;
  categories?: string[];
  difficulty?: Difficulty;
  search?: string;
  skip?: number;
  limit?: number;
  sortBy?: 'createdAt' | 'updatedAt' | 'title';
  sortOrder?: 'asc' | 'desc';
}