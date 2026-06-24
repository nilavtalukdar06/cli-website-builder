import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { UserService } from "src/services/user";
import { ApiError } from "src/utils/error";
import { ApiResponse } from "src/utils/response";

export const signUp = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await UserService.signUp(email, password);
    return res
      .status(StatusCodes.CREATED)
      .json(
        new ApiResponse(
          StatusCodes.CREATED,
          true,
          "successfully created the user",
          user,
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
            "failed to signup the user",
            error,
          ),
        );
    }
  }
};

export const refreshCliToken = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        false,
        "invalid refresh token",
        {},
      );
    }
    const result = await UserService.refreshCliToken(refreshToken);
    return res.status(StatusCodes.OK).json(result);
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
            "failed to generate refresh token",
            {},
          ),
        );
    }
  }
};
