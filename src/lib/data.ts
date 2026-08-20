import fs from "fs";
import path from "path";
import Papa from "papaparse";
import type { Listing } from "./types";

// Swap this at launch: set SHEET_CSV_URL in the environment (Vercel project
// settings) to the "Publish to web -> CSV" link for the Listings tab of the
// Google Sheet. Until then, the site builds from the local snapshot below.
const SHEET_CSV_URL = process.env.SHEET_CSV_URL;

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// Some rows (a WordPress export artifact) store the Slug column as an
// already percent-encoded UTF-8 string (e.g. "%e0%a4%86%e0%a4%a6...")
// instead of plain text. If used as-is for a Next.js dynamic route slug,
// Next.js re-encodes the literal "%" characters, producing a URL that never
// matches a normal incoming request and 404s. Decode it once here so the
// raw text is used consistently everywhere.
function normalizeSlug(raw: string): string {
  const trimmed = raw.trim();
  if (/^(%[0-9a-fA-F]{2})+/.test(trimmed)) {
    try {
      return decodeURIComponent(trimmed);
    } catch {
      return trimmed;
    }
  }
  return trimmed;
}

// Non-ASCII (e.g. Devanagari) route slugs hit a static-generation matching
// issue in the current Next.js version: the listing is generated and its
// data is correct, but the pre-rendered page for that exact path 404s on
// every request. Rather than depend on a framework fix, keep every route
// slug ASCII. Prefer a slugified version of the name; if the name has no
// Latin characters (as with the Devanagari listings above), fall back to
// the address, then the phone number, so the slug is still readable and
// deterministic instead of an opaque id.
function asciiSlug(r: Record<string, string>): string {
  const fromName = slugify(r.Name || "");
  if (fromName) return fromName;
  const fromAddress = slugify(r.Address || "");
  if (fromAddress) return fromAddress;
  const digitsOnly = (r.Phone || "").replace(/\D+/g, "");
  return digitsOnly ? `listing-${digitsOnly}` : "listing";
}

function rowsToListings(rows: Record<string, string>[]): Listing[] {
  const seenSlugs = new Map<string, number>();
  return rows
    .filter((r) => r.Name && r.Name.trim())
    .map((r) => {
      let slug = normalizeSlug(r.Slug || "");
      // eslint-disable-next-line no-control-regex
      if (!slug || /[^\x00-\x7F]/.test(slug)) slug = asciiSlug(r);
      const count = seenSlugs.get(slug) || 0;
      seenSlugs.set(slug, count + 1);
      if (count > 0) slug = `${slug}-${count + 1}`;
      return {
        name: r.Name?.trim() || "",
        category: r.Category?.trim() || "Others",
        description: r.Description?.trim() || "",
        address: r.Address?.trim() || "",
        phone: r.Phone?.trim() || "",
        whatsapp: r.WhatsApp?.trim() || "",
        businessHours: r.BusinessHours?.trim() || "",
        weeklyOff: r.WeeklyOff?.trim() || "",
        topProducts: r.TopProducts?.trim() || "",
        facebook: r.Facebook?.trim() || "",
        instagram: r.Instagram?.trim() || "",
        website: r.Website?.trim() || "",
        latitude: r.Latitude?.trim() || "",
        longitude: r.Longitude?.trim() || "",
        imageUrl: r.ImageURL?.trim() || "",
        slug,
        originalUrl: r.OriginalURL?.trim() || "",
        dateAdded: r.DateAdded?.trim() || "",
        status: (r.Status?.trim() || "Published"),
      };
    })
    .filter((l) => l.status.toLowerCase() !== "hidden");
}

async function loadCsvText(): Promise<string> {
  if (SHEET_CSV_URL) {
    const res = await fetch(SHEET_CSV_URL, { next: { revalidate: 3600 } });
    if (res.ok) return res.text();
    console.error("Failed to fetch SHEET_CSV_URL, falling back to local snapshot");
  }
  const filePath = path.join(process.cwd(), "src/data/listings.csv");
  return fs.readFileSync(filePath, "utf-8");
}

// Note: no extra in-memory cache here on top of the fetch-level
// `next: { revalidate: 3600 }` in loadCsvText(). A previous version kept a
// separate module-level cache of the transformed listings, which could
// outlive an on-demand revalidation of an individual page (e.g. after
// fixing a bad slug) inside the same warm serverless instance, serving a
// stale/inconsistent snapshot. Next's own fetch cache is the single source
// of truth for freshness here.
export async function getAllListings(): Promise<Listing[]> {
  const csvText = await loadCsvText();
  const parsed = Papa.parse<Record<string, string>>(csvText, {
    header: true,
    skipEmptyLines: true,
  });
  return rowsToListings(parsed.data);
}

export async function getListingBySlug(slug: string): Promise<Listing | undefined> {
  const all = await getAllListings();
  return all.find((l) => l.slug === slug);
}

export interface PendingSubmission {
  rowNumber: number; // 1-based Google Sheet row (header is row 1)
  name: string;
  category: string;
  description: string;
  address: string;
  phone: string;
  whatsapp: string;
  businessHours: string;
  weeklyOff: string;
  topProducts: string;
  facebook: string;
  instagram: string;
  website: string;
  imageUrl: string;
  dateAdded: string;
}

// Used only by the /admin review dashboard. Deliberately bypasses the
// revalidate:3600 fetch cache that loadCsvText() uses for public pages —
// after an approve/reject the admin needs to see the sheet's true current
// state immediately, not a stale hour-old snapshot.
async function loadCsvTextFresh(): Promise<string> {
  if (SHEET_CSV_URL) {
    const res = await fetch(SHEET_CSV_URL, { cache: "no-store" });
    if (res.ok) return res.text();
  }
  const filePath = path.join(process.cwd(), "src/data/listings.csv");
  return fs.readFileSync(filePath, "utf-8");
}

export async function getPendingSubmissions(): Promise<PendingSubmission[]> {
  const csvText = await loadCsvTextFresh();
  const parsed = Papa.parse<Record<string, string>>(csvText, {
    header: true,
    skipEmptyLines: true,
  });

  const pending: PendingSubmission[] = [];
  parsed.data.forEach((r, idx) => {
    if (!r.Name || !r.Name.trim()) return;
    // Only rows the submission pipeline actually marked Hidden are
    // "pending" — matches exactly what the Apps Script writes for new
    // submissions, and avoids misreading legacy rows with unrelated blank
    // Status cells as needing review.
    const status = (r.Status || "").trim().toLowerCase();
    if (status !== "hidden") return;

    pending.push({
      rowNumber: idx + 2, // +1 for the header row, +1 for 0-based index
      name: r.Name.trim(),
      category: r.Category?.trim() || "",
      description: r.Description?.trim() || "",
      address: r.Address?.trim() || "",
      phone: r.Phone?.trim() || "",
      whatsapp: r.WhatsApp?.trim() || "",
      businessHours: r.BusinessHours?.trim() || "",
      weeklyOff: r.WeeklyOff?.trim() || "",
      topProducts: r.TopProducts?.trim() || "",
      facebook: r.Facebook?.trim() || "",
      instagram: r.Instagram?.trim() || "",
      website: r.Website?.trim() || "",
      imageUrl: r.ImageURL?.trim() || "",
      dateAdded: r.DateAdded?.trim() || "",
    });
  });

  // Newest submissions first.
  return pending.reverse();
}

export async function getCategories(): Promise<{ name: string; count: number }[]> {
  const all = await getAllListings();
  const counts = new Map<string, number>();
  for (const l of all) {
    counts.set(l.category, (counts.get(l.category) || 0) + 1);
  }
  return Array.from(counts.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
}
