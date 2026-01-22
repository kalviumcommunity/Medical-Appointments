import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { supabase } from "@/lib/supabase";
import { logger } from "@/lib/logger";
import redis from "@/lib/redis";
import { userCreateSchema } from "@/lib/schemas/user.schema";

/* =========================
   GET /api/users
   List users with pagination + Redis cache
========================= */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 10;
    const skip = (page - 1) * limit;

    const cacheKey = `users:list:page=${page}:limit=${limit}`;

    // 1️⃣ Try Redis cache
    const cachedData = await redis.get(cacheKey);
    if (cachedData) {
      logger.info("Users list cache HIT");
      return NextResponse.json(JSON.parse(cachedData));
    }

    logger.info("Users list cache MISS – fetching from DB");

    // Fetch users
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

    // Count total users
    const { count: totalCount, error: countError } = await supabase
      .from("users")
      .select("*", { count: "exact", head: true });

    if (countError) throw countError;

    const response = {
      page,
      limit,
      totalCount: totalCount ?? 0,
      totalPages: Math.ceil((totalCount ?? 0) / limit),
      data: users ?? [],
      source: "database",
    };

    // 2️⃣ Store in Redis (TTL: 60s)
    await redis.set(cacheKey, JSON.stringify(response), "EX", 60);

    return NextResponse.json(response);
  } catch (error) {
    console.error("RAW GET /api/users ERROR 👉", error);

    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

/* =========================
   POST /api/users
   Create new user
========================= */
export async function POST(req: Request) {
  try {
    logger.info("Creating new user");

    const body = await req.json();

    // ✅ Validate input
    const { name, email } = userCreateSchema.parse(body);

    // Check if user already exists
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

    // Create user
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

    // 🧹 Cache invalidation (mandatory)
    await redis.del("users:list:page=1:limit=10");

    return NextResponse.json(
      { success: true, data: newUser },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation Error",
          errors: error.issues.map((e) => ({
            field: e.path[0],
            message: e.message,
          })),
        },
        { status: 400 }
      );
    }

    console.error("RAW POST /api/users ERROR 👉", error);

    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Internal Server Error",
      },
      { status: 500 }
    );
  }
}
