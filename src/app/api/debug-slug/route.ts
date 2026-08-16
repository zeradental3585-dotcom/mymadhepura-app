import { NextResponse } from "next/server";
import { getAllListings } from "@/lib/data";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Temporary diagnostic endpoint — remove after debugging the Aditya
// Vision 404. Returns exact info about how a given slug (or query) matches
// against the live, freshly-computed listings array at request time.
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const secret = searchParams.get("secret");
  if (!process.env.GOOGLE_FORM_SCRIPT_SECRET || secret !== process.env.GOOGLE_FORM_SCRIPT_SECRET) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const q = searchParams.get("q") || "aditya";
  const all = await getAllListings();

  const matches = all
    .filter((l) => l.name.toLowerCase().includes(q.toLowerCase()) || l.slug.includes(q))
    .map((l) => ({
      name: l.name,
      slug: l.slug,
      slugCodePoints: [...l.slug].map((c) => c.codePointAt(0)!.toString(16)),
      slugLength: l.slug.length,
      status: l.status,
    }));

  const exactSlug = searchParams.get("exact");
  const exactMatch = exactSlug
    ? {
        exactSlug,
        exactSlugCodePoints: [...exactSlug].map((c) => c.codePointAt(0)!.toString(16)),
        found: all.some((l) => l.slug === exactSlug),
        foundListing: all.find((l) => l.slug === exactSlug) ?? null,
      }
    : null;

  return NextResponse.json({
    ok: true,
    totalListings: all.length,
    matches,
    exactMatch,
  });
}
