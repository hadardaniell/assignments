import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/app-error';

export const errorMiddleware = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  console.error(err);

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      message: err.message,
      code: err.code,
    });
  }

  return res.status(500).json({
    message: 'Internal server error',
  });
};
