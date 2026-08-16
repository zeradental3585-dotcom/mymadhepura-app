import Image from "next/image";
import Link from "next/link";
import type { Listing } from "@/lib/types";

export default function ListingCard({ listing }: { listing: Listing }) {
  return (
    <Link
      href={`/listing/${listing.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="relative h-40 w-full bg-brand-light">
        {listing.imageUrl ? (
          <Image
            src={listing.imageUrl}
            alt={listing.name}
            fill
            unoptimized
            className="object-cover transition duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-brand-dark/40">
            {listing.name.slice(0, 1)}
          </div>
        )}
        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-xs font-semibold text-brand-dark shadow-sm">
          {listing.category}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-1 p-4">
        <h3 className="line-clamp-2 font-semibold text-foreground">{listing.name}</h3>
        <p className="line-clamp-2 text-sm text-foreground/60">
          {listing.description || listing.address}
        </p>
        {listing.address && (
          <p className="mt-1 line-clamp-1 text-xs text-foreground/45">📍 {listing.address}</p>
        )}
      </div>
    </Link>
  );
}
