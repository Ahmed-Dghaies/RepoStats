import { NextFunction, Response, Request } from "express";

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(`[ERROR] ${err.stack}`);

  const status = err.status || 500;

  res.status(status).json({
    success: false,
    error: {
      message: err.message || "Something went wrong",
      status,
    },
  });
};
