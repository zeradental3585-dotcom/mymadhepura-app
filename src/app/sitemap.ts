import type { MetadataRoute } from "next";
import { getAllListings } from "@/lib/data";
import { BLOG_POSTS } from "@/lib/blogPosts";
import { SITE } from "@/lib/site";
import { parseSheetDate } from "@/lib/seo";

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

  // lastModified is omitted when the sheet's DateAdded is missing/unparseable
  // rather than emitting an invalid date that makes Google ignore the sitemap.
  const listingPages = listings.map((l) => {
    const d = parseSheetDate(l.dateAdded);
    return {
      url: `${SITE.url}/listing/${l.slug}`,
      ...(d ? { lastModified: d } : {}),
    };
  });

  const blogPages = BLOG_POSTS.map((p) => ({
    url: `${SITE.url}/blog/${p.slug}`,
    lastModified: new Date(p.date),
  }));

  return [...staticPages, ...listingPages, ...blogPages];
}
