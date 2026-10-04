import type { Request, Response, NextFunction, RequestHandler } from "express";

export const asyncHandler = (reqHandler: RequestHandler) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(reqHandler(req, res, next)).catch((error) => next(error));
  };
};
