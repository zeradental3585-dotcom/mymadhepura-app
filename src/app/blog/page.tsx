import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog",
  description: "Local guides and stories from Madhepura, Bihar.",
};

export default function BlogPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6">
      <h1 className="text-3xl font-bold text-foreground">Blog</h1>
      <p className="mt-4 text-foreground/70">
        Local Madhepura guides and stories are coming soon.
      </p>
    </div>
  );
}
