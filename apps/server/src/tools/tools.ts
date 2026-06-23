import { SandboxInstance } from "src/sandbox/sandbox";

export abstract class Tools {
  constructor() {}
  static async readFile({ sandboxId, path }: ReadFileInput) {
    const sandbox = await SandboxInstance.getSandbox(sandboxId);
    const content = await sandbox.files.read(path);
    return { path, content };
  }
  static async writeFile({ sandboxId, path, content }: WriteFileInput) {
    const sandbox = await SandboxInstance.getSandbox(sandboxId);
    await sandbox.files.write(path, content);
    return {
      success: true,
      path,
    };
  }
  static async ListFiles({ sandboxId, path = "." }: ListFilesInput) {
    const sandbox = await SandboxInstance.getSandbox(sandboxId);
    const files = await sandbox.files.list(path);
    return files;
  }
  static async deleteFiles({ sandboxId, path }: DeleteFileInput) {
    const sandbox = await SandboxInstance.getSandbox(sandboxId);
    await sandbox.files.remove(path);
    return {
      success: true,
      path,
    };
  }
  static async runCommand({ sandboxId, command }: RunCommandInput) {
    const sandbox = await SandboxInstance.getSandbox(sandboxId);
    const buffer = {
      stdout: "",
      stderr: "",
    };
    try {
      const result = await sandbox.commands.run(command, {
        onStdout(data) {
          buffer.stdout += data;
        },
        onStderr(data) {
          buffer.stderr += data;
        },
      });
      return {
        success: true,
        stdout: result.stdout || buffer.stdout,
        stderr: result.stderr || buffer.stderr,
        exitCode: result.exitCode,
      };
    } catch (error) {
      return {
        success: false,
        stdout: buffer.stdout,
        stderr: buffer.stderr,
        error: String(error),
      };
    }
  }
}
