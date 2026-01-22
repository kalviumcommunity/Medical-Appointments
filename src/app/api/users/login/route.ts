import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";
import { sendSuccess, sendError } from "@/lib/responseHandler";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return sendError(
        "Email and password are required",
        "VALIDATION_ERROR",
        400
      );
    }

    // 👇 password only for comparison
    const userWithPassword = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        password: true,
        createdAt: true,
      },
    });

    if (!userWithPassword) {
      return sendError("Invalid credentials", "AUTH_FAILED", 401);
    }

    const isValid = await bcrypt.compare(password, userWithPassword.password);

    if (!isValid) {
      return sendError("Invalid credentials", "AUTH_FAILED", 401);
    }

    if (!process.env.JWT_SECRET) {
      return sendError("JWT secret not configured", "CONFIG_ERROR", 500);
    }

    const token = jwt.sign(
      { userId: userWithPassword.id, role: userWithPassword.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // 👇 safe user (NO password field)
    const safeUser = {
      id: userWithPassword.id,
      name: userWithPassword.name,
      email: userWithPassword.email,
      role: userWithPassword.role,
      createdAt: userWithPassword.createdAt,
    };

    return sendSuccess({ token, user: safeUser }, "Login successful");
  } catch (error) {
    console.error("Login error:", error);
    return sendError("Internal server error", "INTERNAL_ERROR", 500);
  }
}
