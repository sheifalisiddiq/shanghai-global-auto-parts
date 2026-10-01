import { z } from "zod";

export const enquirySchema = z.object({
  name: z.string().trim().min(2, "name_invalid"),
  email: z.string().trim().email("email_invalid"),
  phone: z.string().trim().min(6, "phone_invalid"),
  interest: z.string().trim().optional(),
  message: z.string().trim().min(10, "message_short"),
});

export type EnquiryInput = z.infer<typeof enquirySchema>;
