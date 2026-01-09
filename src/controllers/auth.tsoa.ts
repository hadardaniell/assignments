import { Body, Controller, Get, Post, Request, Route, Security, Tags } from "tsoa";
import { AppError } from "../common";
import { AuthService } from "../modules/auth/auth.service";
import { AuthResponse, LoginDTO, RegisterDTO } from "../modules/auth/auth.types";
import { SafeUser } from "../modules/users/users.types";

@Route("auth")
@Tags("Auth")
export class AuthController extends Controller {
    private readonly service: AuthService = new AuthService();

    @Post("register")
    public async register(@Body() body: RegisterDTO): Promise<AuthResponse> {
        try {
            const result = await this.service.register(body);
            this.setStatus(201);
            return result;
        } catch (err: any) {
            const status = err.statusCode || 500;
            this.setStatus(status);
            throw { message: err.message, code: err.code || "REGISTRATION_ERROR" };
        }
    }

    @Post("login")
    public async login(@Body() body: LoginDTO): Promise<AuthResponse> {
        try {
            const result = await this.service.login(body);
            this.setStatus(200);
            return result;
        } catch (err: any) {
            // Service returns 401 for invalid credentials
            const status = err.statusCode || 401;
            this.setStatus(status);
            throw { message: err.message, code: err.code || "AUTH_ERROR" };
        }
    }

    @Security("bearerAuth")
    @Get("me")
    public async me(@Request() req: any): Promise<SafeUser> {
        try {
            const userId = req.user?.userId;
            const user = await this.service.me(userId);
            this.setStatus(200);
            return user;
        } catch (err: any) {
            this.setStatus(err.statusCode || 401);
            throw { message: err.message, code: err.code || "UNAUTHORIZED" };
        }
    }

    @Security("bearerAuth")
    @Post("logout")
    public async logout(@Request() req: any): Promise<{ message: string }> {
        try {
            const authHeader = req.headers.authorization;
            const token = authHeader.split(" ")[1];
            await this.service.logout(token);
            this.setStatus(200);
            return { message: "Logged out successfully" };
        } catch (err: any) {
            this.setStatus(err.statusCode || 500);
            throw { message: err.message, code: err.code };
        }
    }
}