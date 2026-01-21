import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { handleError } from "@/lib/errorHandler";
import { logger } from "@/lib/logger";

export async function GET(req: Request) {
  try {
    // #region agent log
    fetch("http://127.0.0.1:7242/ingest/f25d19fa-0bda-4464-8240-1bedbe651423", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId: "debug-session",
        runId: "post-fix",
        hypothesisId: "H3",
        location: "src/app/api/users/route.ts:11",
        message: "users GET entry",
        data: {
          hasDatabaseUrlEnv: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL),
          nodeEnv: process.env.NODE_ENV ?? null,
        },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
    // #endregion agent log

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
    // #region agent log
    fetch("http://127.0.0.1:7242/ingest/f25d19fa-0bda-4464-8240-1bedbe651423", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId: "debug-session",
        runId: "post-fix",
        hypothesisId: "H2",
        location: "src/app/api/users/route.ts:73",
        message: "users GET failed",
        data: {
          message: error instanceof Error ? error.message : "unknown",
        },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
    // #endregion agent log

    return handleError(error, {
      route: "/api/users",
      method: "GET",
    });
  }
}

export async function POST(req: Request) {
  try {
    logger.info("Creating new user");

    const body = await req.json();
    const { name, email } = body;

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

    return NextResponse.json({ success: true, data: newUser }, { status: 201 });
  } catch (error) {
    return handleError(error, {
      route: "/api/users",
      method: "POST",
    });
  }
}
