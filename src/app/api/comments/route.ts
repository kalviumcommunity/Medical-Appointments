import { NextResponse } from "next/server";
import { sanitizeInput } from "@/lib/sanitize";

export async function POST(req: Request) {
  const body = await req.json();

  const cleanComment = sanitizeInput(body.comment); //safe
  // const cleanComment = body.comment; // (for demo only)

  return NextResponse.json({
    message: "Comment saved safely",
    comment: cleanComment,
  });
}
