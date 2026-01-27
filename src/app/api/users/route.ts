import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { userCreateSchema } from "@/lib/schemas/user.schema";
import { getRoleFromEmail } from "@/lib/rbac";
import { sendSuccess, sendError } from "@/lib/responseHandler";

/* =======================
   GET → Public Users List
   ======================= */
export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    return sendSuccess(users, "Users list fetched successfully");
  } catch {
    return sendError("Failed to fetch users", "USER_FETCH_ERROR", 500);
  }
}

/* =======================
   POST → Create User
   ======================= */
export async function POST(req: Request) {
  try {
    const body = await req.json();

    // ✅ Zod validation
    const validatedData = userCreateSchema.parse(body);
    const { name, email, password } = validatedData;

    // ❌ Duplicate check
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return sendError("User already exists", "DUPLICATE_USER", 409);
    }

    // 🔐 Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 🔥 Auto role from email
    const role = getRoleFromEmail(email);

    // ✅ Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
      },
    });

    return sendSuccess(
      {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      },
      "User created successfully",
      201
    );
  } catch (err) {
    // ✅ SAFE error handling (NO any)
    if (err instanceof Error && err.name === "ZodError") {
      return sendError("Validation error", "VALIDATION_ERROR", 400);
    }

    return sendError("Internal server error", "INTERNAL_ERROR", 500);
  }
}
b;
