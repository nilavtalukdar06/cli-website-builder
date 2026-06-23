interface ReadFileInput {
  sandboxId: string;
  path: string;
}

interface WriteFileInput {
  sandboxId: string;
  path: string;
  content: string;
}

interface ListFilesInput {
  sandboxId: string;
  path?: string;
}

interface DeleteFileInput {
  sandboxId: string;
  path: string;
}

interface RunCommandInput {
  sandboxId: string;
  command: string;
}
