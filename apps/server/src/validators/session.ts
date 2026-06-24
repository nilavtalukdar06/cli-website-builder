import { z } from "zod";

export const sessionSchema = z.object({
  email: z.email("email is not valid"),
  password: z.string().min(1, "password is required"),
});

export type SessionSchema = z.infer<typeof sessionSchema>;
