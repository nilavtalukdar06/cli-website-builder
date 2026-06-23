import { run } from "@openai/agents";
import { builderAgent } from "src/agents/builder-agent";
import { SandboxInstance } from "src/sandbox/sandbox";

export abstract class Agents {
  constructor() {}
  static async createApp(prompt: string) {
    const sandbox = await SandboxInstance.createSandbox();
    const sandboxId = sandbox.sandboxId;
    const url = SandboxInstance.getSandboxUrl(sandbox);
    const context = { sandboxId, url };
    
    const result = await run(builderAgent, prompt, { context, maxTurns: 60 });
    
    return {
      success: true,
      sandboxId,
      url,
      summary: result.finalOutput,
    };
  }
}
