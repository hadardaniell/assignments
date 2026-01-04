// src/modules/auth/auth.service.ts
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { AppError } from "../../common";
import { UserService } from "../users/user.service";
import { AuthResponse, LoginDTO, RegisterDTO } from "./auth.types";
import { RevokedTokenModel } from "./revokedToken.model";

export class AuthService {
  private readonly users: UserService = new UserService();

  private signToken(userId: string): string {
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new AppError(500, "Missing JWT secret", "JWT_SECRET_MISSING");
    return jwt.sign({ sub: userId }, secret, { expiresIn: "7d" });
  }

  public async register(body: RegisterDTO): Promise<AuthResponse> {
    const email = body.email?.trim().toLowerCase();
    const name = body.name?.trim();

    if (!email || !body.password || !name) {
      throw new AppError(400, "email, password, name are required", "VALIDATION_ERROR");
    }

    const passwordHash = await bcrypt.hash(body.password, 10);

    // משתמשים בשדות של המודל שלך
    const user = await this.users.createUserService({
      email,
      passwordHash,
      name,
      avatarUrl: body.avatarUrl ?? null,
      role: "user",
      settings: body.language ? { language: body.language } : undefined,
      createdAt: new Date(),
      updatedAt: undefined,
    } as any);

    const userId = String((user as any)._id ?? (user as any).id);
    const token = this.signToken(userId);

    return { token, user };
  }

  public async login(body: LoginDTO): Promise<AuthResponse> {
    const email = body.email?.trim().toLowerCase();
    if (!email || !body.password) {
      throw new AppError(400, "email and password are required", "VALIDATION_ERROR");
    }

    const userWithPassword = await this.users.getUserByEmailWithPasswordService(email);
    if (!userWithPassword) {
      throw new AppError(401, "Invalid credentials", "INVALID_CREDENTIALS");
    }

    const ok = await bcrypt.compare(body.password, userWithPassword.passwordHash);
    if (!ok) {
      throw new AppError(401, "Invalid credentials", "INVALID_CREDENTIALS");
    }

    const userId = String(userWithPassword._id ?? userWithPassword.id);
    const token = this.signToken(userId);

    const safe = await this.users.getUserByIdService(userId);
    return { token, user: safe };
  }

  public async me(userId: string) {
    if (!userId) throw new AppError(401, "Unauthorized", "UNAUTHORIZED");
    return this.users.getUserByIdService(userId);
  }

  public async logout(token: string) {
  const decoded: any = jwt.decode(token);
  if (!decoded?.exp) return; // אין Expiration? לא מוסיפים

  const expiresAt = new Date(decoded.exp * 1000);
  await RevokedTokenModel.create({ token, expiresAt });
}
}
