import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { UserRepository } from "src/repositories/user";
import { UsageService } from "src/services/usage";
import { ApiError } from "src/utils/error";

export async function checkCredits(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const userId = req.auth?.userId;
    if (!userId) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json(
          new ApiError(
            StatusCodes.UNAUTHORIZED,
            false,
            "Authentication required",
            {},
          ),
        );
    }

    const user = await UserRepository.findById(userId);
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
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(
        new ApiError(
          StatusCodes.INTERNAL_SERVER_ERROR,
          false,
          "internal server error in credit check",
          error,
        ),
      );
  }
}
