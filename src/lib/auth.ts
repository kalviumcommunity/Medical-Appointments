import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET!;

export function verifyToken(req: NextRequest) {
  const authHeader = req.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new Error("No token provided");
  }

  const token = authHeader.split(" ")[1];

  const decoded = jwt.verify(token, JWT_SECRET) as {
    userId: string;
    role: "PATIENT" | "DOCTOR";
  };

  return decoded;
}
