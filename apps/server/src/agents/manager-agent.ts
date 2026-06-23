import { tool, Agent } from "@openai/agents";
import { managerPrompt } from "src/prompts/manager-prompt";
import { SandboxInstance } from "src/sandbox/sandbox";
import { builderAgent } from "src/agents/builder-agent";
import { reviewerAgent } from "src/agents/reviewer-agent";
import { inputGuardrail, outputGuardrail } from "src/agents/guardrails";
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
  async execute(_, runContext) {
    const sandbox = await SandboxInstance.createSandbox();
    const sandboxId = sandbox.sandboxId;
    const url = `https://${sandbox.getHost(3000)}`;
    if (runContext && runContext.context) {
      (runContext.context as any).sandboxId = sandboxId;
      (runContext.context as any).url = url;
    }
    return {
      sandboxId,
      url,
    };
  },
});

export const builderTool = builderAgent.asTool({
  toolName: "delegate_to_builder",
  toolDescription:
    "Delegates the implementation of features/files to the Builder Agent. Provide the prompt/instructions on what to build.",
});

export const reviewerTool = reviewerAgent.asTool({
  toolName: "delegate_to_reviewer",
  toolDescription:
    "Delegates the audit and review of the sandbox files to the Reviewer Agent. Provide the prompt/criteria for the review.",
});

export const managerAgent = new Agent({
  name: "manager",
  model: "gpt-5-nano",
  instructions: managerPrompt,
  outputType: managerResultSchema,
  tools: [createSandboxTool, builderTool, reviewerTool],
  inputGuardrails: [inputGuardrail],
  outputGuardrails: [outputGuardrail],
});
