import {
  Controller,
  Route,
  Tags,
  Get,
  Post,
  Put,
  Delete,
  Path,
  Body,
  SuccessResponse,
} from 'tsoa';
// import { CommentsService } from './comments.service';
// import { CommentDTO, UpdateCommentDTO } from './comments.types';
import { Comment } from '../modules/comments/comments.model';
// import { AppError } from '../../common/errors/app-error';
import { CommentsService } from '../modules/comments/comments.service';
import { AppError } from '../common';
import { CommentDTO, UpdateCommentDTO } from '../modules/comments/comments.types';

@Route('comments')
@Tags('Comments')
export class CommentsController extends Controller {
  constructor(private readonly service: CommentsService = new CommentsService()) {
    super();
  }

  @Post('create')
  @SuccessResponse('201', 'Created')
  public async createComment(@Body() input: CommentDTO): Promise<CommentDTO> {
    if (!input.recipeId || !input.createdBy) {
      throw new AppError(400, 'recipeId and createdBy are required');
    }

    const comment = await this.service.createComment(input);
    this.setStatus(201);
    return comment;
  }

  @Get('getCommentById/{commentId}')
  public async getCommentById(@Path() commentId: string): Promise<CommentDTO> {
    const comment = await this.service.getCommentById(commentId);
    if (!comment) throw new AppError(404, 'Comment not found');
    return comment;
  }

  @Get('recipe/getCommentsByRecipe/{recipeId}')
  public async getCommentsByRecipe(@Path() recipeId: string): Promise<CommentDTO[]> {
    if (!recipeId) throw new AppError(400, 'recipeId is required');
    return this.service.getCommentsByRecipe(recipeId);
  }

  @Put('update/{commentId}')
  public async updateComment(
    @Path() commentId: string,
    @Body() input: UpdateCommentDTO
  ): Promise<CommentDTO> {
    const comment = await this.service.updateComment(commentId, input);
    if (!comment) throw new AppError(404, 'Comment not found');
    return comment;
  }

  @Delete('delete/{commentId}')
  public async deleteComment(@Path() commentId: string): Promise<void> {
    const comment = await this.service.deleteComment(commentId);
    if (!comment) throw new AppError(404, 'Comment not found');
    this.setStatus(204);
    return;
  }
}
