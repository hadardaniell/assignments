import { Body, Controller, Get, Post, Put, Delete, Route, Tags, Path } from 'tsoa';
import { UserDTO, UpdateUserDTO, SafeUser } from '../modules/users/users.types';

import { AppError } from '../common/errors/app-error';
  
import { UserService } from '../modules/users/user.service';

@Route('users')
@Tags('Users')
export class UsersController extends Controller {

  constructor(private readonly service: UserService) {
    super();
  }

  // Create a new user
  @Post('/')
  public async createUser(
    @Body() body: UserDTO
  ): Promise<SafeUser> {
    try {
      const user = await this.service.createUserService(body);
      this.setStatus(201); // 201 Created
      return user;
    } catch (err: any) {
      if (err instanceof AppError) {
        this.setStatus(err.statusCode);
        throw {
          message: err.message,
          code: err.code,
        };
      }

      this.setStatus(500);
      throw {
        message: 'Internal server error',
      };
    }
  }

  // Get all users
  @Get('/')
  public async getUsers(): Promise<SafeUser[]> {
    try {
      return await this.service.getAllUsersService();
    } catch (err: any) {
      if (err instanceof AppError) {
        this.setStatus(err.statusCode);
        throw {
          message: err.message,
          code: err.code,
        };
      }

      this.setStatus(500);
      throw {
        message: 'Internal server error',
      };
    }
  }

  // Get user by ID
  @Get('{id}')
  public async getUserById(
    @Path() id: string
  ): Promise<SafeUser> {
    try {
      return await this.service.getUserByIdService(id);
    } catch (err: any) {
      if (err instanceof AppError) {
        this.setStatus(err.statusCode);
        throw {
          message: err.message,
          code: err.code,
        };
      }

      this.setStatus(500);
      throw {
        message: 'Internal server error',
      };
    }
  }

  // Update user by ID
  @Put('{id}')
  public async updateUser(
    @Path() id: string,
    @Body() body: UpdateUserDTO
  ): Promise<SafeUser> {
    try {
      return await this.service.updateUserService(id, body);
    } catch (err: any) {
      if (err instanceof AppError) {
        this.setStatus(err.statusCode);
        throw {
          message: err.message,
          code: err.code,
        };
      }

      this.setStatus(500);
      throw {
        message: 'Internal server error',
      };
    }
  }

  // Delete user by ID
  @Delete('{id}')
  public async deleteUser(
    @Path() id: string
  ): Promise<void> {
    try {
      await this.service.deleteUserService(id);
      this.setStatus(204);
      return;
    } catch (err: any) {
      if (err instanceof AppError) {
        this.setStatus(err.statusCode);
        throw {
          message: err.message,
          code: err.code,
        };
      }

      this.setStatus(500);
      throw {
        message: 'Internal server error',
      };
    }
  }
}
