import { getAllListings, getCategories } from "@/lib/data";
import ListingCard from "@/components/ListingCard";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "All Listings",
  description: "Browse hotels, restaurants, doctors, schools, and local businesses in Madhepura, Bihar.",
};

export default async function ListingsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string }>;
}) {
  const { q, category } = await searchParams;
  const [all, categories] = await Promise.all([getAllListings(), getCategories()]);

  const query = (q || "").trim().toLowerCase();
  const filtered = all.filter((l) => {
    const matchesQuery =
      !query ||
      l.name.toLowerCase().includes(query) ||
      l.description.toLowerCase().includes(query) ||
      l.category.toLowerCase().includes(query) ||
      l.address.toLowerCase().includes(query);
    const matchesCategory = !category || l.category === category;
    return matchesQuery && matchesCategory;
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-bold text-foreground">All Listings</h1>
      <p className="mt-1 text-sm text-foreground/60">
        {filtered.length} business{filtered.length === 1 ? "" : "es"} found
      </p>

      <form className="mt-6 flex flex-col gap-3 sm:flex-row">
        <input
          type="text"
          name="q"
          defaultValue={q}
          placeholder="Search by name, category, or area..."
          className="w-full rounded-full border border-black/10 bg-white px-5 py-3 text-sm shadow-sm outline-none focus:border-brand sm:max-w-md"
        />
        {category && <input type="hidden" name="category" value={category} />}
        <button
          type="submit"
          className="rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-dark"
        >
          Search
        </button>
      </form>

      <div className="mt-4 flex flex-wrap gap-2">
        <Link
          href="/listings"
          className={`rounded-full border px-3 py-1.5 text-xs font-medium ${
            !category ? "border-brand bg-brand-light text-brand-dark" : "border-black/10 text-foreground/60"
          }`}
        >
          All
        </Link>
        {categories.map((c) => (
          <Link
            key={c.name}
            href={`/listings?category=${encodeURIComponent(c.name)}`}
            className={`rounded-full border px-3 py-1.5 text-xs font-medium ${
              category === c.name
                ? "border-brand bg-brand-light text-brand-dark"
                : "border-black/10 text-foreground/60"
            }`}
          >
            {c.name} ({c.count})
          </Link>
        ))}
      </div>

      {filtered.length > 0 ? (
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3">
          {filtered.map((l) => (
            <ListingCard key={l.slug} listing={l} />
          ))}
        </div>
      ) : (
        <p className="mt-12 text-center text-foreground/60">
          No listings found. Try a different search or{" "}
          <Link href="/list-your-business" className="text-brand hover:underline">
            add your business
          </Link>
          .
        </p>
      )}
    </div>
  );
}
