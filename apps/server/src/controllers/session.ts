import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { SessionService } from "src/services/session";
import { ApiError } from "src/utils/error";
import { ApiResponse } from "src/utils/response";

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const response = await SessionService.login(email, password);
    res.cookie("session_id", response.session.id, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });
    return res.status(StatusCodes.OK).json(
      new ApiResponse(StatusCodes.OK, true, "successfully created a session", {
        user: {
          id: response.user.id,
          email: response.user.email,
        },
      }),
    );
  } catch (error) {
    if (error instanceof ApiError) {
      return res.status(error.statusCode).json(error);
    } else {
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json(
          new ApiError(
            StatusCodes.INTERNAL_SERVER_ERROR,
            false,
            "failed to create session",
            error,
          ),
        );
    }
  }
};
