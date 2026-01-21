import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { allowRole } from "@/lib/rbac";
import { Role } from "@prisma/client";

export async function GET(req: NextRequest) {
  try {
    const user = verifyToken(req);

    if (!allowRole(user.role, [Role.DOCTOR])) {
      return NextResponse.json(
        { error: "Access denied. Doctors only." },
        { status: 403 }
      );
    }

    return NextResponse.json({
      message: "Welcome Doctor 👨‍⚕️",
      doctorId: user.userId,
    });
  } catch (err) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
