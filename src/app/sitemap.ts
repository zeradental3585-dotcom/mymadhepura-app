import type { MetadataRoute } from "next";
import { getAllListings } from "@/lib/data";
import { SITE } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const listings = await getAllListings();

  const staticPages = [
    "",
    "listings",
    "about",
    "contact",
    "faqs",
    "list-your-business",
    "privacy-policy",
    "terms-of-service",
    "blog",
  ].map((slug) => ({
    url: `${SITE.url}/${slug}`,
    lastModified: new Date(),
  }));

  const listingPages = listings.map((l) => ({
    url: `${SITE.url}/listing/${l.slug}`,
    lastModified: l.dateAdded ? new Date(l.dateAdded) : new Date(),
  }));

  return [...staticPages, ...listingPages];
}
