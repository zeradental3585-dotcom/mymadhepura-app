import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with the myMadhepura.com team.",
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-14 sm:px-6">
      <h1 className="text-3xl font-bold text-foreground">Contact Us</h1>
      <p className="mt-4 text-foreground/70">
        Questions, corrections, or want to advertise on myMadhepura.com? Reach out
        and we&apos;ll get back to you.
      </p>
      <div className="mt-8 rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
        <p className="text-sm text-foreground/50">Email</p>
        <a href="mailto:Satish@mymadhepura.com" className="text-lg font-semibold text-brand hover:underline">
          Satish@mymadhepura.com
        </a>
      </div>
    </div>
  );
}
