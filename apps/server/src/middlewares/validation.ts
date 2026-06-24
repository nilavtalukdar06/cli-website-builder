import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";
import { ApiError } from "../utils/error";

export const validate =
  (schema: ZodSchema) => (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      throw new ApiError(
        400,
        false,
        "validation failed",
        result.error.flatten(),
      );
    }
    req.body = result.data;
    next();
  };
