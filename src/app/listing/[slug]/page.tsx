import { getAllListings, getListingBySlug } from "@/lib/data";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

// Bounds how long a stale response (including a wrongly-cached 404 from
// before a data fix, e.g. a corrected slug) can stick around. Matches the
// listings data's own fetch revalidation window in src/lib/data.ts.
export const revalidate = 3600;

export async function generateStaticParams() {
  const all = await getAllListings();
  return all.map((l) => ({ slug: l.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const listing = await getListingBySlug(slug);
  if (!listing) return {};
  return {
    title: listing.name,
    description: listing.description || `${listing.name} - ${listing.category} in Madhepura, Bihar.`,
    openGraph: {
      title: listing.name,
      description: listing.description,
      // images intentionally omitted: the listing/[slug]/opengraph-image.tsx
      // file convention generates a branded, mobile-safe share card instead
      // of using the raw uploaded photo directly.
    },
  };
}

export default async function ListingPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const listing = await getListingBySlug(slug);
  if (!listing) notFound();

  const mapsUrl =
    listing.latitude && listing.longitude
      ? `https://www.google.com/maps/search/?api=1&query=${listing.latitude},${listing.longitude}`
      : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
          listing.address || listing.name + " Madhepura"
        )}`;

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <nav className="text-sm text-foreground/50">
        <Link href="/listings" className="hover:text-brand">Listings</Link>
        <span className="mx-1">/</span>
        <Link href={`/listings?category=${encodeURIComponent(listing.category)}`} className="hover:text-brand">
          {listing.category}
        </Link>
      </nav>

      <div className="mt-4 overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm">
        <div className="relative h-64 w-full bg-brand-light sm:h-80">
          {listing.imageUrl ? (
            <Image src={listing.imageUrl} alt={listing.name} fill unoptimized className="object-cover" />
          ) : null}
        </div>
        <div className="p-6 sm:p-8">
          <span className="rounded-full bg-brand-light px-3 py-1 text-xs font-semibold text-brand-dark">
            {listing.category}
          </span>
          <h1 className="mt-3 text-2xl font-bold text-foreground sm:text-3xl">{listing.name}</h1>
          {listing.address && <p className="mt-2 text-foreground/60">📍 {listing.address}</p>}

          {listing.description && (
            <p className="mt-6 whitespace-pre-line leading-relaxed text-foreground/80">
              {listing.description}
            </p>
          )}

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {listing.phone && (
              <a href={`tel:${listing.phone}`} className="flex items-center gap-3 rounded-xl border border-black/5 bg-background p-4 hover:border-brand">
                <span className="text-xl">📞</span>
                <div>
                  <p className="text-xs text-foreground/50">Call</p>
                  <p className="font-semibold">{listing.phone}</p>
                </div>
              </a>
            )}
            {listing.whatsapp && (
              <a
                href={`https://wa.me/91${listing.whatsapp.replace(/^0+/, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 rounded-xl border border-black/5 bg-background p-4 hover:border-brand"
              >
                <span className="text-xl">💬</span>
                <div>
                  <p className="text-xs text-foreground/50">WhatsApp</p>
                  <p className="font-semibold">{listing.whatsapp}</p>
                </div>
              </a>
            )}
            {listing.businessHours && (
              <div className="flex items-center gap-3 rounded-xl border border-black/5 bg-background p-4">
                <span className="text-xl">🕒</span>
                <div>
                  <p className="text-xs text-foreground/50">Hours</p>
                  <p className="font-semibold">{listing.businessHours}</p>
                  {listing.weeklyOff && (
                    <p className="text-xs text-foreground/50">Weekly off: {listing.weeklyOff}</p>
                  )}
                </div>
              </div>
            )}
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-xl border border-black/5 bg-background p-4 hover:border-brand"
            >
              <span className="text-xl">🗺️</span>
              <div>
                <p className="text-xs text-foreground/50">Directions</p>
                <p className="font-semibold">Open in Google Maps</p>
              </div>
            </a>
          </div>

          {listing.topProducts && (
            <div className="mt-8">
              <h2 className="text-sm font-semibold text-foreground">Products &amp; Services</h2>
              <p className="mt-1 text-sm text-foreground/70">{listing.topProducts}</p>
            </div>
          )}

          {(listing.facebook || listing.instagram || listing.website) && (
            <div className="mt-6 flex gap-4 text-sm">
              {listing.website && (
                <a href={listing.website} target="_blank" rel="noopener noreferrer" className="text-brand hover:underline">
                  Website
                </a>
              )}
              {listing.facebook && (
                <a href={listing.facebook} target="_blank" rel="noopener noreferrer" className="text-brand hover:underline">
                  Facebook
                </a>
              )}
              {listing.instagram && (
                <a href={listing.instagram} target="_blank" rel="noopener noreferrer" className="text-brand hover:underline">
                  Instagram
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
