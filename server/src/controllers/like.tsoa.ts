import {
  Route,
  Tags,
  Controller,
  Post,
  Get,
  Delete,
  Path,
  Query,
  Body
} from "tsoa";
import { LikesService } from "../modules/likes/likes.service";
import { AppError } from "../common";

@Route("likes")
@Tags("Likes")
export class LikesController extends Controller {
  private readonly service: LikesService = new LikesService();

  @Post("like")
  public async likeRecipe(
    @Body() body: { userId: string; recipeId: string }
  ): Promise<void> {
    try {
      const { userId, recipeId } = body;

      if (!userId || !recipeId) {
        throw new AppError(400, "userId and recipeId are required");
      }

      await this.service.likeRecipe(userId, recipeId);
      this.setStatus(201);
      return;
    } catch (err: any) {
      const status = err.statusCode || err.status || 500;
      this.setStatus(status);
      throw err;
    }
  }

  @Delete("unlike")
  public async unlikeRecipe(
    @Query() userId: string,
    @Query() recipeId: string
  ): Promise<void> {
    try {
      if (!userId || !recipeId) {
        throw new AppError(400, "userId and recipeId are required");
      }

      const removed = await this.service.unlikeRecipe(userId, recipeId);
      if (!removed) {
        throw new AppError(404, "Like not found");
      }

      this.setStatus(204);
      return;
    } catch (err: any) {
      this.setStatus(err.statusCode || 500);
      throw err;
    }
  }

  @Get("isLiked")
  public async isRecipeLiked(
    @Query() userId: string,
    @Query() recipeId: string
  ): Promise<{ liked: boolean }> {
    try {
      if (!userId || !recipeId) {
        throw new AppError(400, "userId and recipeId are required");
      }

      const liked = await this.service.isRecipeLikedByUser(userId, recipeId);
      return { liked };
    } catch (err: any) {
      this.setStatus(err.statusCode || 500);
      throw err;
    }
  }

  @Get("count/{recipeId}")
  public async getRecipeLikesCount(
    @Path() recipeId: string
  ): Promise<{ count: number }> {
    try {
      const count = await this.service.getLikesCount(recipeId);
      return { count };
    } catch (err: any) {
      this.setStatus(err.statusCode || 500);
      throw err;
    }
  }

  @Get("byUser/{userId}")
  public async getUserLikes(
    @Path() userId: string
  ): Promise<any[]> {
    try {
      return await this.service.getUserLikes(userId);
    } catch (err: any) {
      this.setStatus(err.statusCode || 500);
      throw err;
    }
  }

  @Get("byLikesRecipe/{recipeId}")
  public async getRecipeLikes(
    @Path() recipeId: string
  ): Promise<any[]> {
    try {
      return await this.service.getRecipeLikes(recipeId);
    } catch (err: any) {
      this.setStatus(err.statusCode || 500);
      throw err;
    }
  }
}
