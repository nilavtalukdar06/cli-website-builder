import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { SessionRepository } from "src/repositories/session";
import { ApiError } from "src/utils/error";

export async function authenticate(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const sessionId = req.cookies.session_id;
  if (!sessionId) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json(
        new ApiError(
          StatusCodes.UNAUTHORIZED,
          true,
          "session id is missing",
          {},
        ),
      );
  }
  const session = await SessionRepository.findById(sessionId);
  if (!session) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json(
        new ApiError(StatusCodes.UNAUTHORIZED, true, "session is missing", {}),
      );
  }
  if (session.expiresAt.getTime() < Date.now()) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json(
        new ApiError(StatusCodes.UNAUTHORIZED, true, "session expired", {}),
      );
  }
  req.user = session.user;
  next();
}
