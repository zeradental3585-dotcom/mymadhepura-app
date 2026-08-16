import Link from "next/link";
import { getAllListings, getCategories } from "@/lib/data";
import ListingCard from "@/components/ListingCard";
import { SITE } from "@/lib/site";

export default async function HomePage() {
  const [listings, categories] = await Promise.all([
    getAllListings(),
    getCategories(),
  ]);
  const featured = listings.slice(0, 8);

  return (
    <div>
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-light to-background">
        <div className="mx-auto max-w-6xl px-4 py-20 text-center sm:px-6">
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
            {SITE.tagline}
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-foreground/70">
            {SITE.description}
          </p>
          <form action="/listings" className="mx-auto mt-8 flex max-w-xl gap-2">
            <input
              type="text"
              name="q"
              placeholder="Search hotels, doctors, schools, restaurants..."
              className="w-full rounded-full border border-black/10 bg-white px-5 py-3 text-sm shadow-sm outline-none focus:border-brand"
            />
            <button
              type="submit"
              className="rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-dark"
            >
              Search
            </button>
          </form>
          <p className="mt-4 text-sm text-foreground/50">
            {listings.length}+ local businesses listed across {categories.length} categories
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <h2 className="text-xl font-bold text-foreground">Browse by category</h2>
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
          {categories.slice(0, 15).map((c) => (
            <Link
              key={c.name}
              href={`/listings?category=${encodeURIComponent(c.name)}`}
              className="flex flex-col items-center justify-center rounded-xl border border-black/5 bg-white px-4 py-6 text-center shadow-sm transition hover:border-brand hover:shadow-md"
            >
              <span className="font-semibold text-foreground">{c.name}</span>
              <span className="mt-1 text-xs text-foreground/50">{c.count} listed</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-foreground">Featured listings</h2>
          <Link href="/listings" className="text-sm font-semibold text-brand hover:text-brand-dark">
            View all &rarr;
          </Link>
        </div>
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-4">
          {featured.map((l) => (
            <ListingCard key={l.slug} listing={l} />
          ))}
        </div>
      </section>

      <section className="bg-brand-dark py-14 text-center text-white">
        <div className="mx-auto max-w-2xl px-4 sm:px-6">
          <h2 className="text-2xl font-bold">Own a business in Madhepura?</h2>
          <p className="mt-2 text-white/80">
            Get discovered by your community. Listing your business is free and only takes a minute.
          </p>
          <Link
            href="/list-your-business"
            className="mt-6 inline-block rounded-full bg-white px-6 py-3 text-sm font-semibold text-brand-dark shadow-sm transition hover:bg-brand-light"
          >
            List Your Business
          </Link>
        </div>
      </section>
    </div>
  );
}
