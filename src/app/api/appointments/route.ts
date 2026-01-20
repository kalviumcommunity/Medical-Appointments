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
        location: "src/app/api/appointments/route.ts:5",
        message: "appointments GET entry",
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
    const userId = searchParams.get("userId");

    const skip = (page - 1) * limit;

    // Build query
    let query = supabase
      .from("Appointment")
      .select(
        `
        *,
        User (
          id,
          name,
          email
        )
      `,
        { count: "exact" }
      )
      .order("date", { ascending: false })
      .range(skip, skip + limit - 1);

    // Add userId filter if provided
    if (userId) {
      query = query.eq("userId", Number(userId));
    }

    const {
      data: appointments,
      error: appointmentsError,
      count: totalCount,
    } = await query;

    if (appointmentsError) {
      throw appointmentsError;
    }

    const totalPages = Math.ceil((totalCount || 0) / limit);

    return NextResponse.json({
      page,
      limit,
      totalCount: totalCount || 0,
      totalPages,
      data: appointments || [],
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
        location: "src/app/api/appointments/route.ts:49",
        message: "appointments GET failed",
        data: { name: err?.name ?? null, message: err?.message ?? null },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
    // #endregion agent log

    console.error("Error fetching appointments:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { date, reason, userId } = body;

    if (!date || !reason || !userId) {
      return NextResponse.json(
        { error: "Date, reason, and userId are required" },
        { status: 400 }
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

    // Create appointment
    const { data: appointment, error: createError } = await supabase
      .from("Appointment")
      .insert([
        {
          date: new Date(date).toISOString(),
          reason,
          userId: Number(userId),
        },
      ])
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

    if (createError) {
      throw createError;
    }

    return NextResponse.json(appointment, { status: 201 });
  } catch (error) {
    console.error("Error creating appointment:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
