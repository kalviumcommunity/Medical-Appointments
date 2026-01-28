import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { name, email, password, role } = await req.json();

  if (!name || !email || !password || !role) {
    return NextResponse.json({ error: "All fields required" }, { status: 400 });
  }

  // Doctor email rule
  if (role === "DOCTOR" && !email.endsWith("@doc.com")) {
    return NextResponse.json(
      { error: "Doctor email must end with @doc.com" },
      { status: 400 }
    );
  }

  if (role === "PATIENT" && email.endsWith("@doc.com")) {
    return NextResponse.json(
      { error: "Patients cannot use doctor email" },
      { status: 400 }
    );
  }

  const exists = await prisma.user.findUnique({
    where: { email },
  });

  if (exists) {
    return NextResponse.json(
      { error: "Email already exists" },
      { status: 409 }
    );
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role,
    },
  });

  return NextResponse.json({
    message: "Signup successful",
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
}
