import { NextResponse } from "next/server";
import { appointmentCreateSchema } from "@/lib/schemas/appointment.schema";
import { ZodError } from "zod";

export async function PUT(req: Request) {
  try {
    const body = await req.json();

    const validated = appointmentCreateSchema.parse(body);

    return NextResponse.json({
      success: true,
      message: "Appointment updated",
      data: validated,
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
