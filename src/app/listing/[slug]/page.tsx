import { getAllListings, getListingBySlug } from "@/lib/data";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { cleanPhone, listingJsonLd } from "@/lib/seo";
import { categorySlug } from "@/lib/categories";
import ListingCard from "@/components/ListingCard";

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
    alternates: { canonical: `/listing/${listing.slug}` },
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

  const phone = cleanPhone(listing.phone);
  const wa = cleanPhone(listing.whatsapp);
  const claimText = encodeURIComponent(
    `Hi, I want to claim / update the listing "${listing.name}" on myMadhepura (mymadhepura.com). Page: https://mymadhepura.com/listing/${listing.slug}`
  );
  const jsonLd = listingJsonLd(listing);
  const related = (await getAllListings())
    .filter((l) => l.category === listing.category && l.slug !== listing.slug)
    .slice(0, 3);

  const mapsUrl =
    listing.latitude && listing.longitude
      ? `https://www.google.com/maps/search/?api=1&query=${listing.latitude},${listing.longitude}`
      : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
          listing.address || listing.name + " Madhepura"
        )}`;

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <nav className="text-sm text-foreground/50">
        <Link href="/listings" className="hover:text-brand">Listings</Link>
        <span className="mx-1">/</span>
        <Link href={`/category/${categorySlug(listing.category)}`} className="hover:text-brand">
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
            {phone && (
              <a href={`tel:${phone}`} className="flex items-center gap-3 rounded-xl border border-black/5 bg-background p-4 hover:border-brand">
                <span className="text-xl">📞</span>
                <div>
                  <p className="text-xs text-foreground/50">Call</p>
                  <p className="font-semibold">{phone}</p>
                </div>
              </a>
            )}
            {wa && (
              <a
                href={`https://wa.me/91${wa.replace(/\D+/g, "").replace(/^(91|0)(?=\d{10}$)/, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 rounded-xl border border-black/5 bg-background p-4 hover:border-brand"
              >
                <span className="text-xl">💬</span>
                <div>
                  <p className="text-xs text-foreground/50">WhatsApp</p>
                  <p className="font-semibold">{wa}</p>
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

      <div className="mt-6 flex flex-col items-start justify-between gap-3 rounded-2xl border border-dashed border-brand/40 bg-brand-light/50 p-5 sm:flex-row sm:items-center">
        <div>
          <p className="font-semibold text-foreground">Is this your business?</p>
          <p className="text-sm text-foreground/60">
            Claim this listing to keep your phone, hours and photos up to date.
          </p>
        </div>
        <a
          href={`https://wa.me/919835102324?text=${claimText}`}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full bg-brand px-5 py-2 text-sm font-semibold text-white hover:bg-brand-dark"
        >
          Claim this business
        </a>
      </div>

      {related.length > 0 && (
        <section className="mt-10">
          <h2 className="text-lg font-bold text-foreground">
            More {listing.category} in Madhepura
          </h2>
          <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-3">
            {related.map((l) => (
              <ListingCard key={l.slug} listing={l} />
            ))}
          </div>
          <Link
            href={`/category/${categorySlug(listing.category)}`}
            className="mt-4 inline-block text-sm font-semibold text-brand hover:underline"
          >
            View all {listing.category} listings &rarr;
          </Link>
        </section>
      )}
    </div>
  );
}
