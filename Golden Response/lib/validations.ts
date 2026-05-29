import { z } from "zod";

export const contactSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be at most 100 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z
    .string()
    .regex(
      /^\+?[0-9]{10,15}$/,
      "Phone must be 10–15 digits with optional + prefix"
    ),
  message: z
    .string()
    .max(1000, "Message must be at most 1000 characters")
    .optional(),
});

export type ContactFormValues = z.infer<typeof contactSchema>;
