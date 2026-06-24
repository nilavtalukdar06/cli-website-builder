import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";
import { env } from "src/config/env";
import { ApiError } from "src/utils/error";

export async function jwtAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json(
        new ApiError(
          StatusCodes.UNAUTHORIZED,
          false,
          "no authentication header",
        ),
      );
  }
  const token = authHeader.replace("Bearer ", "");
  try {
    const payload = jwt.verify(token, env.JWT_SECRET!);
    if (typeof payload === "string" || !payload.sub) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json(
          new ApiError(
            StatusCodes.UNAUTHORIZED,
            false,
            "invalid token payload",
          ),
        );
    }
    req.auth = {
      userId: payload.sub,
    };
    next();
  } catch (error) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json(
        new ApiError(StatusCodes.UNAUTHORIZED, false, "invalid token", error),
      );
  }
}
