import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { handleError } from "@/lib/errorHandler";
import { logger } from "@/lib/logger";

export async function GET(req: Request) {
  try {
    logger.info("Fetching users list");

    const { searchParams } = new URL(req.url);
    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 10;
    const skip = (page - 1) * limit;

    const { data: users, error: usersError } = await supabase
      .from("User")
      .select(
        `
        *,
        Appointment (
          id,
          date,
          reason
        )
      `
      )
      .range(skip, skip + limit - 1);

    if (usersError) {
      throw usersError;
    }

    const { count: totalCount, error: countError } = await supabase
      .from("User")
      .select("*", { count: "exact", head: true });

    if (countError) {
      throw countError;
    }

    const totalPages = Math.ceil((totalCount || 0) / limit);

    return NextResponse.json({
      page,
      limit,
      totalCount: totalCount || 0,
      totalPages,
      data: users || [],
    });
  } catch (error) {
    return handleError(error, {
      route: "/api/users",
      method: "GET",
    });
  }
}

export async function POST(req: Request) {
  try {
    logger.info("Creating new user");

    const { name, email } = await req.json();

    if (!name || !email) {
      return NextResponse.json(
        { success: false, message: "Name and email are required" },
        { status: 400 }
      );
    }

    const { data: existingUser, error: checkError } = await supabase
      .from("User")
      .select("*")
      .eq("email", email)
      .maybeSingle();

    if (checkError) {
      throw checkError;
    }

    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "User with this email already exists" },
        { status: 409 }
      );
    }

    const { data: newUser, error: createError } = await supabase
      .from("User")
      .insert([{ name, email }])
      .select(
        `
        *,
        Appointment (*)
      `
      )
      .single();

    if (createError) {
      throw createError;
    }

    return NextResponse.json(
      { success: true, data: newUser },
      { status: 201 }
    );
  } catch (error) {
    return handleError(error, {
      route: "/api/users",
      method: "POST",
    });
  }
}
