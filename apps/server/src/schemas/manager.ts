import { z } from "zod";

export const ManagerResultSchema = z.object({
  success: z.boolean(),
  sandboxId: z.string(),
  url: z.string(),
  summary: z.string(),
  reviewScore: z.number().optional(),
});

export const ManagerStateSchema = z.object({
  prompt: z.string(),
  sandboxId: z.string().optional(),
  url: z.string().optional(),
});

export type ManagerResult = z.infer<typeof ManagerResultSchema>;

export type ManagerState = z.infer<typeof ManagerStateSchema>;
