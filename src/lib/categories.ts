export function categorySlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/&amp;/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// Short, unique intro copy for a category landing page. Keeps pages useful
// to readers (and distinct for search) rather than a bare list of cards.
export function categoryIntro(name: string, count: number): string {
  const lower = name.toLowerCase();
  return `Looking for ${lower} in Madhepura, Bihar? myMadhepura lists ${count} local ${lower} ${
    count === 1 ? "business" : "businesses"
  } with addresses, phone numbers, WhatsApp contacts, opening hours and directions. Every listing is reviewed before it goes live, so you can call or visit with confidence. Own a ${lower} business in Madhepura? Add it for free.`;
}
