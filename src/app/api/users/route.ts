import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { logger } from "@/lib/logger";
import redis from "@/lib/redis";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 10;
    const skip = (page - 1) * limit;

    const cacheKey = `users:list:page=${page}:limit=${limit}`;

    // 1️⃣ Try cache first
    const cachedData = await redis.get(cacheKey);
    if (cachedData) {
      console.log("⚡ Cache HIT");
      return NextResponse.json(JSON.parse(cachedData));
    }

    console.log("🐢 Cache MISS - Fetching from DB");

    // #region agent log
    fetch("http://127.0.0.1:7242/ingest/f25d19fa-0bda-4464-8240-1bedbe651423", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId: "debug-session",
        runId: "post-fix",
        hypothesisId: "H3",
        location: "src/app/api/users/route.ts:GET",
        message: "users GET entry",
        data: {
          hasRedis: true,
          nodeEnv: process.env.NODE_ENV ?? null,
        },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
    // #endregion agent log

    logger.info("Fetching users list from database");

    // ✅ FIXED TABLE NAMES
    const { data: users, error: usersError } = await supabase
      .from("users")
      .select(
        `
        *,
        appointments (
          id,
          date,
          reason
        )
      `
      )
      .range(skip, skip + limit - 1);

    if (usersError) throw usersError;

    const { count: totalCount, error: countError } = await supabase
      .from("users")
      .select("*", { count: "exact", head: true });

    if (countError) throw countError;

    const response = {
      page,
      limit,
      totalCount: totalCount || 0,
      totalPages: Math.ceil((totalCount || 0) / limit),
      data: users || [],
      source: "database",
    };

    // 2️⃣ Store in Redis (TTL = 60s)
    await redis.set(cacheKey, JSON.stringify(response), "EX", 60);

    return NextResponse.json(response);
  } catch (error) {
    // 🔥 TEMPORARY RAW ERROR (DO NOT HIDE IT)
    console.error("RAW GET /api/users ERROR 👉", error);

    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Unknown raw error",
      },
      { status: 500 }
    );
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
      .from("users")
      .select("*")
      .eq("email", email)
      .maybeSingle();

    if (checkError) throw checkError;

    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "User with this email already exists" },
        { status: 409 }
      );
    }

    const { data: newUser, error: createError } = await supabase
      .from("users")
      .insert([{ name, email }])
      .select(
        `
        *,
        appointments (*)
      `
      )
      .single();

    if (createError) throw createError;

    // 🧹 Cache invalidation (REQUIRED for 2.23)
    await redis.del("users:list:page=1:limit=10");

    return NextResponse.json({ success: true, data: newUser }, { status: 201 });
  } catch (error) {
    console.error("RAW POST /api/users ERROR 👉", error);

    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Unknown raw error",
      },
      { status: 500 }
    );
  }
}
