import type { Metadata } from "next";
import { getCategories } from "@/lib/data";
import ListingForm from "@/components/ListingForm";

export const metadata: Metadata = {
  title: "List Your Business",
  description: "Add your business to myMadhepura.com for free.",
};

export default async function ListYourBusinessPage() {
  const categories = await getCategories();
  const categoryNames = categories.map((c) => c.name);

  return (
    <div className="mx-auto max-w-2xl px-4 py-14 sm:px-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-foreground">List Your Business</h1>
        <p className="mt-4 text-foreground/70">
          Get discovered by the Madhepura community. Fill out the form below with
          your business details — it&apos;s free, no account or login required,
          and every submission is reviewed before it goes live so the directory
          stays spam-free.
        </p>
      </div>

      <div className="mt-8">
        <ListingForm categories={categoryNames} />
      </div>

      <p className="mt-6 text-center text-xs text-foreground/50">
        Questions? Email{" "}
        <a href="mailto:Satish@mymadhepura.com" className="text-brand hover:underline">
          Satish@mymadhepura.com
        </a>
      </p>
    </div>
  );
}
