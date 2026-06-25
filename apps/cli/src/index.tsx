import { useState, useEffect, useRef } from "react";
import crypto from "crypto";
import { createCliRenderer } from "@opentui/core";
import { createRoot, useKeyboard, useTerminalDimensions } from "@opentui/react";
import Header from "./components/header";
import { InputBar } from "./components/input-bar";
import { bootstrap } from "./bootstrap";
import { openUrl } from "./lib/auth";

interface Message {
  id: string;
  sender: "user" | "agent";
  text: string;
  url?: string;
  status?: "running" | "success" | "error";
  currentStatus?: string;
  updates: string[];
}

function App() {
  const [route, setRoute] = useState<"home" | "chat">("home");
  const [messages, setMessages] = useState<Message[]>([]);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isBuilding, setIsBuilding] = useState(false);
  const [spinnerChar, setSpinnerChar] = useState("/");

  const { width, height } = useTerminalDimensions();

  const homeTextareaRef = useRef<any>(null);
  const chatTextareaRef = useRef<any>(null);

  useEffect(() => {
    if (!isBuilding) return;
    const chars = ["/", "-", "\\", "|"];
    let index = 0;
    const interval = setInterval(() => {
      index = (index + 1) % chars.length;
      setSpinnerChar(chars[index]!);
    }, 100);
    return () => clearInterval(interval);
  }, [isBuilding]);

  const startBuild = async (promptText: string) => {
    if (!promptText) return;
    setIsBuilding(true);
    setSpinnerChar("/");

    const agentMsgId = crypto.randomUUID();
    const userMsgId = crypto.randomUUID();

    setMessages((prev) => [
      ...prev,
      {
        id: userMsgId,
        sender: "user",
        text: promptText,
        updates: [],
      },
      {
        id: agentMsgId,
        sender: "agent",
        status: "running",
        currentStatus: "Starting agent run...",
        updates: [],
        text: "",
      },
    ]);

    try {
      const API_URL = process.env.API_URL || "http://localhost:5500";
      const response = await fetch(`${API_URL}/api/app/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${globalThis.ACCESS_TOKEN}`,
        },
        body: JSON.stringify({
          prompt: promptText,
          sessionId: sessionId || undefined,
        }),
      });

      if (!response.ok) {
        if (response.status === 402) {
          let errorMessage =
            "You have exhausted your credits, please switch to pro plan for unlimited credits";
          let checkoutUrl = "";
          try {
            const errorData = (await response.json()) as any;
            if (errorData && errorData.message) {
              errorMessage = errorData.message;
            }
            if (errorData?.errors?.checkoutUrl) {
              checkoutUrl = errorData.errors.checkoutUrl;
            }
          } catch (_) {
            // Keep default fallback message
          }
          if (checkoutUrl) {
            errorMessage += `\n\nUpgrade to Pro here: ${checkoutUrl}`;
            openUrl(checkoutUrl);
          }
          throw new Error(errorMessage);
        }
        throw new Error(`Server returned HTTP ${response.status}`);
      }

      if (!response.body) {
        throw new Error("Response body is not readable");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const parts = buffer.split("\n\n");
        buffer = parts.pop() || "";

        for (const part of parts) {
          const trimmed = part.trim();
          if (!trimmed) continue;

          const lines = trimmed.split("\n");
          let eventType = "message";
          let dataStr = "";

          for (const line of lines) {
            if (line.startsWith("event: ")) {
              eventType = line.slice(7).trim();
            } else if (line.startsWith("data: ")) {
              dataStr = line.slice(6).trim();
            }
          }

          if (trimmed.startsWith("data: ") && !trimmed.includes("event: ")) {
            dataStr = trimmed.slice(6).trim();
          }

          if (dataStr) {
            try {
              const parsed = JSON.parse(dataStr);

              if (eventType === "completed") {
                if (parsed.sessionId) {
                  setSessionId(parsed.sessionId);
                }
                setMessages((prev) =>
                  prev.map((msg) => {
                    if (msg.id === agentMsgId) {
                      return {
                        ...msg,
                        status: "success",
                        url: parsed.url,
                        text: parsed.summary || "",
                        currentStatus: "Build completed successfully.",
                      };
                    }
                    return msg;
                  }),
                );
              } else if (eventType === "error") {
                setMessages((prev) =>
                  prev.map((msg) => {
                    if (msg.id === agentMsgId) {
                      return {
                        ...msg,
                        status: "error",
                        text: parsed.message || "An error occurred.",
                        currentStatus: "Error during build.",
                      };
                    }
                    return msg;
                  }),
                );
              } else {
                const evType = parsed.type;
                if (parsed.sessionId) {
                  setSessionId(parsed.sessionId);
                }

                setMessages((prev) =>
                  prev.map((msg) => {
                    if (msg.id !== agentMsgId) return msg;

                    let newStatus = msg.currentStatus;
                    let newUpdates = [...msg.updates];
                    let newUrl = msg.url;

                    if (evType === "sandbox_ready") {
                      newStatus = "Sandbox ready";
                      newUrl = parsed.url;
                      if (
                        !newUpdates.includes("Sandbox environment is ready.")
                      ) {
                        newUpdates.push("Sandbox environment is ready.");
                      }
                    } else if (
                      evType === "tool_started" &&
                      parsed.description
                    ) {
                      newStatus = parsed.description;
                      if (!newUpdates.includes(parsed.description)) {
                        newUpdates.push(parsed.description);
                      }
                    } else if (
                      evType === "tool_completed" &&
                      parsed.description
                    ) {
                      newStatus = parsed.description;
                      if (!newUpdates.includes(parsed.description)) {
                        newUpdates.push(parsed.description);
                      }
                    } else if (evType === "file_written" && parsed.path) {
                      const desc = `Wrote file: ${parsed.path}`;
                      newStatus = desc;
                      if (!newUpdates.includes(desc)) {
                        newUpdates.push(desc);
                      }
                    } else if (evType === "run_completed") {
                      return {
                        ...msg,
                        status: "success",
                        text: parsed.summary || "",
                        currentStatus: "Build completed successfully.",
                      };
                    }

                    return {
                      ...msg,
                      currentStatus: newStatus,
                      updates: newUpdates,
                      url: newUrl || msg.url,
                    };
                  }),
                );
              }
            } catch (err) {}
          }
        }
      }
    } catch (err: any) {
      setMessages((prev) =>
        prev.map((msg) => {
          if (msg.id === agentMsgId) {
            return {
              ...msg,
              status: "error",
              text: err.message || String(err),
              currentStatus: "Error during build.",
            };
          }
          return msg;
        }),
      );
    } finally {
      setIsBuilding(false);
    }
  };

  useKeyboard((key) => {
    if (key.name === "return") {
      if (!key.shift) {
        key.preventDefault();

        if (route === "home") {
          const val = homeTextareaRef.current?.plainText?.trim();
          if (val) {
            homeTextareaRef.current?.clear();
            setRoute("chat");
            startBuild(val);
          }
        } else if (route === "chat" && !isBuilding) {
          const val = chatTextareaRef.current?.plainText?.trim();
          if (val) {
            chatTextareaRef.current?.clear();
            startBuild(val);
          }
        }
      }
    }
  });

  if (route === "home") {
    return (
      <box
        alignItems="center"
        justifyContent="center"
        backgroundColor="#0D0D12"
        width={width}
        height={height}
        gap={2}
      >
        <Header />
        <box width="100%" maxWidth={78} paddingX={2}>
          <InputBar textareaRef={homeTextareaRef} focused={true} />
        </box>
      </box>
    );
  }

  return (
    <box
      flexDirection="column"
      width="100%"
      height={height}
      gap={1}
      paddingX={2}
      paddingY={1}
      backgroundColor="#0D0D12"
    >
      <Header />

      <scrollbox
        flexGrow={1}
        width="100%"
        stickyScroll={true}
        stickyStart="bottom"
        style={{
          rootOptions: {
            backgroundColor: "#0D0D12",
          },
          wrapperOptions: {
            backgroundColor: "#0D0D12",
          },
          viewportOptions: {
            backgroundColor: "#0D0D12",
          },
          contentOptions: {
            backgroundColor: "#0D0D12",
          },
        }}
      >
        <box flexDirection="column" gap={1} width="100%">
          {messages.map((msg) => (
            <box key={msg.id} flexDirection="column" gap={0.5} width="100%">
              {msg.sender === "user" ? (
                <box flexDirection="row" gap={1}>
                  <text fg="cyan">
                    <strong>User:</strong>
                  </text>
                  <text fg="white">{msg.text}</text>
                </box>
              ) : (
                <box flexDirection="column" width="100%">
                  <text fg="green">
                    <strong>Agent:</strong>
                  </text>

                  {msg.status === "running" && (
                    <box flexDirection="row" gap={2} alignItems="center">
                      <text fg="white">{spinnerChar}</text>
                      <text fg="white">
                        {msg.currentStatus || "Thinking..."}
                      </text>
                    </box>
                  )}

                  <box flexDirection="column" gap={1} paddingLeft={2}>
                    {msg.updates.map((update, uIdx) => (
                      <text key={uIdx} fg="white">
                        › {update}
                      </text>
                    ))}
                  </box>

                  {msg.status === "success" && msg.url && (
                    <box
                      border={["left"]}
                      borderColor="green"
                      paddingX={2}
                      paddingY={0.5}
                      backgroundColor="#112211"
                      marginTop={1}
                      width="100%"
                    >
                      <text fg="green">
                        <strong>✓ App Ready:</strong>
                      </text>
                      <text fg="white">{msg.url}</text>
                    </box>
                  )}

                  {msg.status === "success" && msg.text && (
                    <box
                      border={["left"]}
                      borderColor="gray"
                      paddingX={2}
                      paddingY={0.5}
                      backgroundColor="#1c1c24"
                      marginTop={1}
                      width="100%"
                    >
                      <text fg="white">{msg.text}</text>
                    </box>
                  )}

                  {msg.status === "error" && (
                    <box
                      border={["left"]}
                      borderColor="red"
                      paddingX={2}
                      paddingY={1}
                      gap={1}
                      backgroundColor="#221111"
                      marginTop={1}
                      width="100%"
                    >
                      <text fg="red">
                        <strong>✗ Error:</strong>
                      </text>
                      <text fg="white">{msg.text}</text>
                    </box>
                  )}
                </box>
              )}
            </box>
          ))}
        </box>
      </scrollbox>

      {!isBuilding && (
        <box
          flexDirection="row"
          gap={1}
          alignItems="center"
          width="100%"
          maxWidth={!isBuilding ? "100%" : 78}
          alignSelf="flex-start"
        >
          <box
            flexGrow={1}
            paddingX={1}
            paddingY={1}
            marginBottom={1}
            justifyContent="center"
            backgroundColor="#1a1a24"
            width="100%"
          >
            <textarea
              ref={chatTextareaRef}
              focused={true}
              placeholder="Ask a follow up..."
            />
          </box>
        </box>
      )}
    </box>
  );
}

const auth = await bootstrap();
globalThis.ACCESS_TOKEN = auth.accessToken;

const renderer = await createCliRenderer();
createRoot(renderer).render(<App />);
