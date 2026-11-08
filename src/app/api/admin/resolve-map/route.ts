import { NextResponse } from "next/server";
import { isAdminAuthed } from "@/lib/adminAuth";

export const runtime = "nodejs";

// Expands a Google Maps short link (maps.app.goo.gl/...) into the full URL
// it redirects to, which carries the place name and coordinates. It only
// follows redirects between Google Maps hosts and never reads page content.
const HOSTS = ["maps.app.goo.gl", "goo.gl", "www.google.com", "google.com", "maps.google.com"];

function allowed(u: URL): boolean {
  if (u.protocol !== "https:" || !HOSTS.includes(u.hostname)) return false;
  return u.hostname.endsWith("goo.gl") || u.pathname.startsWith("/maps");
}

export async function POST(req: Request) {
  if (!(await isAdminAuthed())) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  let url: URL;
  try {
    url = new URL(String(body?.url || ""));
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid link." }, { status: 400 });
  }
  if (!allowed(url)) {
    return NextResponse.json({ ok: false, error: "Not a Google Maps link." }, { status: 400 });
  }

  for (let i = 0; i < 6; i++) {
    const res = await fetch(url, {
      redirect: "manual",
      headers: { "User-Agent": "Mozilla/5.0 (compatible; myMadhepura-admin)" },
    }).catch(() => null);
    const loc = res?.headers.get("location");
    if (!res || res.status < 300 || res.status >= 400 || !loc) break;

    let next = new URL(loc, url);
    // Google may bounce through a consent page that carries the real target.
    if (next.hostname === "consent.google.com") {
      const cont = next.searchParams.get("continue");
      if (!cont) break;
      try {
        next = new URL(cont);
      } catch {
        break;
      }
    }
    if (!allowed(next)) break;
    url = next;
  }

  return NextResponse.json({ ok: true, url: url.toString() });
}
