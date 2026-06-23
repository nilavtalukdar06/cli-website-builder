import { TextAttributes } from "@opentui/core";

export function StatusBar() {
  return (
    <box flexDirection="row" gap={1}>
      <text fg="cyan">OpenAI</text>
      <text attributes={TextAttributes.DIM} fg="gray">&#8250;</text>
      <text>GPT 5.4</text>
    </box>
  )
}