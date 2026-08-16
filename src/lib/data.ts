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

function rowsToListings(rows: Record<string, string>[]): Listing[] {
  const seenSlugs = new Map<string, number>();
  return rows
    .filter((r) => r.Name && r.Name.trim())
    .map((r) => {
      let slug = normalizeSlug(r.Slug || slugify(r.Name));
      if (!slug) slug = slugify(r.Name);
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

let cache: { data: Listing[]; ts: number } | null = null;
const CACHE_MS = 5 * 60 * 1000;

export async function getAllListings(): Promise<Listing[]> {
  if (cache && Date.now() - cache.ts < CACHE_MS) return cache.data;
  const csvText = await loadCsvText();
  const parsed = Papa.parse<Record<string, string>>(csvText, {
    header: true,
    skipEmptyLines: true,
  });
  const data = rowsToListings(parsed.data);
  cache = { data, ts: Date.now() };
  return data;
}

export async function getListingBySlug(slug: string): Promise<Listing | undefined> {
  const all = await getAllListings();
  return all.find((l) => l.slug === slug);
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
