import { NextRequest, NextResponse } from "next/server";
import { contactSchema } from "@/lib/validations";
import { sendContactEmail } from "@/lib/mailer";
import { checkRateLimit } from "@/lib/rateLimiter";
import type { ApiResponse } from "@/types";

function stripHtml(input: string): string {
  return input.replace(/<[^>]*>/g, "").trim();
}

function getClientIp(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown"
  );
}

export async function POST(req: NextRequest): Promise<NextResponse<ApiResponse>> {
  // 1. Parse body
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid request body." },
      { status: 400 }
    );
  }

  // 2. Validate with Zod
  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    const details: Record<string, string[]> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as string;
      details[key] = details[key] ?? [];
      details[key].push(issue.message);
    }
    return NextResponse.json(
      { success: false, error: "Validation failed", details },
      { status: 400 }
    );
  }

  // 3. Strip HTML
  const data = {
    name: stripHtml(parsed.data.name),
    email: stripHtml(parsed.data.email),
    phone: stripHtml(parsed.data.phone),
    message: parsed.data.message ? stripHtml(parsed.data.message) : undefined,
  };

  // 4. Rate limit
  const ip = getClientIp(req);
  const { allowed } = checkRateLimit(ip);
  if (!allowed) {
    return NextResponse.json(
      { success: false, error: "Too many requests. Please wait before trying again." },
      { status: 429 }
    );
  }

  // 5. Send email
  try {
    await sendContactEmail(data);
  } catch {
    return NextResponse.json(
      { success: false, error: "Internal server error. Please try again later." },
      { status: 500 }
    );
  }

  // 6. Console log (truncated message)
  const truncated = (data.message ?? "").slice(0, 50);
  console.log(
    `[${new Date().toISOString()}] Contact from ${data.name} <${data.email}> — "${truncated}${truncated.length === 50 ? "…" : ""}"`
  );

  // 7. Optional MongoDB save
  if (process.env.MONGODB_URI) {
    try {
      const { connectDB, Submission } = await import("@/lib/db");
      await connectDB();
      await Submission.create({ ...data, ip });
    } catch (dbErr) {
      console.error("DB save failed:", (dbErr as Error).message);
      // Non-fatal — email already sent
    }
  }

  return NextResponse.json(
    { success: true, message: "Your message has been received." },
    { status: 200 }
  );
}
