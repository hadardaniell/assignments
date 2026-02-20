import { Body, Controller, Get, Post, Put, Delete, Route, Tags, Path, Patch, UploadedFile } from 'tsoa';
import { UserDTO, UpdateUserDTO, SafeUser } from '../modules/users/users.types';
import { AppError } from '../common/errors/app-error';
import { UserService } from '../modules/users/user.service';

@Route('users')
@Tags('Users')
export class UsersController extends Controller {
  private readonly service: UserService = new UserService();

  @Post('createUser')
  public async createUser(
    @Body() body: UserDTO
  ): Promise<SafeUser> {
    try {
      const user = await this.service.createUserService(body);
      this.setStatus(201);
      return user;
    } catch (err: any) {
      this.setStatus(err.statusCode || 500);
      throw err;
    }
  }

  @Get('getUsers')
  public async getUsers(): Promise<SafeUser[]> {
    try {
      return await this.service.getAllUsersService();
    } catch (err: any) {
      this.setStatus(500);
      throw err;
    }
  }

  @Get('getUserById/{id}')
  public async getUserById(
    @Path() id: string
  ): Promise<SafeUser> {
    try {
      return await this.service.getUserByIdService(id);
    } catch (err: any) {
      this.setStatus(err.statusCode || 500);
      throw err;
    }
  }

  @Put('updateUser/{id}')
  public async updateUser(
    @Path() id: string,
    @Body() body: UpdateUserDTO
  ): Promise<SafeUser> {
    try {
      return await this.service.updateUserService(id, body);
    } catch (err: any) {
      this.setStatus(err.statusCode || 500);
      throw err;
    }
  }

  @Patch('updateProfile/{id}')
  public async updateProfile(
    @Path() id: string,
    @Body() body: { name?: string; avatarUrl?: string }
  ): Promise<SafeUser> {
    try {
      return await this.service.updateUserService(id, body);
    } catch (err: any) {
      this.setStatus(err.statusCode || 500);
      throw err;
    }
  }

  @Post('{id}/uploadAvatar')
  public async uploadAvatar(
    @Path() id: string,
    @UploadedFile('profile_image') file: Express.Multer.File
  ): Promise<{ url: string }> {
    try {
      const imageUrl = await this.service.uploadUserAvatar(id, file);
      return { url: imageUrl };
    } catch (err: any) {
      this.setStatus(err.statusCode || 500);
      throw err;
    }
  }

  @Delete('deleteUser/{id}')
  public async deleteUser(
    @Path() id: string
  ): Promise<void> {
    try {
      await this.service.deleteUserService(id);
      this.setStatus(204);
      return;
    } catch (err: any) {
      this.setStatus(err.statusCode || 500);
      throw err;
    }
  }
}