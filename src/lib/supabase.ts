import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Type definitions for database tables
export type User = {
  id: number;
  name: string;
  email: string;
  createdAt: string;
};

export type Appointment = {
  id: number;
  date: string;
  reason: string;
  userId: number;
  createdAt: string;
};

export type AppointmentWithUser = Appointment & {
  User: User;
};
