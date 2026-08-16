import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export const runtime = "nodejs";

// Manual cache-refresh endpoint. Some listing pages (particularly ones
// whose slug was previously invalid, e.g. the percent-encoding bug fixed
// alongside this route) can get a stale "not found" response stuck in
// Vercel's route cache from before the fix shipped. Hitting this endpoint
// forces Next.js to drop the cached entry for that path so the next
// request re-renders fresh.
//
// Usage: /api/revalidate?path=/listing/some-slug&secret=...
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const secret = searchParams.get("secret");
  const path = searchParams.get("path");

  if (!process.env.GOOGLE_FORM_SCRIPT_SECRET || secret !== process.env.GOOGLE_FORM_SCRIPT_SECRET) {
    return NextResponse.json({ ok: false, error: "Invalid secret." }, { status: 401 });
  }
  if (!path || !path.startsWith("/")) {
    return NextResponse.json({ ok: false, error: "Missing or invalid ?path=" }, { status: 400 });
  }

  revalidatePath(path);
  return NextResponse.json({ ok: true, revalidated: path, now: Date.now() });
}
