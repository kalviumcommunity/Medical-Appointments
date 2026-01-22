import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { loginSchema } from "@/lib/schemas/auth.schema";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const credentials = loginSchema.parse(body);

    return NextResponse.json({
      success: true,
      message: "Login successful",
      data: credentials,
    });

  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation Error",
          errors: error.issues,
        },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: false }, { status: 500 });
  }
}
