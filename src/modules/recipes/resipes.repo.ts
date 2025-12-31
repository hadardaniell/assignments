import { QueryFilter, UpdateQuery } from 'mongoose';
import RecipeModel, { Recipe } from './recpies.model';
import { RecipeFilterDTO } from './recipe.types';
import _mongoose from 'mongoose';

export class RecipeRepo {
  async create(data: Partial<Recipe>): Promise<Recipe> {
    const recipe = new RecipeModel(data);
    return recipe.save();
  }

  async findById(id: string): Promise<Recipe | null> {
    return RecipeModel.findById(id).exec();
  }

  async findMany(filter: RecipeFilterDTO): Promise<Recipe[]> {
    const query: QueryFilter<Recipe> = {};

    if (filter.recipeBookId) query.recipeBookId = filter.recipeBookId;
    if (filter.createdBy) query.createdBy = filter.createdBy;
    if (filter.status) query.status = filter.status;
    if (filter.categories?.length) query.categories = { $in: filter.categories };
    if (filter.difficulty) query.difficulty = filter.difficulty;
    if (filter.search) query.title = { $regex: filter.search, $options: 'i' };

    const skip = filter.skip ?? 0;
    const limit = filter.limit ?? 20;

    const sortField = filter.sortBy ?? 'createdAt';
    const sortOrder = filter.sortOrder === 'asc' ? 1 : -1;

    return RecipeModel.find(query)
      .sort({ [sortField]: sortOrder })
      .skip(skip)
      .limit(limit)
      .exec();
  }

  async updateById(id: string, data: UpdateQuery<Recipe>): Promise<Recipe | null> {
    return RecipeModel.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  async deleteById(id: string): Promise<Recipe | null> {
    return RecipeModel.findByIdAndDelete(id).exec();
  }
}