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
      return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
    }

    const { data: user, error } = await supabase
      .from("User")
      .select(
        `
        *,
        Appointment (
          *
        )
      `
      )
      .eq("id", idNum)
      .order("date", { foreignTable: "Appointment", ascending: false })
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }
      throw error;
    }

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
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
    const { name, email } = body;

    if (isNaN(idNum)) {
      return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
    }

    if (!name || !email) {
      return NextResponse.json(
        { error: "Name and email are required" },
        { status: 400 }
      );
    }

    // Check if user exists
    const { data: existingUser, error: fetchError } = await supabase
      .from("User")
      .select("*")
      .eq("id", idNum)
      .maybeSingle();

    if (fetchError) {
      throw fetchError;
    }

    if (!existingUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if email is being changed and if new email already exists
    if (email !== existingUser.email) {
      const { data: emailExists, error: emailCheckError } = await supabase
        .from("User")
        .select("*")
        .eq("email", email)
        .maybeSingle();

      if (emailCheckError) {
        throw emailCheckError;
      }

      if (emailExists) {
        return NextResponse.json(
          { error: "User with this email already exists" },
          { status: 409 }
        );
      }
    }

    // Update user
    const { data: updatedUser, error: updateError } = await supabase
      .from("User")
      .update({ name, email })
      .eq("id", idNum)
      .select(
        `
        *,
        Appointment (*)
      `
      )
      .single();

    if (updateError) {
      throw updateError;
    }

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);
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
      return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
    }

    // Check if user exists
    const { data: existingUser, error: fetchError } = await supabase
      .from("User")
      .select("*")
      .eq("id", idNum)
      .maybeSingle();

    if (fetchError) {
      throw fetchError;
    }

    if (!existingUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Delete user
    const { error: deleteError } = await supabase
      .from("User")
      .delete()
      .eq("id", idNum);

    if (deleteError) {
      throw deleteError;
    }

    return NextResponse.json(
      { message: "User deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
