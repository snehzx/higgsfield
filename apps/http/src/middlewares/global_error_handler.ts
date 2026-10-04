import type { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/apiError";
import { ApiResponse } from "../utils/apiResponse";

export const errMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (err instanceof ApiError) {
    return res.json(
      new ApiResponse(err.statusCode, {
        success: false,
        message: err.message,
      }),
    );
  }
  return res.json(
    new ApiResponse(500, {
      success: false,
      message: "internal server error",
    }),
  );
};
