import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { userCreateSchema } from "@/lib/schemas/user.schema";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // ✅ Validate input
    const validatedData = userCreateSchema.parse(body);

    // Continue with DB logic
    return NextResponse.json({
      success: true,
      message: "User created successfully",
      data: validatedData,
    });

  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation Error",
          errors: error.issues.map(e => ({
            field: e.path[0],
            message: e.message,
          })),
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
