import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { Agents } from "src/services/agents";
import { ApiError } from "src/utils/error";
import { ApiResponse } from "src/utils/response";

export const createApp = async (req: Request, res: Response) => {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        false,
        "prompt is not present in the request body",
        {},
      );
    }
    const result = await Agents.createApp(prompt);
    return res.status(StatusCodes.CREATED).json(
      new ApiResponse(StatusCodes.CREATED, true, "successfully created the application", result),
    )
  } catch (error) {
    if (error instanceof ApiError) {
      return res
        .status(error.statusCode)
        .json(
          new ApiError(error.statusCode, error.success, error.message, error),
        );
    }
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(
        new ApiError(
          StatusCodes.INTERNAL_SERVER_ERROR,
          false,
          "failed to create the application",
          error,
        ),
      );
  }
};
