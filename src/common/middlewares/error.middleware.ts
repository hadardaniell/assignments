import { Request, Response, NextFunction } from 'express';
import { ValidateError } from 'tsoa';
import { AppError } from '../errors/app-error';

export const errorMiddleware = (
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  // Log the error for debugging
  if (process.env.NODE_ENV !== 'test') {
    console.error(`[Error] ${req.method} ${req.path}:`, err);
  }

  // 1. TSOA validation errors
  if (err instanceof ValidateError) {
    return res.status(400).json({
      message: 'Validation Failed',
      details: err.fields,
    });
  }

  // 2. AppError (business errors)
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      message: err.message,
      code: err.code,
    });
  }

  // 3. Generic Error objects or plain objects
  const errorObj = err as any;
  return res.status(errorObj.statusCode || errorObj.status || 500).json({
    message: errorObj.message || 'Internal server error',
    code: errorObj.code,
  });
};