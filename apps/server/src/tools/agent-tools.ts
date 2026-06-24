import { tool } from "@openai/agents";
import { z } from "zod";
import { Tools } from "./tools";

export const readFileTool = tool({
  name: "read_file",
  description:
    "Reads the content of a file in the sandbox workspace at the specified path.",
  parameters: z.object({
    path: z
      .string()
      .describe("The path to the file, relative to the workspace root."),
  }),
  async execute({ path }, runContext) {
    const sandboxId = (runContext?.context as any)?.sandboxId;
    if (!sandboxId) {
      throw new Error(
        "No sandbox ID found in context. You must create a sandbox first.",
      );
    }
    return await Tools.readFile({ sandboxId, path });
  },
});

export const writeFileTool = tool({
  name: "write_file",
  description:
    "Writes content to a file in the sandbox workspace at the specified path.",
  parameters: z.object({
    path: z
      .string()
      .describe("The path to the file, relative to the workspace root."),
    content: z.string().describe("The text content to write to the file."),
  }),
  async execute({ path, content }, runContext) {
    const sandboxId = (runContext?.context as any)?.sandboxId;
    if (!sandboxId) {
      throw new Error(
        "No sandbox ID found in context. You must create a sandbox first.",
      );
    }
    return await Tools.writeFile({ sandboxId, path, content });
  },
});

export const listFilesTool = tool({
  name: "list_files",
  description: "Lists files and directories in the sandbox workspace.",
  parameters: z.object({
    path: z
      .string()
      .optional()
      .describe("The relative path to list from. Defaults to root '.'."),
  }),
  async execute({ path }, runContext) {
    const sandboxId = (runContext?.context as any)?.sandboxId;
    if (!sandboxId) {
      throw new Error(
        "No sandbox ID found in context. You must create a sandbox first.",
      );
    }
    return await Tools.ListFiles({ sandboxId, path: path || "." });
  },
});

export const deleteFileTool = tool({
  name: "delete_file",
  description: "Removes/deletes a file or directory in the sandbox workspace.",
  parameters: z.object({
    path: z
      .string()
      .describe("The relative path of the file or directory to delete."),
  }),
  async execute({ path }, runContext) {
    const sandboxId = (runContext?.context as any)?.sandboxId;
    if (!sandboxId) {
      throw new Error(
        "No sandbox ID found in context. You must create a sandbox first.",
      );
    }
    return await Tools.deleteFiles({ sandboxId, path });
  },
});

export const runCommandTool = tool({
  name: "run_command",
  description:
    "Runs a shell command inside the sandbox development environment.",
  parameters: z.object({
    command: z
      .string()
      .describe(
        "The terminal command to run. Remember that build and dev servers are already running, do NOT run npm run dev/start/build.",
      ),
  }),
  async execute({ command }, runContext) {
    const sandboxId = (runContext?.context as any)?.sandboxId;
    if (!sandboxId) {
      throw new Error(
        "No sandbox ID found in context. You must create a sandbox first.",
      );
    }
    return await Tools.runCommand({ sandboxId, command });
  },
});
