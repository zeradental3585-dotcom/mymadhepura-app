import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn about myMadhepura.com, Madhepura's local business directory.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <h1 className="text-3xl font-bold text-foreground">About Us</h1>
      <div className="prose prose-neutral mt-6 max-w-none text-foreground/80">
        <p>
          Welcome to myMadhepura.com — your guide to businesses and services in the
          Madhepura District of Bihar, India.
        </p>
        <p>
          We connect the local community with trusted businesses operating in and
          around Madhepura: hotels, restaurants, doctors, schools, shops, and more.
          Our mission is to make it simple to find the right business nearby, while
          giving local business owners a free, straightforward way to be discovered.
        </p>
        <p>
          Every listing on myMadhepura.com is reviewed before it goes live. We keep
          the directory focused on genuine, local businesses rather than open,
          unmoderated submissions — so what you find here is what you get.
        </p>
        <h2 className="text-xl font-semibold text-foreground">Ownership</h2>
        <p>
          myMadhepura.com is owned and operated by Satish Singh, and is a property of{" "}
          <a href="https://zeratech.io/" target="_blank" rel="noopener noreferrer" className="text-brand hover:underline">
            Zera Technologies
          </a>
          .
        </p>
      </div>
    </div>
  );
}
