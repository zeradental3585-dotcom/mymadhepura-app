import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy Policy for myMadhepura.com.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <h1 className="text-3xl font-bold text-foreground">Privacy Policy</h1>
      <div className="prose prose-neutral mt-6 max-w-none space-y-4 text-foreground/80">
        <p>
          myMadhepura.com is operated by Satish Singh, a property of Zera
          Technologies. This Privacy Policy explains how we collect, use, and
          protect information when you use this website.
        </p>
        <h2 className="text-lg font-semibold text-foreground">Information we collect</h2>
        <p>
          When you submit a business listing through our form, we collect the
          business details you provide: name, category, address, phone number,
          description, and any images you upload. We do not require you to create
          an account or provide a password to submit a listing.
        </p>
        <p>
          Like most websites, we use analytics tools (Google Analytics) to
          understand how visitors use the site — pages viewed, general location,
          device type, and browsing behavior. This data is aggregated and not
          used to personally identify you.
        </p>
        <h2 className="text-lg font-semibold text-foreground">How we use it</h2>
        <p>
          Listing submissions are used solely to review and, if approved, publish
          your business on the directory. Analytics data helps us improve the
          site&apos;s content and performance.
        </p>
        <h2 className="text-lg font-semibold text-foreground">Data sharing</h2>
        <p>
          We do not sell your information. We may share it with service
          providers that help us operate the site (such as hosting and analytics
          providers), or if required by law.
        </p>
        <h2 className="text-lg font-semibold text-foreground">Third-party links</h2>
        <p>
          Listings may link to third-party websites, social media pages, or
          contact numbers. We are not responsible for the privacy practices of
          those third parties.
        </p>
        <h2 className="text-lg font-semibold text-foreground">Changes to this policy</h2>
        <p>
          We may update this Privacy Policy from time to time. Changes will be
          posted on this page.
        </p>
        <h2 className="text-lg font-semibold text-foreground">Contact</h2>
        <p>
          Questions about this policy can be sent to{" "}
          <a href="mailto:Satish@mymadhepura.com" className="text-brand hover:underline">
            Satish@mymadhepura.com
          </a>
          .
        </p>
      </div>
    </div>
  );
}
