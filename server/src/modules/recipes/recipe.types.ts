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

export interface RecipeComment {
  userId: string;
  userName: string;
  text: string;
  createdAt: Date;
}

export interface RecipeDTO {
  Id?: string;
  recipeBookId?: string;
  originalRecipeId?: string | null;
  title: string;
  description?: string | null;
  creatorName?: string;
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
  likesCount?: number;
  commentsCount?: number;
  createdAt?: string;
  updatedAt?: string | null;
  isUserLiked?: boolean;
}

export interface PaginatedRecipes {
  recipes: RecipeDTO[];
  total: number;
  page: number;
  totalPages: number;
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
  sourceType?: SourceType;
}