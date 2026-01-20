// import { 
//   Controller, 
//   Route, 
//   Post, 
//   Delete, 
//   Path, 
//   Security, 
//   Request, 
//   Tags,
//   SuccessResponse
// } from 'tsoa';
// import { LikeModel } from '../modules/likes/like.model';
// import { AppError } from '../common';

// @Route("likes")
// @Tags("Likes")
// @Security("jwt")
// export class LikesController extends Controller {

//   @Post("{recipeId}")
//   @SuccessResponse("201", "Created")
//   public async addLike(
//     @Path() recipeId: string,
//     @Request() request: any
//   ): Promise<{ message: string }> {
//     const userId = request.user.id;

//     try {
//       await LikeModel.create({
//         userId,
//         recipeId
//       });
//       return { message: "Like added successfully" };
//     } catch (error: any) {
//       // אם האינדקס הייחודי שהגדרת במודל מזהה כפילות
//       if (error.code === 11000) {
//         throw new AppError(400, "You already liked this recipe");
//       }
//       throw error;
//     }
//   }

//   @Delete("{recipeId}")
//   @SuccessResponse("200", "Deleted")
//   public async removeLike(
//     @Path() recipeId: string,
//     @Request() request: any
//   ): Promise<{ message: string }> {
//     const userId = request.user.id;

//     const result = await LikeModel.findOneAndDelete({
//       userId,
//       recipeId
//     });

//     if (!result) {
//       throw new AppError(404, "Like not found");
//     }

//     return { message: "Like removed successfully" };
//   }
// }