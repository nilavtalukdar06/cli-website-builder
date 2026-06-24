import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { Agents } from "src/services/agents";
import { ApiError } from "src/utils/error";

export const createApp = async (req: Request, res: Response) => {
  try {
    const { prompt, sessionId } = req.body;
    if (!prompt) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        false,
        "prompt is not present in the request body",
        {},
      );
    }
    const userId = req.auth!.userId;
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders();
    const result = await Agents.createApp(
      userId,
      prompt,
      sessionId ?? undefined,
      (event) => {
        res.write(`data: ${JSON.stringify(event)}\n\n`);
      },
    );
    res.write(`event: completed\n` + `data: ${JSON.stringify(result)}\n\n`);
    res.end();
  } catch (error) {
    res.write(
      `event: error\n` +
        `data: ${JSON.stringify({
          message: String(error),
        })}\n\n`,
    );
    res.end();
  }
};
