import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { doctorCreateSchema } from "@/lib/schemas/doctor.schema";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const validatedData = doctorCreateSchema.parse(body);

    return NextResponse.json({
      success: true,
      message: "Doctor created successfully",
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
