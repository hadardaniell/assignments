import { QueryFilter, UpdateQuery } from 'mongoose';
import { RecipeModel, Recipe } from './recpies.model';
import { RecipeFilterDTO } from './recipe.types';

export class RecipeRepo {
  async create(data: Partial<Recipe>): Promise<Recipe> {
    const recipe = new RecipeModel(data);
    const savedRecipe = await recipe.save();
    return await savedRecipe.populate('createdBy', 'firstName lastName name');
  }

  async findById(id: string): Promise<Recipe | null> {
    return await RecipeModel.findById(id)
      .populate('createdBy', 'firstName lastName name')
      .exec();
  }

  async findMany(filter: RecipeFilterDTO): Promise<Recipe[]> {
    const query: any = {};

    if (filter.recipeBookId) query.recipeBookId = filter.recipeBookId;
    if (filter.createdBy) query.createdBy = filter.createdBy;
    if (filter.status) query.status = filter.status;

    if (filter.categories && filter.categories.length > 0) {
      query.categories = { $in: filter.categories };
    }

    if (filter.difficulty) query.difficulty = filter.difficulty;

    if (filter.search) {
      query.$or = [
        { title: { $regex: filter.search, $options: 'i' } },
        { description: { $regex: filter.search, $options: 'i' } },
        { 'ingredients.name': { $regex: filter.search, $options: 'i' } }
      ];
    }
    
    const skip = filter.skip ?? 0;
    const limit = filter.limit ?? 10;
    const sortField = filter.sortBy ?? 'createdAt';
    const sortOrder = filter.sortOrder === 'asc' ? 1 : -1;

    return await RecipeModel.find(query)
      .populate('createdBy', 'firstName lastName name')
      .sort({ [sortField]: sortOrder })
      .skip(skip)
      .limit(limit)
      .exec();
  }

  async updateById(id: string, data: UpdateQuery<Recipe>): Promise<Recipe | null> {
    return await RecipeModel.findByIdAndUpdate(
      id,
      data,
      { new: true, runValidators: true }
    )
    .populate('createdBy', 'firstName lastName name')
    .exec();
  }

  async deleteById(id: string): Promise<Recipe | null> {
    return await RecipeModel.findByIdAndDelete(id).exec();
  }
}