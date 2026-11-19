import { z } from "zod";
import { emailSchema, nameSchema } from "../users/user.validator.js";

const passwordSchema = z.string().min(8).max(72);

export const signUpSchema = z
  .object({
    name: nameSchema,
    email: emailSchema,
    password: passwordSchema,
  })
  .strict();

export const signInSchema = z
  .object({
    email: emailSchema,
    password: z.string().min(1),
  })
  .strict();

export type SignUpInput = z.infer<typeof signUpSchema>;
export type SignInInput = z.infer<typeof signInSchema>;
