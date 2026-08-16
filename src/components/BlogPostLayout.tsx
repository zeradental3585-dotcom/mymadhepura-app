import Link from "next/link";
import type { BlogPost } from "@/lib/blogPosts";

export default function BlogPostLayout({
  post,
  children,
}: {
  post: BlogPost;
  children: React.ReactNode;
}) {
  const dateLabel = new Date(post.date).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <nav className="text-sm text-foreground/50">
        <Link href="/blog" className="hover:text-brand">
          Blog
        </Link>
        <span className="mx-1">/</span>
        <span>{post.category}</span>
      </nav>

      <span className="mt-4 inline-block w-fit rounded-full bg-brand-light px-3 py-1 text-xs font-semibold text-brand-dark">
        {post.category}
      </span>
      <h1 className="mt-3 text-2xl font-bold text-foreground sm:text-3xl">{post.title}</h1>
      <p className="mt-2 text-sm text-foreground/50">{dateLabel}</p>

      <article className="mt-8 space-y-5 leading-relaxed text-foreground/80 [&_h2]:mt-8 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-foreground [&_a]:text-brand [&_a]:font-medium [&_a:hover]:underline [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-2">
        {children}
      </article>

      <div className="mt-10 border-t border-black/5 pt-6">
        <Link href="/blog" className="text-sm font-semibold text-brand hover:underline">
          ← Back to all guides
        </Link>
      </div>
    </div>
  );
}
