import Sandbox from "@e2b/code-interpreter";
import { env } from "src/config/env";

const TEMPLATE_ID = env.E2B_TEMPLATE_ID;

export abstract class SandboxInstance {
  constructor() {}
  static async createSandbox() {
    const sandbox = await Sandbox.create(TEMPLATE_ID as string, {
      timeoutMs: 1000 * 60 * 30,
    });
    return sandbox;
  }
  static async getSandbox(sandboxId: string) {
    const sandbox = await Sandbox.connect(sandboxId);
    await sandbox.setTimeout(1000 * 60 * 30);
    return sandbox;
  }
  static async destroySandbox(sandboxId: string) {
    const sandbox = await Sandbox.connect(sandboxId);
    await sandbox.setTimeout(1000 * 60 * 30);
    await sandbox.kill();
  }
  static getSandboxUrl(sandbox: Sandbox) {
    const hostUrl = `https://${sandbox.getHost(3000)}`;
    return hostUrl;
  }
}
