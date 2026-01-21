// src/lib/errorHandler.ts

import { NextResponse } from "next/server";
import { logger } from "@/lib/logger";

export function handleError(
  error: unknown,
  context: { route: string; method: string }
) {
  const isDev = process.env.NODE_ENV === "development";

  const err =
    error instanceof Error ? error : new Error("Unknown error occurred");

  logger.error(`Error in ${context.method} ${context.route}`, {
    message: err.message,
    stack: isDev ? err.stack : "REDACTED",
  });

  if (isDev) {
    return NextResponse.json(
      {
        success: false,
        message: err.message,
        stack: err.stack,
      },
      { status: 500 }
    );
  }

  return NextResponse.json(
    {
      success: false,
      message: "Something went wrong. Please try again later.",
    },
    { status: 500 }
  );
}
