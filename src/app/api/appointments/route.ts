import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

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
    const userId = searchParams.get("userId");

    const skip = (page - 1) * limit;

    const whereClause = userId ? { userId: Number(userId) } : {};

    const [appointments, totalCount] = await Promise.all([
      prisma.appointment.findMany({
        where: whereClause,
        skip,
        take: limit,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: {
          date: "desc",
        },
      }),
      prisma.appointment.count({
        where: whereClause,
      }),
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json({
      page,
      limit,
      totalCount,
      totalPages,
      data: appointments,
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

    const user = await prisma.user.findUnique({
      where: { id: Number(userId) },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const appointment = await prisma.appointment.create({
      data: {
        date: new Date(date),
        reason,
        userId: Number(userId),
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json(appointment, { status: 201 });
  } catch (error) {
    console.error("Error creating appointment:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
