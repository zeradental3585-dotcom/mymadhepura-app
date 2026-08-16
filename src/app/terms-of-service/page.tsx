import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms of Service for myMadhepura.com.",
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <h1 className="text-3xl font-bold text-foreground">Terms of Service</h1>
      <div className="prose prose-neutral mt-6 max-w-none space-y-4 text-foreground/80">
        <p>
          myMadhepura.com is a property of Zera Technologies, operated by Satish
          Singh. By using this website, you agree to the following terms.
        </p>
        <h2 className="text-lg font-semibold text-foreground">Listings</h2>
        <p>
          Business listings are submitted by business owners or members of the
          public and reviewed by us before publication. We reserve the right to
          edit, decline, or remove any listing that is inaccurate, inappropriate,
          or unrelated to businesses genuinely operating in or around Madhepura.
        </p>
        <h2 className="text-lg font-semibold text-foreground">Accuracy</h2>
        <p>
          While we review submissions, we do not independently verify every
          detail of every listing (such as pricing or hours). Please confirm
          details directly with the business before visiting or transacting.
        </p>
        <h2 className="text-lg font-semibold text-foreground">Intellectual property</h2>
        <p>
          The design, layout, and original content of myMadhepura.com belong to
          Satish Singh and Zera Technologies. Business names, logos, and images
          submitted with listings remain the property of their respective
          owners.
        </p>
        <h2 className="text-lg font-semibold text-foreground">Limitation of liability</h2>
        <p>
          myMadhepura.com is provided as a free community directory. We are not
          liable for any loss or damage arising from your use of the site or
          your dealings with any listed business.
        </p>
        <h2 className="text-lg font-semibold text-foreground">Changes</h2>
        <p>We may update these terms from time to time. Continued use of the site means you accept the current terms.</p>
        <h2 className="text-lg font-semibold text-foreground">Contact</h2>
        <p>
          Questions?{" "}
          <a href="mailto:Satish@mymadhepura.com" className="text-brand hover:underline">
            Satish@mymadhepura.com
          </a>
        </p>
      </div>
    </div>
  );
}
