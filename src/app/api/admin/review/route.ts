import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { isAdminAuthed } from "@/lib/adminAuth";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const authed = await isAdminAuthed();
  if (!authed) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const row = Number(body?.row);
  const action = body?.action;
  const expectedName = typeof body?.name === "string" ? body.name : "";

  if (!row || row < 2 || (action !== "approve" && action !== "reject")) {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const scriptUrl = process.env.GOOGLE_FORM_SCRIPT_URL;
  const secret = process.env.GOOGLE_FORM_SCRIPT_SECRET;
  if (!scriptUrl || !secret) {
    return NextResponse.json({ ok: false, error: "Server is not configured." }, { status: 500 });
  }

  const scriptRes = await fetch(scriptUrl, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify({ secret, action, row, expectedName }),
  });
  const scriptJson = await scriptRes.json().catch(() => null);

  if (!scriptRes.ok || !scriptJson?.ok) {
    return NextResponse.json(
      { ok: false, error: scriptJson?.error || "Could not update the listing." },
      { status: 502 }
    );
  }

  // Approving/rejecting changes what should be publicly visible, so bust
  // the cached public pages rather than waiting for the hourly revalidate.
  revalidatePath("/listings");
  revalidatePath("/");

  return NextResponse.json({ ok: true });
}
