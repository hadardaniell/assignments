// src/middlewares/auth.middleware.ts
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { RevokedTokenModel } from "../modules/auth/revokedToken.model";

export async function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized", code: "UNAUTHORIZED" });
  }

  const token = header.slice("Bearer ".length).trim();
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    return res.status(500).json({ message: "Missing JWT secret", code: "JWT_SECRET_MISSING" });
  }

  try {
    // בדיקה אם הטוקן בבלאק ליסט
    const revoked = await RevokedTokenModel.findOne({ token });
    if (revoked) {
      return res.status(401).json({ message: "Token revoked", code: "TOKEN_REVOKED" });
    }

    const payload = jwt.verify(token, secret) as any;
    (req as any).userId = payload?.sub;
    next();
  } catch {
    return res.status(401).json({ message: "Invalid token", code: "INVALID_TOKEN" });
  }
}
