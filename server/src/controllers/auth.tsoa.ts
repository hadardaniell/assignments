import { Body, Controller, Get, Post, Query, Request, Route, Security, Tags } from "tsoa";
import { AppError } from "../common";
import { AuthService } from "../modules/auth/auth.service";
import { AuthResponse, LoginDTO, RegisterDTO } from "../modules/auth/auth.types";
import { SafeUser } from "../modules/users/users.types";

@Route("auth")
@Tags("Auth")
export class AuthController extends Controller {
    private readonly service: AuthService = new AuthService();

    @Get("google")
    public async getGoogleUrl(): Promise<{ url: string }> {
        const url = this.service.getGoogleAuthUrl();
        return { url };
    }

    @Get("google-callback")
    public async googleCallback(@Query() code: string): Promise<AuthResponse> {
        try {
            const result = await this.service.authenticateWithCode(code);
            this.setStatus(200);
            return result;
        } catch (err: any) {
            this.setStatus(401);
            throw err;
        }
    }

    @Post("register")
    public async register(@Body() body: RegisterDTO): Promise<AuthResponse> {
        try {
            const result = await this.service.register(body);
            this.setStatus(201);
            return result;
        } catch (err: any) {
            this.setStatus(err.status || err.statusCode || 500);
            throw err;
        }
    }

    @Post("google-login")
    public async googleLogin(@Body() body: { idToken: string }): Promise<AuthResponse> {
        try {
            const result = await this.service.googleLogin(body.idToken);
            this.setStatus(200);
            return result;
        } catch (err: any) {
            this.setStatus(err.status || err.statusCode || 401);
            throw err;
        }
    }

    @Post("login")
    public async login(@Body() body: LoginDTO): Promise<AuthResponse> {
        try {
            const result = await this.service.login(body);
            this.setStatus(200);
            return result;
        } catch (err: any) {
            const status = err.status || err.statusCode || 500;
            this.setStatus(status);
            throw err;
        }
    }

    @Security("jwt")
    @Get("me")
    public async me(@Request() req: any): Promise<SafeUser> {
        try {
            const userId = req.user?.sub;
            const user = await this.service.me(userId);
            this.setStatus(200);
            return user;
        } catch (err: any) {
            this.setStatus(err.status || err.statusCode || 500);
            throw err;
        }
    }

    @Security("jwt")
    @Post("logout")
    public async logout(@Request() req: any): Promise<{ message: string }> {
        try {
            const header = req.headers?.authorization;
            if (!header?.startsWith("Bearer ")) {
                throw new AppError(401, "Unauthorized");
            }
            const token = header.slice("Bearer ".length).trim();
            await this.service.logout(token);
            this.setStatus(200);
            return { message: "Logged out successfully" };
        } catch (err: any) {
            this.setStatus(err.status || err.statusCode || 500);
            throw err;
        }
    }

    @Post("refresh")
    public async refresh(@Body() body: { refreshToken: string }): Promise<AuthResponse> {
        try {
            if (!body.refreshToken) {
                throw new AppError(400, "Refresh token is required");
            }
            const result = await this.service.refresh(body.refreshToken);
            this.setStatus(200);
            return result;
        } catch (err: any) {
            this.setStatus(err.status || err.statusCode || 500);
            throw err;
        }
    }
}