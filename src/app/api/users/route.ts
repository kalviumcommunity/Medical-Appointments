import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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
          hasDatabaseUrlEnv: Boolean(process.env.DATABASE_URL),
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

    const [users, totalCount] = await Promise.all([
      prisma.user.findMany({
        skip,
        take: limit,
        include: {
          appointments: {
            select: {
              id: true,
              date: true,
              reason: true,
            },
          },
        },
      }),
      prisma.user.count(),
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json({
      page,
      limit,
      totalCount,
      totalPages,
      data: users,
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

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 409 }
      );
    }

    const user = await prisma.user.create({
      data: {
        name,
        email,
      },
      include: {
        appointments: true,
      },
    });

    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
