import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ADMIN_COOKIE_NAME, ADMIN_SESSION_TTL_MS, createSessionToken } from "@/lib/adminAuth";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const password = body?.password;
  const expected = process.env.ADMIN_PASSWORD;

  if (!expected) {
    return NextResponse.json(
      { ok: false, error: "Admin login is not configured." },
      { status: 500 }
    );
  }

  if (typeof password !== "string" || password !== expected) {
    // Small fixed delay to blunt naive brute-forcing without adding real
    // rate-limiting infrastructure for a single-admin site.
    await new Promise((resolve) => setTimeout(resolve, 400));
    return NextResponse.json({ ok: false, error: "Incorrect password." }, { status: 401 });
  }

  const store = await cookies();
  store.set(ADMIN_COOKIE_NAME, createSessionToken(), {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: Math.floor(ADMIN_SESSION_TTL_MS / 1000),
  });

  return NextResponse.json({ ok: true });
}
