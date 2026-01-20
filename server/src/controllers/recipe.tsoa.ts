import { 
  Route, 
  Tags, 
  Controller, 
  Post, 
  Get, 
  Put, 
  Delete, 
  Body, 
  Path, 
  Query, 
  UploadedFile, 
  Patch, 
  Security, 
  Request 
} from 'tsoa';
import { RecipeService } from '../modules/recipes/recipe.service';
import { AppError } from '../common';
import { RecipeDTO, RecipeFilterDTO, PaginatedRecipes } from '../modules/recipes/recipe.types';

@Route('recipes')
@Tags('Recipes')
export class RecipeController extends Controller {
  private readonly service: RecipeService = new RecipeService();

  @Post('{id}/image')
  @Security("jwt")
  public async uploadImage(
    @Path() id: string,
    @UploadedFile() file: Express.Multer.File
  ): Promise<{ url: string }> {
    if (!file) throw new AppError(400, 'File is required');
    
    const fileName = file.filename || file.originalname;
    const imageUrl = `/uploads/${fileName}`;
    
    await this.service.updateRecipe(id, '', { coverImageUrl: imageUrl });
    return { url: imageUrl };
  }

  @Get('getRecipes')
  public async getRecipes(
    @Query() recipeBookId?: string,
    @Query() status?: any,
    @Query() difficulty?: any,
    @Query() search?: string,
    @Query() page: number = 1,
    @Query() limit: number = 10
  ): Promise<PaginatedRecipes> {
    const filter: RecipeFilterDTO = { recipeBookId, status, difficulty, search };
    return await this.service.listRecipes(filter, page, limit);
  }

  @Post('createRecipe')
  @Security("jwt")
  public async createRecipe(
    @Request() request: any,
    @Body() body: RecipeDTO
  ): Promise<RecipeDTO> {
    const userId = request.user.id;
    const recipe = await this.service.createRecipe(userId, body);
    this.setStatus(201);
    return recipe;
  }

  @Get('getRecipeById/{id}')
  public async getRecipeById(@Path() id: string): Promise<RecipeDTO> {
    const recipe = await this.service.getRecipeById(id);
    if (!recipe) throw new AppError(404, 'Recipe not found');
    return recipe;
  }

  @Put('updateRecipe/{id}')
  @Security("jwt")
  public async updateRecipe(
    @Path() id: string, 
    @Request() request: any,
    @Body() body: Partial<RecipeDTO>
  ): Promise<RecipeDTO> {
    const userId = request.user.id;
    const recipe = await this.service.updateRecipe(id, userId, body);
    if (!recipe) throw new AppError(404, 'Recipe not found');
    return recipe;
  }

  @Delete('deleteRecipe/{id}')
  @Security("jwt")
  public async deleteRecipe(
    @Path() id: string,
    @Request() request: any
  ): Promise<void> {
    const recipe = await this.service.deleteRecipe(id);
    if (!recipe) throw new AppError(404, 'Recipe not found');
    this.setStatus(204);
  }

  @Patch('{id}/view')
  public async incrementViews(@Path() id: string): Promise<void> {
    await this.service.incrementViews(id);
    this.setStatus(204);
  }

  @Patch('{id}/cooked')
  @Security("jwt")
  public async incrementCooked(
    @Path() id: string,
    @Request() request: any
  ): Promise<void> {
    await this.service.incrementCooked(id);
    this.setStatus(204);
  }

  @Get('ai-search')
  public async aiSearch(
    @Query('query') query: string,
    @Request() request: any,
    @Query() recipeBookId?: string
  ): Promise<RecipeDTO[]> {
    const userId = request.user?.id || 'anonymous';
    return await this.service.searchRecipesWithAI(query, userId, recipeBookId || '');
  }
}