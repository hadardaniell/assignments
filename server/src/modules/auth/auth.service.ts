import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { AppError } from "../../common";
import { UserService } from "../users/user.service";
import { UserModel } from "../users/user.model";
import { AuthResponse, LoginDTO, RegisterDTO } from "./auth.types";
import { BlacklistedTokenRepo } from "./blacklistedToken.repo";

export class AuthService {
  private readonly users: UserService = new UserService();
  private readonly blacklistRepo: BlacklistedTokenRepo = new BlacklistedTokenRepo();

  // יצירת Access Token לזמן קצר (15 דקות)
  private generateAccessToken(userId: string): string {
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new AppError(500, "Missing JWT secret");
    return jwt.sign({ sub: userId }, secret, { expiresIn: "15m" });
  }

  // יצירת Refresh Token לזמן ארוך (7 ימים)
  private generateRefreshToken(userId: string): string {
    const secret = process.env.JWT_REFRESH_SECRET;
    if (!secret) throw new AppError(500, "Missing JWT Refresh secret");
    return jwt.sign({ sub: userId }, secret, { expiresIn: "7d" });
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
    const refreshToken = this.generateRefreshToken(userId);

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
    const refreshToken = this.generateRefreshToken(userId);

    // שמירת ה-Refresh Token ב-DB
    await UserModel.findByIdAndUpdate(userId, { $push: { refreshTokens: refreshToken } });

    const safeUser = await this.users.getUserByIdService(userId);
    return { token: accessToken, refreshToken, user: safeUser };
  }

  public async refresh(oldRefreshToken: string): Promise<AuthResponse> {
    if (!oldRefreshToken) throw new AppError(401, "Refresh token is required");

    try {
      // 1. אימות ה-Refresh Token
      const payload = jwt.verify(oldRefreshToken, process.env.JWT_REFRESH_SECRET!) as { sub: string };
      const userId = payload.sub;

      // 2. בדיקה אם הטוקן קיים במערך של המשתמש ב-DB
      const user = await UserModel.findOne({ _id: userId, refreshTokens: oldRefreshToken });
      if (!user) throw new AppError(401, "Invalid refresh token");

      // 3. יצירת זוג טוקנים חדש (Rotation)
      const newAccessToken = this.generateAccessToken(userId);
      const newRefreshToken = this.generateRefreshToken(userId);

      // 4. החלפת הישן בחדש ב-DB
      await UserModel.findByIdAndUpdate(userId, {
        $pull: { refreshTokens: oldRefreshToken },
        $push: { refreshTokens: newRefreshToken }
      });

      const safeUser = await this.users.getUserByIdService(userId);
      return { token: newAccessToken, refreshToken: newRefreshToken, user: safeUser };
    } catch (err) {
      throw new AppError(401, "Token expired or invalid");
    }
  }

  public async logout(refreshToken: string) {
    if (!refreshToken) return;

    // מחיקת ה-Refresh Token מה-DB כדי שהמשתמש לא יוכל לחדש יותר את החיבור
    await UserModel.findOneAndUpdate(
      { refreshTokens: refreshToken },
      { $pull: { refreshTokens: refreshToken } }
    );

    // אופציונלי: הכנסת ה-Access Token לרשימה שחורה (דורש העברת ה-Access Token לפונקציה)
  }

  public async isTokenBlacklisted(token: string): Promise<boolean> {
    if (!token) return false;
    return this.blacklistRepo.isBlacklistedDAL(token);
  }
}