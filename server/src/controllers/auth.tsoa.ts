import { 
  Controller, 
  Route, 
  Post, 
  Body, 
  SuccessResponse, 
  Tags,
  Request,
  Security
} from 'tsoa';
import { AuthService } from '../modules/auth/auth.service';
import { RegisterDTO, LoginDTO, AuthResponse } from '../modules/auth/auth.types';

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

  @Post("refresh")
  @SuccessResponse("200", "OK")
  public async refresh(
    @Body() body: { refreshToken: string }
  ): Promise<AuthResponse> {
    return this.authService.refresh(body.refreshToken);
  }

  @Post("logout")
  @Security("jwt")
  @SuccessResponse("204", "No Content")
  public async logout(
    @Body() body: { refreshToken: string }
  ): Promise<void> {
    await this.authService.logout(body.refreshToken);
    this.setStatus(204);
  }
}