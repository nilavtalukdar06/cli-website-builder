import { run } from "@openai/agents";
import { managerAgent } from "src/agents/manager-agent";

export abstract class Agents {
  constructor() {}
  static async createApp(prompt: string) {
    const context = { sandboxId: "", url: "" };
    const result = await run(managerAgent, prompt, { context });
    return result.finalOutput;
  }
}
