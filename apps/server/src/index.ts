import "dotenv/config";
import express, { Request, Response, type Application } from "express";
import { env } from "./config/env";
import { StatusCodes } from "http-status-codes";
import { ApiResponse } from "./utils/response";
import { corsMiddleware } from "./lib/cors";
import { apiRateLimiter } from "./lib/rate-limit";
import { Agents } from "./services/agents";

const app: Application = express();
const port = env.PORT ?? 5500;

app.use(corsMiddleware);
app.use(apiRateLimiter);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (_req: Request, res: Response) => {
  return res
    .status(StatusCodes.OK)
    .json(new ApiResponse(StatusCodes.OK, true, "api is working", {}));
});

app.post("/create-app", async (req: Request, res: Response) => {
  const { prompt } = req.body;
  const result = await Agents.createApp(prompt);
  return res
    .status(StatusCodes.CREATED)
    .json(
      new ApiResponse(
        StatusCodes.CREATED,
        true,
        "successfully spinned up a sandbox",
        result,
      ),
    );
});

app.listen(port, () => {
  console.log("server is running on port", port);
});
