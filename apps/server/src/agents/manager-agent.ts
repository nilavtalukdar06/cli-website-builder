import { tool, Agent } from "@openai/agents";
import { managerPrompt } from "src/prompts/manager-prompt";
import { SandboxInstance } from "src/sandbox/sandbox";
import { z } from "zod";

export const managerResultSchema = z.object({
  success: z.boolean(),
  sandboxId: z.string(),
  url: z.string(),
  summary: z.string(),
  reviewScore: z.number(),
});

export const createSandboxTool = tool({
  name: "create_sandbox",
  description: "Creates a new sandbox for the project",
  parameters: z.object({}),
  async execute() {
    const sandbox = await SandboxInstance.createSandbox();
    return {
      sandboxId: sandbox.sandboxId,
      url: `https://${sandbox.getHost(3000)}`,
    };
  },
});

export const managerAgent = new Agent({
  name: "manager",
  model: "gpt-5",
  instructions: managerPrompt,
  outputType: managerResultSchema,
  tools: [createSandboxTool],
});
