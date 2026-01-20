import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { AppError } from "../../common";
import { UserService } from "../users/user.service";
import { UserModel } from "../users/user.model";
import { AuthResponse, LoginDTO, RegisterDTO } from "./auth.types";
import { BlacklistedTokenRepo } from "./blacklistedToken.repo";
import * as crypto from 'crypto';
import { RefreshTokenRepo } from "./refreshToken.repo";

export class AuthService {
  private readonly users: UserService = new UserService();
  private readonly blacklistRepo: BlacklistedTokenRepo = new BlacklistedTokenRepo();
  private readonly refreshTokenRepo = new RefreshTokenRepo();

  // יצירת Access Token לזמן קצר (15 דקות)
  private generateAccessToken(userId: string): string {
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new AppError(500, "Missing JWT secret");
    return jwt.sign({ sub: userId }, secret, { expiresIn: "15m" });
  }

  public async register(body: RegisterDTO): Promise<AuthResponse> {
    const email = body.email?.trim().toLowerCase();
    const name = body.name?.trim();

    if (!email || !body.password || !name) {
      throw new AppError(400, "email, password, name are required");
    }

    const passwordHash = await bcrypt.hash(body.password, 10);

    const user = await this.users.createUserService({
      email,
      passwordHash,
      name,
      avatarUrl: body.avatarUrl ?? null,
      role: "user",
      settings: body.language ? { language: body.language } : undefined,
    } as any);

    const userId = String(user._id);
    const accessToken = this.generateAccessToken(userId);
    const refreshToken = await this.refreshTokenRepo.createRefreshToken(userId);

    // שמירת ה-Refresh Token ב-DB
    await UserModel.findByIdAndUpdate(userId, { $push: { refreshTokens: refreshToken } });

    return { token: accessToken, refreshToken, user };
  }

  public async login(body: LoginDTO): Promise<AuthResponse> {
    const email = body.email?.trim().toLowerCase();
    if (!email || !body.password) {
      throw new AppError(400, "email and password are required");
    }

    const userWithPassword = await this.users.getUserByEmailWithPasswordService(email);
    if (!userWithPassword) throw new AppError(401, "Invalid credentials");

    const isPasswordOk = await bcrypt.compare(body.password, userWithPassword.passwordHash);
    if (!isPasswordOk) throw new AppError(401, "Invalid credentials");

    const userId = String(userWithPassword._id);
    const accessToken = this.generateAccessToken(userId);
    const refreshToken = await this.refreshTokenRepo.createRefreshToken(userId);

    await UserModel.findByIdAndUpdate(userId, { $push: { refreshTokens: refreshToken } });

    const safeUser = await this.users.getUserByIdService(userId);
    return { token: accessToken, refreshToken, user: safeUser };
  }

  public async refresh(oldRefreshToken: string): Promise<AuthResponse> {
    if (!oldRefreshToken) throw new AppError(401, "Refresh token required");

    const tokenData = await this.refreshTokenRepo.findValid(oldRefreshToken);
    if (!tokenData) throw new AppError(401, "Invalid refresh token");

    // rotation
    await this.refreshTokenRepo.revoke(oldRefreshToken);

    const userId = tokenData.userId.toString();
    const newAccessToken = this.generateAccessToken(userId);
    const newRefreshToken = await this.refreshTokenRepo.createRefreshToken(userId);

    const safeUser = await this.users.getUserByIdService(userId);
    return { token: newAccessToken, refreshToken: newRefreshToken, user: safeUser };
  }

  public async logout(refreshToken: string) {
    if (!refreshToken) return;
    await this.refreshTokenRepo.revoke(refreshToken);
  }

  public async isTokenBlacklisted(token: string): Promise<boolean> {
    if (!token) return false;
    return this.blacklistRepo.isBlacklistedDAL(token);
  }
}