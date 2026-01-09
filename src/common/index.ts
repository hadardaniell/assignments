import { Request, Response, NextFunction } from 'express';
import { ValidateError } from 'tsoa';

export class AppError extends Error {
  public statusCode: number;
  public code?: string;

  constructor(statusCode: number, message: string, code?: string) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export const errorMiddleware = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
): Response | void => {
  if (err instanceof ValidateError) {
    return res.status(422).json({
      message: "Validation Failed",
      details: err?.fields,
    });
  }

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      message: err.message,
      code: err.code,
    });
  }

  // Handle generic errors (including internal TSOA errors)
  if (err instanceof Error) {
    const status = (err as any).status || (err as any).statusCode || 500;
    return res.status(status).json({
      message: err.message || "Internal Server Error",
    });
  }

  next();
};