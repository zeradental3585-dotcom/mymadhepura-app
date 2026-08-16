import type { Metadata } from "next";
import Link from "next/link";
import { BLOG_POSTS } from "@/lib/blogPosts";

export const metadata: Metadata = {
  title: "Blog",
  description: "Local guides and stories from Madhepura, Bihar — food, education, healthcare, and more.",
};

export default function BlogPage() {
  const posts = [...BLOG_POSTS].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
        Madhepura Local Guides
      </h1>
      <p className="mt-2 text-foreground/60">
        Original guides to food, education, healthcare, and life in Madhepura, Bihar.
      </p>

      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="flex flex-col rounded-2xl border border-black/5 bg-white p-6 shadow-sm transition hover:border-brand hover:shadow-md"
          >
            <span className="w-fit rounded-full bg-brand-light px-3 py-1 text-xs font-semibold text-brand-dark">
              {post.category}
            </span>
            <h2 className="mt-3 text-lg font-bold text-foreground">{post.title}</h2>
            <p className="mt-2 flex-1 text-sm text-foreground/70">{post.description}</p>
            <span className="mt-4 text-sm font-semibold text-brand">Read more →</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
