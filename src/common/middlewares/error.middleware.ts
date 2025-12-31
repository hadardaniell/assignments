import { Request, Response, NextFunction } from 'express';
import { ValidateError } from 'tsoa';
import { AppError } from '../errors/app-error';

export const errorMiddleware = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  console.error(err);

  // TSOA validation errors
  if (err instanceof ValidateError) {
    return res.status(422).json({
      message: 'Validation Failed',
      details: err.fields,
    });
  }

  // AppError (business errors)
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      message: err.message,
      code: err.code,
    });
  }

  // Errors thrown as plain objects from controllers
  if (typeof err === 'object' && err !== null) {
    const e = err as any;

    if (e.message) {
      return res.status(e.statusCode ?? e.status ?? 500).json({
        message: e.message,
        code: e.code,
      });
    }
  }

  return res.status(500).json({
    message: 'Internal server error',
  });
};
