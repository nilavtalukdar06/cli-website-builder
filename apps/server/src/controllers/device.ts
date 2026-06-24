import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { DeviceService } from "src/services/device";
import { ApiError } from "src/utils/error";
import { ApiResponse } from "src/utils/response";

export const deviceController = async (_req: Request, res: Response) => {
  try {
    const result = await DeviceService.start();
    return res
      .status(StatusCodes.OK)
      .json(
        new ApiResponse(
          StatusCodes.OK,
          true,
          "successfully created a device",
          result,
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
            "failed to create device",
            error,
          ),
        );
    }
  }
};
