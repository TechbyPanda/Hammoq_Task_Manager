import { z } from "zod";

export const nameSchema = z.string().trim().min(1).max(100);
export const emailSchema = z.string().trim().toLowerCase().pipe(z.email());

export const updateProfileSchema = z
  .object({
    name: nameSchema,
    email: emailSchema,
  })
  .partial()
  .strict()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field is required",
  });

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
