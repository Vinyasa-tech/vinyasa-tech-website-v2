import { Request, Response, NextFunction } from "express";

interface AppError extends Error {
  statusCode?: number;
}

export const errorMiddleware = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error("Server Error:", err);

  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal server error",
  });
};