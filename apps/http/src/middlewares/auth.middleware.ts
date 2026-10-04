import jwt, { type JwtPayload } from "jsonwebtoken";
import { ApiError } from "../utils/apiError";
import type { NextFunction, Request, Response } from "express";

declare global {
  namespace Express {
    export interface Request {
      userId?: string;
    }
  }
}

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = req.headers.authorization?.slice(7);
  if (!token) {
    throw new ApiError(402, "invalid or missing token");
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

  req.userId = decoded.userId;
  next();
};
