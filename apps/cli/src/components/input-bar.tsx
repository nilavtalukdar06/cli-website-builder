import { StatusBar } from "./status-bar";

export function InputBar() {
  return (
    <box width="100%" alignItems="center">
      <box
        position="relative"
        justifyContent="center"
        paddingX={2}
        paddingY={1}
        backgroundColor="#1a1a24"
        width="100%"
        gap={1}
      >
        <textarea placeholder="What do you want to build today" />
        <StatusBar />
      </box>
    </box>
  );
}
