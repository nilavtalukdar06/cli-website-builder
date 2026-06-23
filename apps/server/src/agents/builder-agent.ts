import { Agent } from "@openai/agents";
import { builderPrompt } from "src/prompts/builder-prompt";
import {
  readFileTool,
  writeFileTool,
  listFilesTool,
  deleteFileTool,
  runCommandTool,
} from "src/tools/agent-tools";

export const builderAgent = new Agent({
  name: "builder",
  model: "gpt-5",
  instructions: builderPrompt,
  tools: [
    readFileTool,
    writeFileTool,
    listFilesTool,
    deleteFileTool,
    runCommandTool,
  ],
});
