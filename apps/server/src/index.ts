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
import logger from "./config/logger";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";

const app: Application = express();
const port = env.PORT ?? 5500;

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Vibe Code API",
      version: "1.0.0",
      description:
        "API documentation for the Vibe Code workspace CLI and web app",
    },
    servers: [
      {
        url: `http://localhost:${port}`,
        description: "Local dev server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
        cookieAuth: {
          type: "apiKey",
          in: "cookie",
          name: "session_id",
        },
      },
    },
  },
  apis: ["./src/routes/*.ts", "./src/routes/*.js"],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

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

  setInterval(
    async () => {
      try {
        const response = await fetch(`http://localhost:${port}/`);
        logger.info(`[Cron] Pinged '/' route: ${response.status}`);
      } catch (error: any) {
        logger.error("[Cron] Failed to ping '/' route:", error.message);
      }
    },
    3 * 60 * 1000,
  );
});
