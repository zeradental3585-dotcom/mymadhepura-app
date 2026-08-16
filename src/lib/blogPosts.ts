export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string; // ISO date
  category: string;
}

// Original editorial content written for myMadhepura.com — not migrated from
// the old WordPress site. Add new posts here and create a matching
// src/app/blog/[slug]/page.tsx.
export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "best-restaurants-in-madhepura",
    title: "Best Restaurants & Street Food in Madhepura: A Local's Guide",
    description:
      "From Bihari thalis to biryani corners and roadside chai stalls — where to eat well in Madhepura.",
    date: "2026-08-16",
    category: "Food & Dining",
  },
  {
    slug: "schools-and-colleges-in-madhepura",
    title: "Schools & Colleges in Madhepura: A Parent's Guide to Education Options",
    description:
      "A practical overview of Madhepura's schools, coaching centres, and colleges — from play school to B.N. Mandal University.",
    date: "2026-08-16",
    category: "Education",
  },
  {
    slug: "hospitals-and-healthcare-in-madhepura",
    title: "Hospitals, Clinics & Emergency Healthcare in Madhepura",
    description:
      "Where to go for emergencies, routine checkups, dental care, and diagnostics in and around Madhepura.",
    date: "2026-08-16",
    category: "Healthcare",
  },
  {
    slug: "things-to-do-in-madhepura",
    title: "Things to Do in Madhepura: Temples, Markets & Local Attractions",
    description:
      "A visitor's and local's guide to Madhepura — from Singheshwar Sthan to the town's markets and public spaces.",
    date: "2026-08-16",
    category: "Local Guide",
  },
  {
    slug: "how-to-list-your-business-on-mymadhepura",
    title: "How to List Your Business on myMadhepura — Free Local Advertising",
    description:
      "A step-by-step guide for Madhepura business owners: what to include, how approval works, and why it helps you get found.",
    date: "2026-08-16",
    category: "For Businesses",
  },
];

export function getBlogPost(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}
