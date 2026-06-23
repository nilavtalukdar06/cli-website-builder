import { run } from "@openai/agents";
import { builderAgent } from "src/agents/builder-agent";
import { SandboxInstance } from "src/sandbox/sandbox";

export abstract class Agents {
  constructor() {}
  static async createApp(prompt: string, onEvent: (event: any) => void) {
    const sandbox = await SandboxInstance.createSandbox();
    const sandboxId = sandbox.sandboxId;
    const url = SandboxInstance.getSandboxUrl(sandbox);
    onEvent({
      type: "sandbox_created",
      sandboxId,
      url,
    });
    const context = { sandboxId, url };

    const stream = await run(builderAgent, prompt, {
      context,
      maxTurns: 60,
      stream: true,
    });
    for await (const event of stream) {
      if (
        event.type === "raw_model_stream_event" &&
        event.data.type === "output_text_delta"
      ) {
        onEvent({
          type: "text",
          delta: event.data.delta,
        });
      }
    }
    await stream.completed;

    return {
      success: true,
      sandboxId,
      url,
      summary: stream.finalOutput,
    };
  }
}
