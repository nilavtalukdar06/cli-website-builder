import { rateLimit } from "express-rate-limit";
import { StatusCodes } from "http-status-codes";
import { ApiError } from "../utils/error";

export const apiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, res, _next, options) => {
    res
      .status(options.statusCode)
      .json(
        new ApiError(
          StatusCodes.TOO_MANY_REQUESTS,
          false,
          "too many requests, please try again later",
          {},
        ),
      );
  },
});
