"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecipeModel = void 0;
var mongoose_1 = require("mongoose");
var IngredientSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    quantity: { type: Number, default: null },
    unit: { type: String, default: null },
    notes: { type: String, default: null }
}, { _id: false });
var StepSchema = new mongoose_1.Schema({
    index: { type: Number },
    instruction: { type: String, required: true },
    durationMinutes: { type: Number, default: null }
}, { _id: false });
var StatsSchema = new mongoose_1.Schema({
    avgRating: { type: Number, default: null },
    ratingsCount: { type: Number, default: 0 },
    cookedCount: { type: Number, default: 0 },
    viewsCount: { type: Number, default: 0 }
}, { _id: false });
var RecipeSchema = new mongoose_1.Schema({
    recipeBookId: { type: mongoose_1.Schema.Types.ObjectId, required: true, ref: 'RecipeBook' },
    createdBy: { type: mongoose_1.Schema.Types.ObjectId, required: true, ref: 'User' },
    originalRecipeId: { type: mongoose_1.Schema.Types.ObjectId, default: null, ref: 'Recipe' },
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
    sourceId: { type: mongoose_1.Schema.Types.ObjectId, default: null },
    status: { type: String, enum: ['draft', 'published'], default: 'draft' },
    stats: { type: StatsSchema, default: function () { return ({}); } },
    createdAt: { type: Date, required: true, default: function () { return new Date(); } },
    updatedAt: { type: Date, required: true, default: function () { return new Date(); } }
});
exports.RecipeModel = (0, mongoose_1.model)('Recipe', RecipeSchema);
exports.default = exports.RecipeModel;
