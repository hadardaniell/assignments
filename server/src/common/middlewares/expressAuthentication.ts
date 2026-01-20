import { Request } from "express";
import jwt from "jsonwebtoken";
import { AuthService } from "../../modules/auth/auth.service";

const authService = new AuthService();

export async function expressAuthentication(
  request: Request,
  securityName: string,
  _scopes?: string[]
): Promise<any> {
  if (securityName !== "jwt") {
    return Promise.reject(new Error("Unknown security scheme"));
  }

  const header = request.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    return Promise.reject({ status: 401, message: "Unauthorized", code: "UNAUTHORIZED" });
  }

  const token = header.slice("Bearer ".length).trim();
  const secret = process.env.JWT_SECRET || "your_secret_key";
  
  if (!secret) {
    return Promise.reject({ status: 500, message: "Missing JWT secret", code: "JWT_SECRET_MISSING" });
  }

  try {
    const blacklisted = await authService.isTokenBlacklisted(token);
    if (blacklisted) {
      return Promise.reject({ status: 401, message: "Token revoked", code: "TOKEN_REVOKED" });
    }

    const payload = jwt.verify(token, secret) as any;

    return { 
      id: payload.sub || payload.id,
      ...payload 
    };
  } catch (err) {
    return Promise.reject({ status: 401, message: "Invalid token", code: "INVALID_TOKEN" });
  }
}