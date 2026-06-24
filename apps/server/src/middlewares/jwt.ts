import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";
import { env } from "src/config/env";
import { UserRepository } from "src/repositories/user";
import { UsageService } from "src/services/usage";
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
            {},
          ),
        );
    }
    req.auth = {
      userId: payload.sub,
    };
    const user = await UserRepository.findById(req.auth!.userId);
    if (!user) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json(
          new ApiError(StatusCodes.UNAUTHORIZED, false, "user not found", {}),
        );
    }
    const allowed = UsageService.canGenerate({
      plan: user.plan,
      generationsUsed: user.generationsUsed,
    });
    if (!allowed) {
      return res
        .status(StatusCodes.PAYMENT_REQUIRED)
        .json(
          new ApiError(
            StatusCodes.PAYMENT_REQUIRED,
            false,
            "You have exhausted your credits, please switch to pro plan for unlimited credits",
            {},
          ),
        );
    }
    next();
  } catch (error) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json(
        new ApiError(StatusCodes.UNAUTHORIZED, false, "invalid token", error),
      );
  }
}
