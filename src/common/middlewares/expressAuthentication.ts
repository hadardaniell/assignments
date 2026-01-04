import { Request } from "express";
import jwt from "jsonwebtoken";

export async function expressAuthentication(
  request: Request,
  securityName: string,
  _scopes?: string[]
): Promise<any> {
  if (securityName !== "bearerAuth") {
    return Promise.reject(new Error("Unknown security scheme"));
  }

  const header = request.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    return Promise.reject({ status: 401, message: "Unauthorized", code: "UNAUTHORIZED" });
  }

  const token = header.slice("Bearer ".length).trim();
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    return Promise.reject({ status: 500, message: "Missing JWT secret", code: "JWT_SECRET_MISSING" });
  }

  try {
    const payload = jwt.verify(token, secret) as any;

    return { userId: payload.sub };
  } catch {
    return Promise.reject({ status: 401, message: "Invalid token", code: "INVALID_TOKEN" });
  }
}
