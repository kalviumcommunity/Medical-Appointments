import { NextRequest } from "next/server";
import { verifyToken } from "@/lib/auth";
import { allowRole } from "@/lib/rbac";
// Define Role enum locally if not exported from @prisma/client
enum Role {
  DOCTOR = "DOCTOR",
  // Add other roles as needed
}
import { sendSuccess, sendError } from "@/lib/responseHandler";

export async function GET(req: NextRequest) {
  try {
    // 1️⃣ Verify JWT
    const user = verifyToken(req);

    // 2️⃣ RBAC check (Doctor only)
    if (!allowRole(user.role, [Role.DOCTOR])) {
      return sendError("Access denied. Doctors only.", "FORBIDDEN", 403);
    }

    // 3️⃣ Success response
    return sendSuccess(
      {
        doctorId: user.userId,
      },
      "Welcome Doctor 👨‍⚕️"
    );
  } catch (error) {
    console.error("Doctor route error:", error);

    return sendError("Unauthorized access", "UNAUTHORIZED", 401, error);
  }
}
