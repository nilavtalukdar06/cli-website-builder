import "dotenv/config";
import express, { Request, Response, type Application } from "express";
import cookieParser from "cookie-parser";
import { env } from "./config/env";
import { StatusCodes } from "http-status-codes";
import { ApiResponse } from "./utils/response";
import { corsMiddleware } from "./lib/cors";
import { apiRateLimiter } from "./lib/rate-limit";
import AppRoutes from "./routes/create-app";
import UserRoutes from "./routes/user";
import DeviceRoutes from "./routes/device";
import BillingRoutes from "./routes/subscription";
import WebhookRoutes from "./routes/webhook";

const app: Application = express();
const port = env.PORT ?? 5500;

app.use(
  "/api/webhook",
  express.raw({ type: "application/json" }),
  WebhookRoutes,
);

app.use(corsMiddleware);
app.use(apiRateLimiter);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/auth", UserRoutes);
app.use("/api/device", DeviceRoutes);
app.use("/api/app", AppRoutes);
app.use("/api/billing", BillingRoutes);

app.get("/", (_req: Request, res: Response) => {
  return res
    .status(StatusCodes.OK)
    .json(new ApiResponse(StatusCodes.OK, true, "api is working", {}));
});

app.listen(port, () => {
  console.log("server is running on port", port);
});
