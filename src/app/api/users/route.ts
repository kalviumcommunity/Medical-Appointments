import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(req: Request) {
  try {
    // #region agent log
    fetch("http://127.0.0.1:7242/ingest/f25d19fa-0bda-4464-8240-1bedbe651423", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId: "debug-session",
        runId: "pre-fix",
        hypothesisId: "H3",
        location: "src/app/api/users/route.ts:7",
        message: "users GET entry",
        data: {
          hasDatabaseUrlEnv: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL),
          nodeEnv: process.env.NODE_ENV ?? null,
        },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
    // #endregion agent log

    const { searchParams } = new URL(req.url);
    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 10;

    const skip = (page - 1) * limit;

    // Get users with pagination
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

    // Get total count
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
    const err = error as { name?: string; message?: string };
    // #region agent log
    fetch("http://127.0.0.1:7242/ingest/f25d19fa-0bda-4464-8240-1bedbe651423", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId: "debug-session",
        runId: "pre-fix",
        hypothesisId: "H2",
        location: "src/app/api/users/route.ts:46",
        message: "users GET failed",
        data: { name: err?.name ?? null, message: err?.message ?? null },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
    // #endregion agent log

    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email } = body;

    if (!name || !email) {
      return NextResponse.json(
        { error: "Name and email are required" },
        { status: 400 }
      );
    }

    // Check if user with email already exists
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
        { error: "User with this email already exists" },
        { status: 409 }
      );
    }

    // Create new user
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

    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
