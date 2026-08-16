import type { Metadata } from "next";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "List Your Business",
  description: "Add your business to myMadhepura.com for free.",
};

export default function ListYourBusinessPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-14 text-center sm:px-6">
      <h1 className="text-3xl font-bold text-foreground">List Your Business</h1>
      <p className="mt-4 text-foreground/70">
        Get discovered by the Madhepura community. Fill out the form below with
        your business details — it&apos;s free, and every submission is reviewed
        before it goes live so the directory stays spam-free.
      </p>
      <a
        href={SITE.formUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-8 inline-block rounded-full bg-brand px-8 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-dark"
      >
        Open the Business Listing Form
      </a>
      <p className="mt-4 text-xs text-foreground/50">
        Questions? Email{" "}
        <a href="mailto:Satish@mymadhepura.com" className="text-brand hover:underline">
          Satish@mymadhepura.com
        </a>
      </p>
    </div>
  );
}
