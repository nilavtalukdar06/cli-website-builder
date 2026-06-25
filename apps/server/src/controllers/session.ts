import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { SessionService } from "src/services/session";
import { UserService } from "src/services/user";
import { ApiError } from "src/utils/error";
import { ApiResponse } from "src/utils/response";
import { env } from "src/config/env";

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const response = await SessionService.login(email, password);
    const isProduction = env.NODE_ENV === "production";
    res.cookie("session_id", response.session.id, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
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

export const getMe = async (req: Request, res: Response) => {
  try {
    const user = await UserService.findById(req.auth!.userId);
    return res.status(StatusCodes.OK).json(
      new ApiResponse(
        StatusCodes.OK,
        true,
        "succesfully fetched user session",
        {
          user,
        },
      ),
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
            "failed to get user session",
            error,
          ),
        );
    }
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    const sessionId = req.cookies.session_id;
    if (sessionId) {
      await SessionService.logout(sessionId).catch((err) => {
        console.error("Failed to delete session from database on logout:", err);
      });
    }
    const isProduction = env.NODE_ENV === "production";
    res.clearCookie("session_id", {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
    });
    return res
      .status(StatusCodes.OK)
      .json(
        new ApiResponse(StatusCodes.OK, true, "logged out successfully", {}),
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
            "failed to logout user",
            error,
          ),
        );
    }
  }
};
