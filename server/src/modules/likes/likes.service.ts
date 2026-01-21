import { Types } from "mongoose";
import { LikesRepo } from "./likes.repo";

export class LikesService {
  private readonly likesRepo: LikesRepo = new LikesRepo();

  async likeRecipe(userId: string, recipeId: string): Promise<void> {
    const userObjectId = new Types.ObjectId(userId);
    const recipeObjectId = new Types.ObjectId(recipeId);

    const alreadyLiked = await this.likesRepo.exists(
      userObjectId,
      recipeObjectId
    );

    if (alreadyLiked) {
      throw new Error("Recipe already liked");
    }

    try {
      await this.likesRepo.create(userObjectId, recipeObjectId);
    } catch (err: any) {
      if (err.code === 11000) {
        throw new Error("Recipe already liked");
      }
      throw err;
    }
  }

  async unlikeRecipe(userId: string, recipeId: string): Promise<boolean> {
    const userObjectId = new Types.ObjectId(userId);
    const recipeObjectId = new Types.ObjectId(recipeId);

    return this.likesRepo.delete(userObjectId, recipeObjectId);
  }

  async isRecipeLikedByUser(
    userId: string,
    recipeId: string
  ): Promise<boolean> {
    return this.likesRepo.exists(
      new Types.ObjectId(userId),
      new Types.ObjectId(recipeId)
    );
  }

  async getLikesCount(recipeId: string): Promise<number> {
    return this.likesRepo.countByRecipe(new Types.ObjectId(recipeId));
  }

  async getUserLikes(userId: string) {
    return this.likesRepo.findByUser(new Types.ObjectId(userId));
  }

  async getRecipeLikes(recipeId: string) {
    return this.likesRepo.findByRecipe(new Types.ObjectId(recipeId));
  }
}
