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

export const authorize = async (req: Request, res: Response) => {
  try {
    const { userCode } = req.body;
    if (!userCode) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        false,
        "user code is not present",
        {},
      );
    }
    const result = await DeviceService.authorize(userCode, req.auth!.userId);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(
        new ApiResponse(
          StatusCodes.INTERNAL_SERVER_ERROR,
          true,
          "device authorized successfully",
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
            "failed to authorize device",
            error,
          ),
        );
    }
  }
};

export const poll = async (req: Request, res: Response) => {
  try {
    const { deviceCode } = req.body;
    if (!deviceCode) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        false,
        "device code is not present",
        {},
      );
    }
    const result = await DeviceService.poll(deviceCode);
    return res
      .status(StatusCodes.OK)
      .json(
        new ApiResponse(StatusCodes.OK, true, "device is authorized", result),
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
            "failed to poll the database",
            error,
          ),
        );
    }
  }
};
