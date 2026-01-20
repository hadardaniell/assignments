import { Schema, model, Types, Document } from 'mongoose';

export interface Ingredient {
  name: string;
  quantity?: number;
  unit?: string;
  notes?: string | null;
}

export interface Step {
  index?: number;
  instruction: string;
  durationMinutes?: number;
}

export interface Stats {
  avgRating?: number | null;
  ratingsCount?: number | null;
  cookedCount?: number | null;
  viewsCount?: number | null;
}

export interface Recipe extends Document {
  recipeBookId?: Types.ObjectId;
  createdBy: Types.ObjectId;
  originalRecipeId?: Types.ObjectId | null;
  title: string;
  description?: string | null;
  categories?: string[];
  prepTimeMinutes?: number | null;
  cookTimeMinutes?: number | null;
  totalTimeMinutes?: number | null;
  difficulty?: 'easy' | 'medium' | 'hard';
  ingredients: Ingredient[];
  steps: Step[];
  notes?: string | null;
  coverImageUrl?: string | null;
  sourceType?: 'ai' | 'manual' | 'import';
  sourceId?: Types.ObjectId | null;
  status?: 'draft' | 'published';
  stats?: Stats;
  createdAt: Date;
  updatedAt: Date;
}

const IngredientSchema = new Schema<Ingredient>({
  name: { type: String, required: true },
  quantity: { type: Number, default: null },
  unit: { type: String, default: null },
  notes: { type: String, default: null }
}, { _id: false });

const StepSchema = new Schema<Step>({
  index: { type: Number },
  instruction: { type: String, required: true },
  durationMinutes: { type: Number, default: null }
}, { _id: false });

const StatsSchema = new Schema<Stats>({
  avgRating: { type: Number, default: null },
  ratingsCount: { type: Number, default: 0 },
  cookedCount: { type: Number, default: 0 },
  viewsCount: { type: Number, default: 0 }
}, { _id: false });

const RecipeSchema = new Schema<Recipe>({
  recipeBookId: { type: Schema.Types.ObjectId, ref: 'RecipeBook' },
  createdBy: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
  originalRecipeId: { type: Schema.Types.ObjectId, default: null, ref: 'Recipe' },
  title: { type: String, required: true },
  description: { type: String, default: null },
  categories: { type: [String], default: [] },
  prepTimeMinutes: { type: Number, default: null },
  cookTimeMinutes: { type: Number, default: null },
  totalTimeMinutes: { type: Number, default: null },
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'easy' },
  ingredients: { type: [IngredientSchema], required: true },
  steps: { type: [StepSchema], required: true },
  notes: { type: String, default: null },
  coverImageUrl: { type: String, default: null },
  sourceType: { type: String, enum: ['ai', 'manual', 'import'], default: 'manual' },
  sourceId: { type: Schema.Types.ObjectId, default: null },
  status: { type: String, enum: ['draft', 'published'], default: 'draft' },
  stats: { type: StatsSchema, default: () => ({}) },
  createdAt: { type: Date, required: true, default: () => new Date() },
  updatedAt: { type: Date, required: true, default: () => new Date() }
});

export const RecipeModel = model<Recipe>('Recipe', RecipeSchema);
export default RecipeModel;