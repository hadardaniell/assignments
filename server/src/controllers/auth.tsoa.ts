import { 
  Controller, 
  Route, 
  Post, 
  Body, 
  SuccessResponse, 
  Tags,
  Request
} from 'tsoa';
import { AuthService } from '../modules/auth/auth.service';
import { RegisterDTO, LoginDTO, AuthResponse } from '../modules/auth/auth.types';
import { Request as ExRequest } from 'express';

@Route("auth")
@Tags("Auth")
export class AuthController extends Controller {
  private readonly authService = new AuthService();

  @Post("register")
  @SuccessResponse("201", "Created")
  public async register(
    @Body() requestBody: RegisterDTO
  ): Promise<AuthResponse> {
    this.setStatus(201);
    return this.authService.register(requestBody);
  }

  @Post("login")
  @SuccessResponse("200", "OK")
  public async login(
    @Body() requestBody: LoginDTO
  ): Promise<AuthResponse> {
    return this.authService.login(requestBody);
  }

  @Post("logout")
  @SuccessResponse("204", "No Content")
  public async logout(
    @Request() request: ExRequest
  ): Promise<void> {
    const authHeader = request.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      await this.authService.logout(token);
    }
    this.setStatus(204);
  }
}