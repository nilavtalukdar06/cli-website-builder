import type { RefObject } from "react";
import { StatusBar } from "./status-bar";

interface InputBarProps {
  textareaRef?: RefObject<any>;
  focused?: boolean;
  placeholder?: string;
}

export function InputBar({
  textareaRef,
  focused,
  placeholder = "What do you want to build today",
}: InputBarProps) {
  return (
    <box width="100%" alignItems="center">
      <box width="100%" border={["left"]} borderColor="cyan">
        <box
          position="relative"
          justifyContent="center"
          paddingX={2}
          paddingY={1}
          backgroundColor="#1a1a24"
          width="100%"
          gap={1}
        >
          <textarea
            ref={textareaRef}
            focused={focused}
            placeholder={placeholder}
          />
          <StatusBar />
        </box>
      </box>
    </box>
  );
}
