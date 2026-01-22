import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";
import { sendSuccess, sendError } from "@/lib/responseHandler";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    // 1️⃣ Validation
    if (!email || !password) {
      return sendError(
        "Email and password are required",
        "VALIDATION_ERROR",
        400
      );
    }

    // 2️⃣ Find user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return sendError("Invalid credentials", "AUTH_FAILED", 401);
    }

    // 3️⃣ Verify password
    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      return sendError("Invalid credentials", "AUTH_FAILED", 401);
    }

    // 4️⃣ Generate JWT
    if (!process.env.JWT_SECRET) {
      return sendError("JWT secret not configured", "CONFIG_ERROR", 500);
    }

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // 5️⃣ Remove password from response
    const { password: _, ...safeUser } = user;

    // 6️⃣ Success response
    return sendSuccess(
      {
        token,
        user: safeUser,
      },
      "Login successful"
    );
  } catch (error) {
    console.error("Login error:", error);

    return sendError("Internal server error", "INTERNAL_ERROR", 500, error);
  }
}
