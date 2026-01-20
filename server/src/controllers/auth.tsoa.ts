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
            const status = err.statusCode || err.status || 500;
            this.setStatus(status);
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
            const status = err.statusCode || err.status || 500;
            this.setStatus(status);
            throw err;
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
            const status = err.statusCode || err.status || 500;
            this.setStatus(status);
            throw err;
        }
    }

    @Security("bearerAuth")
    @Post("logout")
    public async logout(@Request() req: any): Promise<{ message: string }> {
        try {
            const header = req.headers?.authorization;
            if (!header?.startsWith("Bearer ")) {
                throw new AppError(401, "Unauthorized", "UNAUTHORIZED");
            }

            const token = header.slice("Bearer ".length).trim();
            await this.service.logout(token);

            this.setStatus(200);
            return { message: "Logged out successfully" };
        } catch (err: any) {
            const status = err.statusCode || err.status || 500;
            this.setStatus(status);
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
            const status = err.statusCode || err.status || 500;
            this.setStatus(status);
            throw err;
        }
    }
}