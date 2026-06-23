import logger from "src/config/logger";

function getToolDescription(
  name: string,
  argsStr: string,
  isOutput: boolean,
  output?: any,
) {
  let args: any = {};

  try {
    args = JSON.parse(argsStr);
  } catch (error) {
    logger.error(error);
  }

  if (isOutput) {
    switch (name) {
      case "read_file":
        return `Successfully read file: ${args.path}`;
      case "write_file":
        return `Successfully wrote file: ${args.path}`;
      case "list_files":
        return `Listed files in: ${args.path || "."}`;
      case "delete_file":
        return `Deleted file: ${args.path}`;
      case "run_command":
        return `Command completed successfully`;
      default:
        return `Completed action: ${name}`;
    }
  }

  switch (name) {
    case "read_file":
      return `Reading file: ${args.path}`;
    case "write_file":
      return `Writing file: ${args.path}`;
    case "list_files":
      return `Listing files in: ${args.path || "."}`;
    case "delete_file":
      return `Deleting file: ${args.path}`;
    case "run_command":
      return `Running command: ${args.command}`;

    default:
      return `Executing action: ${name}`;
  }
}

export async function parseAgentStream(
  stream: any,
  onEvent: (event: any) => void,
) {
  const stats = {
    filesRead: 0,
    filesWritten: 0,
    commandsRun: 0,
    filesDeleted: 0,
  };

  const toolCallQueue: { name: string; arguments: string }[] = [];

  for await (const event of stream) {
    if (event.type !== "run_item_stream_event") {
      continue;
    }

    const item = event.item as any;
    const rawItem = item?.rawItem;

    if (event.name === "tool_called") {
      if (!rawItem) continue;
      try {
        const toolName = rawItem.name || item?.name || "unknown";
        const toolArgsStr = rawItem.arguments || "{}";
        const args = JSON.parse(toolArgsStr);

        toolCallQueue.push({ name: toolName, arguments: toolArgsStr });

        switch (toolName) {
          case "read_file":
            stats.filesRead++;
            break;

          case "write_file":
            stats.filesWritten++;
            break;

          case "run_command":
            stats.commandsRun++;
            break;

          case "delete_file":
            stats.filesDeleted++;
            break;
        }
        onEvent({
          type: "tool_started",
          tool: toolName,
          arguments: args,
          description: getToolDescription(toolName, toolArgsStr, false),
          timestamp: Date.now(),
        });
        if (toolName === "write_file") {
          onEvent({
            type: "file_written",
            path: args.path,
            timestamp: Date.now(),
          });
        }
      } catch (error) {
        logger.error(error);
      }
    }

    if (event.name === "tool_output") {
      const queued = toolCallQueue.shift();

      const toolName =
        queued?.name || rawItem?.name || item?.name || item?.type || "unknown";

      const toolArgs = queued?.arguments || rawItem?.arguments || "{}";
      const output = rawItem?.output ?? item?.output;
      onEvent({
        type: "tool_completed",
        tool: toolName,
        description: getToolDescription(toolName, toolArgs, true, output),
        timestamp: Date.now(),
      });
    }
  }

  await stream.completed;

  onEvent({
    type: "run_completed",
    summary: stream.finalOutput,
    stats,
    timestamp: Date.now(),
  });

  return stats;
}
