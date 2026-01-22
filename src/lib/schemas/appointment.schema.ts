//appointment schema

import { z } from "zod";

export const appointmentCreateSchema = z.object({
  patientId: z.string().uuid("Invalid patient ID"),
  doctorId: z.string().uuid("Invalid doctor ID"),
  appointmentDate: z.string().datetime("Invalid date format"),
  reason: z.string().min(5, "Reason must be at least 5 characters"),
});
