import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { getRoleFromEmail } from "@/lib/rbac";
import { sendSuccess, sendError } from "@/lib/responseHandler";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    // 1️⃣ Validation
    if (!name || !email || !password) {
      return sendError("All fields are required", "VALIDATION_ERROR", 400);
    }

    // 2️⃣ Check existing user
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return sendError("User already exists", "USER_EXISTS", 409);
    }

    // 3️⃣ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4️⃣ Auto role decision
    const role = getRoleFromEmail(email);

    // 5️⃣ Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
      },
    });

    // 6️⃣ Success response
    return sendSuccess(
      {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      "Signup successful",
      201
    );
  } catch (error) {
    console.error("Signup error:", error);

    return sendError("Internal server error", "INTERNAL_ERROR", 500, error);
  }
}
