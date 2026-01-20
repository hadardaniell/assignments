import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { AppError } from "../../common";
import { UserService } from "../users/user.service";
import { AuthResponse, LoginDTO, RegisterDTO } from "./auth.types";
import { BlacklistedTokenRepo } from "./blacklistedToken.repo";

export class AuthService {
  private readonly users: UserService = new UserService();
  private readonly blacklistRepo: BlacklistedTokenRepo = new BlacklistedTokenRepo();

  private signToken(userId: string): string {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new AppError(500, "Missing JWT secret", "JWT_SECRET_MISSING");
    }
    return jwt.sign({ sub: userId }, secret, { expiresIn: "7d" });
  }

  public async register(body: RegisterDTO): Promise<AuthResponse> {
    const email = body.email?.trim().toLowerCase();
    const name = body.name?.trim();

    if (!email || !body.password || !name) {
      throw new AppError(400, "email, password, name are required", "VALIDATION_ERROR");
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

    const userId = String((user as any)._id ?? (user as any).id);
    const token = this.signToken(userId);

    return { token, user };
  }

  public async login(body: LoginDTO): Promise<AuthResponse> {
    const email = body.email?.trim().toLowerCase();
    
    if (!email || !body.password) {
      throw new AppError(400, "email and password are required", "VALIDATION_ERROR");
    }

    // 1. Get the user by email
    const userWithPassword = await this.users.getUserByEmailWithPasswordService(email);
    
    // If the email doesn't exist in DB, your test wants a 401
    if (!userWithPassword) {
      throw new AppError(401, "Invalid credentials");
    }
    
    // 2. Check the password
    const isPasswordOk = await bcrypt.compare(body.password, userWithPassword.passwordHash);
    
    // If password is wrong, your test wants a 401
    if (!isPasswordOk) {
      throw new AppError(401, "Invalid credentials");
    }

    try {
      // 3. Generate token and get the safe user object
      const userId = String(userWithPassword._id ?? userWithPassword.id);
      const token = this.signToken(userId);
      
      // If this specific call throws a 404 (because it's a shared method), 
      // we catch it so the login endpoint returns 401 instead.
      const safeUser = await this.users.getUserByIdService(userId);
      
      return { token, user: safeUser };
    } catch (err: any) {
      if (err.statusCode === 404) {
        throw new AppError(401, "Invalid credentials");
      }
      throw err;
    }
  }

  public async me(userId: string) {
    if (!userId) throw new AppError(401, "Unauthorized", "UNAUTHORIZED");
    return this.users.getUserByIdService(userId);
  }

  public async logout(token: string) {
    if (!token) return;

    const decoded: any = jwt.decode(token);
    const exp = decoded?.exp;

    if (!exp || typeof exp !== "number") return;

    const expiresAt = new Date(exp * 1000);
    await this.blacklistRepo.addToBlacklistDAL(token, expiresAt);
  }

  public async isTokenBlacklisted(token: string): Promise<boolean> {
    if (!token) return false;
    return this.blacklistRepo.isBlacklistedDAL(token);
  }
}