import fs from "fs/promises";
import path from "path";
import os from "os";
import { exec } from "child_process";

const API_URL =
  process.env.API_URL || "https://cli-website-builder.onrender.com";

const AUTH_DIR = path.join(os.homedir(), ".vibecode");
const AUTH_FILE = path.join(AUTH_DIR, "auth.json");

export function openUrl(url: string): void {
  const platform = process.platform;
  let cmd = "";
  if (platform === "win32") {
    cmd = `start "" "${url}"`;
  } else if (platform === "darwin") {
    cmd = `open "${url}"`;
  } else {
    cmd = `xdg-open "${url}"`;
  }
  exec(cmd, () => {});
}

export async function saveRefreshToken(refreshToken: string): Promise<void> {
  await fs.mkdir(AUTH_DIR, { recursive: true });
  await fs.writeFile(
    AUTH_FILE,
    JSON.stringify({ refreshToken }, null, 2),
    "utf-8",
  );
}

export async function loadRefreshToken(): Promise<string | null> {
  try {
    const data = await fs.readFile(AUTH_FILE, "utf-8");
    const parsed = JSON.parse(data);
    return parsed.refreshToken || null;
  } catch (error) {
    return null;
  }
}

export async function clearRefreshToken(): Promise<void> {
  try {
    await fs.unlink(AUTH_FILE);
  } catch (error) {
    // Ignore error if file doesn't exist
  }
}

export async function refreshAccessToken(
  refreshToken: string,
): Promise<string> {
  const response = await fetch(`${API_URL}/api/auth/cli/refresh`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ refreshToken }),
  });

  const body = (await response.json()) as any;

  if (!response.ok) {
    throw new Error(
      body.message || `Failed to refresh token: HTTP ${response.status}`,
    );
  }

  if (!body.accessToken) {
    throw new Error("Invalid response format: missing accessToken");
  }

  return body.accessToken;
}

export async function deviceLogin(): Promise<string> {
  // Step 1: Start device flow
  const response = await fetch(`${API_URL}/api/device/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const body = (await response.json()) as any;

  if (!response.ok || !body.success || !body.data) {
    throw new Error(
      body.message || `Failed to start device flow: HTTP ${response.status}`,
    );
  }

  const { deviceCode, userCode, verificationUrl } = body.data;

  // Step 2: Display verification instructions & auto-open url
  const urlWithCode = `${verificationUrl}?code=${userCode}`;

  console.log("\n================================\n");
  console.log("Open:\n");
  console.log(urlWithCode);
  console.log("\nCode:\n");
  console.log(userCode);
  console.log("\nWaiting for authorization...\n");
  console.log("================================\n");

  openUrl(urlWithCode);

  // Step 3 & 4: Poll status
  while (true) {
    await new Promise((resolve) => setTimeout(resolve, 2000));

    try {
      const pollResponse = await fetch(`${API_URL}/api/device/poll`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ deviceCode }),
      });

      const pollBody = (await pollResponse.json()) as any;

      if (pollResponse.ok && pollBody.success && pollBody.data?.authorized) {
        const token = pollBody.data.refreshToken;
        await saveRefreshToken(token);
        return token;
      }

      if (!pollResponse.ok) {
        if (
          pollResponse.status === 401 &&
          pollBody.message === "device is not authorized"
        ) {
          // Device is still waiting for authorization, continue polling
          continue;
        }
        throw new Error(
          pollBody.message || `Polling error: HTTP ${pollResponse.status}`,
        );
      }
    } catch (err: any) {
      if (err.message === "device is not authorized") {
        continue;
      }
      throw err;
    }
  }
}
