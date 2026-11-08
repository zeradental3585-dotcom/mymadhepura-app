import type { Metadata } from "next";
import ContactLinks from "@/components/ContactLinks";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with the myMadhepura.com team.",
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-14 sm:px-6">
      <h1 className="text-3xl font-bold text-foreground">Contact Us</h1>
      <p className="mt-4 text-foreground/70">
        Questions, corrections, want to claim your listing, or want to advertise on
        myMadhepura.com? Reach out and we&apos;ll get back to you.
      </p>
      <ContactLinks />
    </div>
  );
}
