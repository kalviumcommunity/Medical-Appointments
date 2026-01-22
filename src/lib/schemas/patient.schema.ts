import { z } from "zod";

export const patientCreateSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  age: z.number().min(0, "Age must be valid"),
  gender: z.enum(["MALE", "FEMALE", "OTHER"]),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
});

export type PatientCreateInput = z.infer<typeof patientCreateSchema>;
