import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const idNum = Number(id);

    if (isNaN(idNum)) {
      return NextResponse.json(
        { error: "Invalid appointment ID" },
        { status: 400 }
      );
    }

    const { data: appointment, error } = await supabase
      .from("Appointment")
      .select(
        `
        *,
        User (
          id,
          name,
          email
        )
      `
      )
      .eq("id", idNum)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json(
          { error: "Appointment not found" },
          { status: 404 }
        );
      }
      throw error;
    }

    if (!appointment) {
      return NextResponse.json(
        { error: "Appointment not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(appointment);
  } catch (error) {
    console.error("Error fetching appointment:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const idNum = Number(id);
    const body = await req.json();
    const { date, reason, userId } = body;

    if (isNaN(idNum)) {
      return NextResponse.json(
        { error: "Invalid appointment ID" },
        { status: 400 }
      );
    }

    if (!date || !reason || !userId) {
      return NextResponse.json(
        { error: "Date, reason, and userId are required" },
        { status: 400 }
      );
    }

    // Check if appointment exists
    const { data: existingAppointment, error: fetchError } = await supabase
      .from("Appointment")
      .select("*")
      .eq("id", idNum)
      .maybeSingle();

    if (fetchError) {
      throw fetchError;
    }

    if (!existingAppointment) {
      return NextResponse.json(
        { error: "Appointment not found" },
        { status: 404 }
      );
    }

    // Check if user exists
    const { data: user, error: userError } = await supabase
      .from("User")
      .select("*")
      .eq("id", Number(userId))
      .maybeSingle();

    if (userError) {
      throw userError;
    }

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Update appointment
    const { data: updatedAppointment, error: updateError } = await supabase
      .from("Appointment")
      .update({
        date: new Date(date).toISOString(),
        reason,
        userId: Number(userId),
      })
      .eq("id", idNum)
      .select(
        `
        *,
        User (
          id,
          name,
          email
        )
      `
      )
      .single();

    if (updateError) {
      throw updateError;
    }

    return NextResponse.json(updatedAppointment);
  } catch (error) {
    console.error("Error updating appointment:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const idNum = Number(id);

    if (isNaN(idNum)) {
      return NextResponse.json(
        { error: "Invalid appointment ID" },
        { status: 400 }
      );
    }

    // Check if appointment exists
    const { data: existingAppointment, error: fetchError } = await supabase
      .from("Appointment")
      .select("*")
      .eq("id", idNum)
      .maybeSingle();

    if (fetchError) {
      throw fetchError;
    }

    if (!existingAppointment) {
      return NextResponse.json(
        { error: "Appointment not found" },
        { status: 404 }
      );
    }

    // Delete appointment
    const { error: deleteError } = await supabase
      .from("Appointment")
      .delete()
      .eq("id", idNum);

    if (deleteError) {
      throw deleteError;
    }

    return NextResponse.json(
      { message: "Appointment deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting appointment:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
