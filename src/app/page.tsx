import Link from "next/link";
import { getAllListings, getCategories } from "@/lib/data";
import ListingCard from "@/components/ListingCard";
import ShareButtons from "@/components/ShareButtons";
import { BLOG_POSTS } from "@/lib/blogPosts";
import { SITE } from "@/lib/site";

const CHIPS = [
  { label: "Hotels", href: "/category/hotels" },
  { label: "Restaurants", href: "/category/restaurants" },
  { label: "Doctors", href: "/category/doctors" },
  { label: "Schools", href: "/category/schools" },
  { label: "Banquets", href: "/category/banquets" },
  { label: "Education", href: "/category/education" },
];

const FEATURED_GUIDES = [
  "singheshwar-sthan-madhepura-complete-guide",
  "best-hotels-in-madhepura-where-to-stay",
  "where-to-stay-near-singheshwar-sthan",
];

export default async function HomePage() {
  const [listings, categories] = await Promise.all([
    getAllListings(),
    getCategories(),
  ]);
  const featured = listings.filter((l) => l.category !== "Hotels").slice(0, 8);

  const hotels = listings.filter((l) => l.category === "Hotels");
  const isSingheshwar = (a: string) => /singheshwar/i.test(a);
  const hotelPicks = [
    ...hotels.filter((h) => isSingheshwar(h.address) || isSingheshwar(h.name)),
    ...hotels.filter((h) => !(isSingheshwar(h.address) || isSingheshwar(h.name))),
  ].slice(0, 6);

  const guides = FEATURED_GUIDES.map((s) => BLOG_POSTS.find((p) => p.slug === s)).filter(
    (p): p is (typeof BLOG_POSTS)[number] => Boolean(p)
  );

  return (
    <div>
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-light to-background">
        <div className="mx-auto max-w-6xl px-4 py-16 text-center sm:px-6 sm:py-20">
          <p className="mx-auto inline-block rounded-full bg-white px-4 py-1 text-xs font-semibold text-brand-dark shadow-sm">
            Madhepura district, Bihar
          </p>
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
            {SITE.tagline}
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-foreground/70">
            {SITE.description} Plan your stay near Baba Singheshwar Sthan and find
            hotels across Madhepura, Singheshwar, Bihariganj and Murliganj.
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
          <div className="mt-5 flex flex-wrap justify-center gap-2">
            {CHIPS.map((c) => (
              <Link
                key={c.href}
                href={c.href}
                className="rounded-full border border-black/10 bg-white px-4 py-1.5 text-sm font-medium text-foreground shadow-sm hover:border-brand"
              >
                {c.label}
              </Link>
            ))}
          </div>
          <p className="mt-4 text-sm text-foreground/50">
            {listings.length}+ local businesses listed across {categories.length} categories
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Stay in Madhepura &amp; Singheshwar</h2>
            <p className="mt-1 text-sm text-foreground/60">
              Hotels, lodges and guest houses across the district, with address and directions.
            </p>
          </div>
          <Link href="/category/hotels" className="shrink-0 text-sm font-semibold text-brand hover:text-brand-dark">
            All hotels &rarr;
          </Link>
        </div>
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3">
          {hotelPicks.map((l) => (
            <ListingCard key={l.slug} listing={l} />
          ))}
        </div>
      </section>

      <section className="bg-brand-dark text-white">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-14 sm:px-6 md:grid-cols-2 md:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-white/70">Pilgrimage guide</p>
            <h2 className="mt-2 text-3xl font-extrabold">Baba Singheshwar Sthan</h2>
            <p className="mt-3 text-white/80">
              An ancient Shiva temple about 8 km from Madhepura, linked to the sage
              Shringi Rishi and known for its month-long Mahashivratri fair. Read the
              legend, how to reach, the best time to visit and where to stay.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/blog/singheshwar-sthan-madhepura-complete-guide"
                className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-brand-dark shadow-sm hover:bg-brand-light"
              >
                Read the full guide
              </Link>
              <Link
                href="/blog/where-to-stay-near-singheshwar-sthan"
                className="rounded-full border border-white/40 px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/10"
              >
                Where to stay
              </Link>
            </div>
          </div>
          <div className="rounded-2xl bg-white p-5 text-foreground shadow-lg">
            <h3 className="text-lg font-bold">Quick facts</h3>
            <ul className="mt-3 space-y-2 text-sm text-foreground/80">
              <li>📍 Singheshwar block, Madhepura district, Bihar (PIN 852128)</li>
              <li>🛕 Dedicated to Lord Shiva, with a legend tied to Shringi Rishi</li>
              <li>🚆 About 8 km from Dauram Madhepura railway station</li>
              <li>🎪 Month-long fair around Mahashivratri, with a cattle fair</li>
              <li>🏨 Hotels in Singheshwar and in Madhepura town</li>
            </ul>
            <ShareButtons
              path="/blog/singheshwar-sthan-madhepura-complete-guide/"
              title="Baba Singheshwar Sthan, Madhepura: complete guide"
              label="Share the Singheshwar guide"
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <h2 className="text-xl font-bold text-foreground">Browse by category</h2>
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
          {categories.slice(0, 15).map((c) => (
            <Link
              key={c.name}
              href={"/listings?category=" + encodeURIComponent(c.name)}
              className="flex flex-col items-center justify-center rounded-xl border border-black/5 bg-white px-4 py-6 text-center shadow-sm transition hover:border-brand hover:shadow-md"
            >
              <span className="font-semibold text-foreground">{c.name}</span>
              <span className="mt-1 text-xs text-foreground/50">{c.count} listed</span>
            </Link>
          ))}
        </div>
      </section>

      {guides.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 pb-14 sm:px-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-foreground">Travel and stay guides</h2>
            <Link href="/blog" className="text-sm font-semibold text-brand hover:text-brand-dark">
              All guides &rarr;
            </Link>
          </div>
          <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-3">
            {guides.map((p) => (
              <Link
                key={p.slug}
                href={"/blog/" + p.slug}
                className="flex flex-col rounded-2xl border border-black/5 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <span className="w-fit rounded-full bg-brand-light px-3 py-1 text-xs font-semibold text-brand-dark">
                  {p.category}
                </span>
                <h3 className="mt-3 font-semibold text-foreground">{p.title}</h3>
                <p className="mt-2 line-clamp-3 text-sm text-foreground/60">{p.description}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

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
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              href="/list-your-business"
              className="inline-block rounded-full bg-white px-6 py-3 text-sm font-semibold text-brand-dark shadow-sm transition hover:bg-brand-light"
            >
              List Your Business
            </Link>
            <Link
              href="/how-to-list"
              className="inline-block rounded-full border border-white/40 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10"
            >
              Watch how (Hindi video)
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
