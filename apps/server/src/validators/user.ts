import { z } from "zod";

export const signUpSchema = z.object({
  email: z.email("email is not valid"),
  password: z
    .string()
    .min(8, "password is too short")
    .max(100, "password is too long"),
});

export type SignUpSchema = z.infer<typeof signUpSchema>;
