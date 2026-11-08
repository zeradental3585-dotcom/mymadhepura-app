import type { Listing } from "./types";
import { SITE } from "./site";

// DateAdded values in the sheet are inconsistent: ISO strings, or raw Excel
// serial numbers (e.g. "45059") that JS parses as year 45059. Normalise to a
// real Date, or undefined when unusable, so the sitemap never emits an
// invalid <lastmod>.
export function parseSheetDate(raw: string): Date | undefined {
  const s = (raw || "").trim();
  if (!s) return undefined;
  let d: Date;
  if (/^\d{5}(\.\d+)?$/.test(s)) {
    d = new Date(Math.round((Number(s) - 25569) * 86400 * 1000));
  } else {
    d = new Date(s);
  }
  const y = d.getUTCFullYear();
  if (Number.isNaN(d.getTime()) || y < 2015 || y > 2100) return undefined;
  return d;
}

// Returns a dialable number, or "" for obvious placeholders (123456789,
// 9876543210, repeated digits) so we never show visitors a dead number.
export function cleanPhone(raw: string): string {
  const digits = (raw || "").replace(/\D+/g, "").replace(/^(91|0)(?=\d{10}$)/, "");
  if (digits.length < 10 || digits.length > 13) return "";
  if (/^(\d)\1+$/.test(digits)) return "";
  if (["1234567890", "123456789", "9876543210", "0123456789"].includes(digits)) return "";
  return (raw || "").trim();
}

export function listingJsonLd(l: Listing) {
  const phone = cleanPhone(l.phone);
  const url = `${SITE.url}/listing/${l.slug}`;
  const business: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": url,
    name: l.name,
    url,
    description: l.description || undefined,
    image: l.imageUrl || undefined,
    telephone: phone || undefined,
    openingHours: l.businessHours || undefined,
    address: {
      "@type": "PostalAddress",
      streetAddress: l.address || undefined,
      addressLocality: "Madhepura",
      addressRegion: "Bihar",
      addressCountry: "IN",
    },
    sameAs: [l.website, l.facebook, l.instagram].filter(Boolean),
  };
  if (l.latitude && l.longitude) {
    business.geo = {
      "@type": "GeoCoordinates",
      latitude: l.latitude,
      longitude: l.longitude,
    };
  }
  const breadcrumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE.url },
      { "@type": "ListItem", position: 2, name: "Listings", item: `${SITE.url}/listings` },
      {
        "@type": "ListItem",
        position: 3,
        name: l.category,
        item: `${SITE.url}/listings?category=${encodeURIComponent(l.category)}`,
      },
      { "@type": "ListItem", position: 4, name: l.name, item: url },
    ],
  };
  return [business, breadcrumbs];
}
