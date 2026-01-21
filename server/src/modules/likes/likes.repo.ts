import { Types } from "mongoose";
import { Like, LikeModel } from "./like.model";

export class LikesRepo {
    async create(
        userId: Types.ObjectId,
        recipeId: Types.ObjectId
    ): Promise<Like> {
        return LikeModel.create({
            userId,
            recipeId,
            likedAt: new Date(),
        });
    }

    async delete(
        userId: Types.ObjectId,
        recipeId: Types.ObjectId
    ): Promise<boolean> {
        const result = await LikeModel.deleteOne({ userId, recipeId });
        return result.deletedCount === 1;
    }

    async exists(
        userId: Types.ObjectId,
        recipeId: Types.ObjectId
    ): Promise<boolean> {
        const like = await LikeModel.exists({ userId, recipeId });
        return Boolean(like);
    }

    async countByRecipe(
        recipeId: Types.ObjectId
    ): Promise<number> {
        return LikeModel.countDocuments({ recipeId });
    }

    async findByUser(
        userId: Types.ObjectId
    ): Promise<Like[]> {
        return LikeModel.find({ userId }).lean();
    }

    async findByRecipe(
        recipeId: Types.ObjectId
    ): Promise<Like[]> {
        return LikeModel.find({ recipeId }).lean();
    }
}
