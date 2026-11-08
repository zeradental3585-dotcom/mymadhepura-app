import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import ListingCard from "@/components/ListingCard";
import { getAllListings, getCategories } from "@/lib/data";
import { categoryIntro, categorySlug } from "@/lib/categories";
import { SITE } from "@/lib/site";

export const revalidate = 3600;

async function findCategory(slug: string) {
  const cats = await getCategories();
  return cats.find((c) => categorySlug(c.name) === slug);
}

export async function generateStaticParams() {
  const cats = await getCategories();
  return cats.map((c) => ({ slug: categorySlug(c.name) }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const cat = await findCategory(slug);
  if (!cat) return {};
  const title = `Best ${cat.name} in Madhepura, Bihar (${cat.count} listed)`;
  const description = categoryIntro(cat.name, cat.count).slice(0, 200);
  return {
    title,
    description,
    alternates: { canonical: `/category/${slug}` },
    openGraph: { title, description, url: `${SITE.url}/category/${slug}` },
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [cat, all, categories] = await Promise.all([
    findCategory(slug),
    getAllListings(),
    getCategories(),
  ]);
  if (!cat) notFound();

  const listings = all.filter((l) => l.category === cat.name);
  const others = categories.filter((c) => c.name !== cat.name).slice(0, 12);

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: `${cat.name} in Madhepura`,
      numberOfItems: listings.length,
      itemListElement: listings.slice(0, 50).map((l, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: `${SITE.url}/listing/${l.slug}`,
        name: l.name,
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE.url },
        { "@type": "ListItem", position: 2, name: "Listings", item: `${SITE.url}/listings` },
        { "@type": "ListItem", position: 3, name: cat.name, item: `${SITE.url}/category/${slug}` },
      ],
    },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <nav className="text-sm text-foreground/50">
        <Link href="/listings" className="hover:text-brand">Listings</Link>
        <span className="mx-1">/</span>
        <span>{cat.name}</span>
      </nav>

      <h1 className="mt-3 text-3xl font-bold text-foreground">Best {cat.name} in Madhepura</h1>
      <p className="mt-3 max-w-3xl text-foreground/70">{categoryIntro(cat.name, cat.count)}</p>

      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3">
        {listings.map((l) => (
          <ListingCard key={l.slug} listing={l} />
        ))}
      </div>

      <div className="mt-12 rounded-2xl bg-brand-light p-6 text-center">
        <h2 className="text-lg font-bold text-foreground">Own a {cat.name.toLowerCase()} business in Madhepura?</h2>
        <p className="mt-1 text-sm text-foreground/70">Get listed for free and reach local customers.</p>
        <Link
          href="/list-your-business"
          className="mt-4 inline-block rounded-full bg-brand px-6 py-2.5 text-sm font-semibold text-white hover:bg-brand-dark"
        >
          List Your Business
        </Link>
      </div>

      <h2 className="mt-12 text-lg font-bold text-foreground">Browse other categories</h2>
      <div className="mt-3 flex flex-wrap gap-2">
        {others.map((c) => (
          <Link
            key={c.name}
            href={`/category/${categorySlug(c.name)}`}
            className="rounded-full border border-black/10 px-3 py-1.5 text-xs font-medium text-foreground/70 hover:border-brand hover:text-brand"
          >
            {c.name} ({c.count})
          </Link>
        ))}
      </div>
    </div>
  );
}
