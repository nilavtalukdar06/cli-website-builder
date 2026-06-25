import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { SubscriptionService } from "src/services/subscription";
import { ApiError } from "src/utils/error";
import { ApiResponse } from "src/utils/response";

export const checkout = async (req: Request, res: Response) => {
  try {
    const sessionUrl = await SubscriptionService.createCheckoutSession(
      req.auth!.userId,
    );
    return res.status(StatusCodes.OK).json(
      new ApiResponse(StatusCodes.OK, true, "created a checkout session", {
        sessionUrl,
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
            "failed to create checkout session",
            error,
          ),
        );
    }
  }
};

export const portal = async (req: Request, res: Response) => {
  try {
    const portalUrl = await SubscriptionService.createPortalSession(
      req.auth!.userId,
    );
    return res.status(StatusCodes.OK).json(
      new ApiResponse(StatusCodes.OK, true, "created a portal session", {
        portalUrl,
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
            "failed to create portal session",
            error,
          ),
        );
    }
  }
};
