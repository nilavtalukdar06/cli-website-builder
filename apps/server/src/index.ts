import express, { Request, Response, type Application } from "express";
import { env } from "./config/env";
import { StatusCodes } from "http-status-codes";
import { ApiResponse } from "./utils/response";
import { corsMiddleware } from "./lib/cors";
import { apiRateLimiter } from "./lib/rate-limit";
import { SandboxInstance } from "./sandbox/sandbox";

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

app.get("/app", async (_req: Request, res: Response) => {
  const sandbox = await SandboxInstance.createSandbox();
  const hostUrl = SandboxInstance.getSandboxUrl(sandbox);
  return res
    .status(StatusCodes.OK)
    .json(
      new ApiResponse(
        StatusCodes.OK,
        true,
        "successfully spinned up a sandbox",
        { hostUrl },
      ),
    );
});

app.listen(port, () => {
  console.log("server is running on port", port);
});
