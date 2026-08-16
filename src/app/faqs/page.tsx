import type { Metadata } from "next";
import Link from "next/link";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "FAQs",
  description: "Frequently asked questions about myMadhepura.com.",
};

const FAQS = [
  {
    q: "How can I list my business on myMadhepura.com?",
    a: "Click \"List Your Business\" and fill out the form with your business details, category, address, and photos. We review every submission before it goes live.",
  },
  {
    q: "How much does it cost to list my business?",
    a: "Listing your business on myMadhepura.com is completely free.",
  },
  {
    q: "Can I update my listing after it's published?",
    a: "Yes — email Satish@mymadhepura.com with the changes and your listing name, and we'll update it for you.",
  },
  {
    q: "Why is my listing not showing up yet?",
    a: "Every submission is manually reviewed to keep the directory free of spam. This usually takes a few days.",
  },
  {
    q: "How can I report incorrect or inappropriate information?",
    a: "Email Satish@mymadhepura.com with the listing name and the issue, and we'll investigate promptly.",
  },
  {
    q: "How can I advertise on myMadhepura.com?",
    a: "Contact Satish@mymadhepura.com for available advertising opportunities and pricing.",
  },
];

export default function FaqsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <h1 className="text-3xl font-bold text-foreground">Frequently Asked Questions</h1>
      <div className="mt-8 divide-y divide-black/5 rounded-2xl border border-black/5 bg-white shadow-sm">
        {FAQS.map((item) => (
          <details key={item.q} className="group p-5">
            <summary className="cursor-pointer list-none font-semibold text-foreground marker:content-none">
              {item.q}
            </summary>
            <p className="mt-2 text-sm text-foreground/70">{item.a}</p>
          </details>
        ))}
      </div>
      <p className="mt-8 text-sm text-foreground/60">
        Still have questions?{" "}
        <Link href="/contact" className="text-brand hover:underline">
          Contact {SITE.name}
        </Link>
        .
      </p>
    </div>
  );
}
