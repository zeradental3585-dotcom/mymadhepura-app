import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center px-4 py-24 text-center sm:px-6">
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-light text-2xl font-bold text-brand-dark">
        404
      </span>
      <h1 className="mt-6 text-2xl font-bold text-foreground sm:text-3xl">
        We couldn&apos;t find that page
      </h1>
      <p className="mt-3 text-foreground/70">
        The page you&apos;re looking for may have moved or no longer exists.
        Try searching the directory, or head back to the homepage.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/"
          className="rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-dark"
        >
          Go to Homepage
        </Link>
        <Link
          href="/listings"
          className="rounded-full border border-black/10 bg-white px-5 py-2.5 text-sm font-semibold text-foreground transition hover:border-brand hover:text-brand"
        >
          Browse Listings
        </Link>
      </div>
    </div>
  );
}
