import { z } from "zod";

export const enquirySchema = z.object({
  name: z.string().trim().min(2, "Enter your full name"),
  email: z.string().trim().email("Enter a valid email"),
  phone: z.string().trim().min(6, "Enter a valid phone number"),
  interest: z.string().trim().optional(),
  message: z.string().trim().min(10, "Tell us a little more about what you need"),
});

export type EnquiryInput = z.infer<typeof enquirySchema>;
