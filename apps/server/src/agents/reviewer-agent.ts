import { Agent } from "@openai/agents";
import { reviewerPrompt } from "src/prompts/reviewer-prompt";
import { readFileTool, listFilesTool, runCommandTool } from "src/tools/agent-tools";
import { z } from "zod";

export const reviewResultSchema = z.object({
  approved: z.boolean(),
  score: z.number(),
  summary: z.string(),
  strengths: z.array(z.string()),
  issues: z.array(z.string()),
  recommendations: z.array(z.string()),
});

export const reviewerAgent = new Agent({
  name: "reviewer",
  model: "gpt-5",
  instructions: reviewerPrompt,
  outputType: reviewResultSchema,
  tools: [readFileTool, listFilesTool, runCommandTool],
});
