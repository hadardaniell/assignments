import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import { AppError } from "../../common";
import { UserService } from "../users/user.service";
import { UserModel } from "../users/user.model";
import { AuthResponse, LoginDTO, RegisterDTO } from "./auth.types";
import { BlacklistedTokenRepo } from "./blacklistedToken.repo";
import { RefreshTokenRepo } from "./refreshToken.repo";

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export class AuthService {
  private readonly users: UserService = new UserService();
  private readonly blacklistRepo: BlacklistedTokenRepo = new BlacklistedTokenRepo();
  private readonly refreshTokenRepo = new RefreshTokenRepo();

  private generateAccessToken(userId: string): string {
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new AppError(500, "Missing JWT secret");
    return jwt.sign({ sub: userId }, secret, { expiresIn: "15m" });
  }

  public async googleLogin(idToken: string): Promise<AuthResponse> {
    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    if (!payload) throw new AppError(401, "Invalid Google token");

    const { sub: googleId, email, name, picture } = payload;
    
    let user = await UserModel.findOne({ googleId });

    if (!user) {
      user = await UserModel.findOne({ email: email?.toLowerCase() });
      if (user) {
        user.googleId = googleId;
        await user.save();
      } else {
        user = await UserModel.create({
          email: email?.toLowerCase(),
          name: name || "Google User",
          googleId,
          avatarUrl: picture,
          role: "user"
        });
      }
    }

    const userId = String(user._id);
    const accessToken = this.generateAccessToken(userId);
    const refreshToken = await this.refreshTokenRepo.createRefreshToken(userId);

    const safeUser = await this.users.getUserByIdService(userId);
    return { token: accessToken, refreshToken, user: safeUser };
  }

  public async register(body: RegisterDTO): Promise<AuthResponse> {
    const email = body.email?.trim().toLowerCase();
    const name = body.name?.trim();

    if (!email || !name) throw new AppError(400, "email and name are required");

    let passwordHash;
    if (body.password) {
      passwordHash = await bcrypt.hash(body.password, 10);
    }

    const user = await this.users.createUserService({
      email,
      passwordHash,
      name,
      avatarUrl: body.avatarUrl ?? null,
      googleId: body.googleId,
      role: "user",
      settings: body.language ? { language: body.language } : undefined,
    } as any);

    const userId = String(user._id);
    const accessToken = this.generateAccessToken(userId);
    const refreshToken = await this.refreshTokenRepo.createRefreshToken(userId);

    return { token: accessToken, refreshToken, user };
  }

  public async login(body: LoginDTO): Promise<AuthResponse> {
    const email = body.email?.trim().toLowerCase();
    if (!email || !body.password) throw new AppError(400, "email and password are required");

    const userWithPassword = await this.users.getUserByEmailWithPasswordService(email);
    if (!userWithPassword || !userWithPassword.passwordHash) throw new AppError(401, "Invalid credentials");

    const isPasswordOk = await bcrypt.compare(body.password, userWithPassword.passwordHash);
    if (!isPasswordOk) throw new AppError(401, "Invalid credentials");

    const userId = String(userWithPassword._id);
    const accessToken = this.generateAccessToken(userId);
    const refreshToken = await this.refreshTokenRepo.createRefreshToken(userId);

    const safeUser = await this.users.getUserByIdService(userId);
    return { token: accessToken, refreshToken, user: safeUser };
  }

  public async refresh(oldRefreshToken: string): Promise<AuthResponse> {
    if (!oldRefreshToken) throw new AppError(401, "Refresh token required");
    const tokenData = await this.refreshTokenRepo.findValid(oldRefreshToken);
    if (!tokenData) throw new AppError(401, "Invalid refresh token");

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

  public async me(userId: string) {
    if (!userId) throw new AppError(401, "Unauthorized");
    return this.users.getUserByIdService(userId);
  }

  public async isTokenBlacklisted(token: string): Promise<boolean> {
    return this.blacklistRepo.isBlacklistedDAL(token);
  }
}