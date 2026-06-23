import { run, Agent, InputGuardrail, OutputGuardrail } from "@openai/agents";
import { inputGuardrailPrompt } from "src/prompts/input-gurardrail-prompt";
import { outputGuardrailPrompt } from "src/prompts/output-guardrail-prompt";
import { z } from "zod";

export const guardrailResultSchema = z.object({
  approved: z.boolean(),
  risk_level: z.string(),
  reason: z.string(),
});

export const inputGuardrailAgent = new Agent({
  name: "input_guardrail_agent",
  model: "gpt-4.1-nano",
  instructions: inputGuardrailPrompt,
  outputType: guardrailResultSchema,
});

export const outputGuardrailAgent = new Agent({
  name: "output_guardrail_agent",
  model: "gpt-4.1-nano",
  instructions: outputGuardrailPrompt,
  outputType: guardrailResultSchema,
});

export const inputGuardrail: InputGuardrail = {
  name: "input_guardrail",
  async execute({ input }) {
    const inputStr = typeof input === "string" ? input : JSON.stringify(input);
    const result = await run(inputGuardrailAgent, inputStr);
    const parsed = result.finalOutput;
    return {
      tripwireTriggered: !parsed?.approved,
      outputInfo: parsed,
    };
  },
  runInParallel: false,
};

export const outputGuardrail: OutputGuardrail<any, any> = {
  name: "output_guardrail",
  async execute({ agentOutput }) {
    const outputStr =
      typeof agentOutput === "string"
        ? agentOutput
        : JSON.stringify(agentOutput);
    const result = await run(outputGuardrailAgent, outputStr);
    const parsed = result.finalOutput;
    return {
      tripwireTriggered: !parsed?.approved,
      outputInfo: parsed,
    };
  },
};
