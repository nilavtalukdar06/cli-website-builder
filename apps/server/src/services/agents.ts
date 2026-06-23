import { run } from "@openai/agents";
import { managerAgent } from "src/agents/manager-agent";

export abstract class Agents {
  constructor() {}
  static async createApp(prompt: string) {
    const result = await run(managerAgent, prompt);
    return result.finalOutput;
  }
}
