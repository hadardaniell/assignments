import { QueryFilter, UpdateQuery } from 'mongoose';
import { RecipeModel, Recipe } from './recpies.model'; // Explicit import
import { RecipeFilterDTO } from './recipe.types';

export class RecipeRepo {
  /**
   * Creates and saves a new recipe document
   */
  async create(data: Partial<Recipe>): Promise<Recipe> {
    const recipe = new RecipeModel(data);
    return await recipe.save();
  }

  /**
   * Retrieves a recipe by its MongoDB ObjectId
   */
  async findById(id: string): Promise<Recipe | null> {
    return await RecipeModel.findById(id).exec();
  }

  /**
   * Filters recipes with pagination and sorting
   */
  async findMany(filter: RecipeFilterDTO): Promise<Recipe[]> {
    const query: QueryFilter<Recipe> = {};

    if (filter.recipeBookId) query.recipeBookId = filter.recipeBookId;
    if (filter.createdBy) query.createdBy = filter.createdBy;
    if (filter.status) query.status = filter.status;

    // Check for categories array
    if (filter.categories && filter.categories.length > 0) {
      query.categories = { $in: filter.categories };
    }

    if (filter.difficulty) query.difficulty = filter.difficulty;

    // Partial text search on title
    if (filter.search) {
      query.title = { $regex: filter.search, $options: 'i' };
    }
    console.log("FILTER:", filter);
    
    const skip = filter.skip ?? 0;
    const limit = filter.limit ?? 10;
    const sortField = filter.sortBy ?? 'createdAt';
    const sortOrder = filter.sortOrder === 'asc' ? 1 : -1;

    return await RecipeModel.find(query)
      .sort({ [sortField]: sortOrder })
      .skip(skip)
      .limit(limit)
      .exec();
  }

  /**
   * Updates a recipe and returns the document as it looks AFTER the update
   */
  async updateById(id: string, data: UpdateQuery<Recipe>): Promise<Recipe | null> {
    return await RecipeModel.findByIdAndUpdate(
      id,
      data,
      { new: true, runValidators: true }
    ).exec();
  }

  /**
   * Removes a recipe from the database
   */
  async deleteById(id: string): Promise<Recipe | null> {
    return await RecipeModel.findByIdAndDelete(id).exec();
  }
}