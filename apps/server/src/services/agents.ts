import { run } from "@openai/agents";
import { builderAgent } from "src/agents/builder-agent";
import { SandboxInstance } from "src/sandbox/sandbox";
import { parseAgentStream } from "src/utils/agent-stream-handler";

export abstract class Agents {
  constructor() {}
  static async createApp(prompt: string, onEvent: (event: any) => void) {
    onEvent({
      type: "run_started",
      prompt,
      timestamp: Date.now(),
    });
    const sandbox = await SandboxInstance.createSandbox();
    const sandboxId = sandbox.sandboxId;
    const url = SandboxInstance.getSandboxUrl(sandbox);

    onEvent({
      type: "sandbox_created",
      sandboxId,
      url,
      timestamp: Date.now(),
    });

    const context = {
      sandboxId,
      url,
    };
    const stream = await run(builderAgent, prompt, {
      context,
      maxTurns: 60,
      stream: true,
    });
    const stats = await parseAgentStream(stream, onEvent);

    return {
      success: true,
      sandboxId,
      url,
      summary: stream.finalOutput,
      stats,
    };
  }
}
