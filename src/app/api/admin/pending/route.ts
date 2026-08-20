import { NextResponse } from "next/server";
import { isAdminAuthed } from "@/lib/adminAuth";
import { getPendingSubmissions } from "@/lib/data";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const authed = await isAdminAuthed();
  if (!authed) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const pending = await getPendingSubmissions();
  return NextResponse.json({ ok: true, pending });
}
