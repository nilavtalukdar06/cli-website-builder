import { MemorySession, run } from "@openai/agents";
import { builderAgent } from "src/agents/builder-agent";
import { SandboxInstance } from "src/sandbox/sandbox";
import { parseAgentStream } from "src/utils/agent-stream-handler";
import crypto from "crypto";
import { UserRepository } from "src/repositories/user";

type BuilderSession = {
  sandboxId: string;
  session: MemorySession;
  createdAt: number;
  lastActiveAt: number;
};

const sessions = new Map<string, BuilderSession>();

export abstract class Agents {
  constructor() {}

  static async createApp(
    userId: string,
    prompt: string,
    sessionId: string | undefined,
    onEvent: (event: any) => void,
  ) {
    let sandbox: any;
    let memorySession: MemorySession;
    let currentSessionId = sessionId;

    onEvent({
      type: "run_started",
      prompt,
      timestamp: Date.now(),
    });

    if (currentSessionId && sessions.has(currentSessionId)) {
      const existing = sessions.get(currentSessionId)!;
      sandbox = await SandboxInstance.getSandbox(existing.sandboxId);
      memorySession = existing.session;
      existing.lastActiveAt = Date.now();

      onEvent({
        type: "session_restored",
        sessionId: currentSessionId,
        sandboxId: existing.sandboxId,
        timestamp: Date.now(),
      });
    } else {
      sandbox = await SandboxInstance.createSandbox();
      memorySession = new MemorySession();
      currentSessionId = crypto.randomUUID();

      sessions.set(currentSessionId, {
        sandboxId: sandbox.sandboxId,
        session: memorySession,
        createdAt: Date.now(),
        lastActiveAt: Date.now(),
      });

      onEvent({
        type: "session_created",
        sessionId: currentSessionId,
        timestamp: Date.now(),
      });
    }

    const sandboxId = sandbox.sandboxId;
    const url = SandboxInstance.getSandboxUrl(sandbox);

    onEvent({
      type: "sandbox_ready",
      sandboxId,
      url,
      sessionId: currentSessionId,
      timestamp: Date.now(),
    });

    const context = {
      sandboxId,
      url,
    };

    const stream = await run(builderAgent, prompt, {
      session: memorySession,
      context,
      maxTurns: 60,
      stream: true,
    });

    const stats = await parseAgentStream(stream, onEvent);
    await UserRepository.incrementGenerationCount(userId);
    return {
      success: true,
      sessionId: currentSessionId,
      sandboxId,
      url,
      summary: stream.finalOutput,
      stats,
    };
  }

  static getSession(sessionId: string) {
    return sessions.get(sessionId);
  }

  static deleteSession(sessionId: string) {
    return sessions.delete(sessionId);
  }
}
