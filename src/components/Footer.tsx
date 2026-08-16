import Link from "next/link";
import { SITE } from "@/lib/site";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-20 border-t border-black/5 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
          <div>
            <span className="text-lg font-bold">{SITE.name}</span>
            <p className="mt-2 text-sm text-foreground/70">{SITE.description}</p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">Explore</h3>
            <ul className="mt-3 space-y-2 text-sm text-foreground/70">
              <li><Link href="/listings" className="hover:text-brand">All Listings</Link></li>
              <li><Link href="/blog" className="hover:text-brand">Blog</Link></li>
              <li><Link href="/list-your-business" className="hover:text-brand">List Your Business</Link></li>
              <li><Link href="/about" className="hover:text-brand">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-brand">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">Legal</h3>
            <ul className="mt-3 space-y-2 text-sm text-foreground/70">
              <li><Link href="/privacy-policy" className="hover:text-brand">Privacy Policy</Link></li>
              <li><Link href="/terms-of-service" className="hover:text-brand">Terms of Service</Link></li>
              <li><Link href="/faqs" className="hover:text-brand">FAQs</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">Madhepura, Bihar</h3>
            <p className="mt-3 text-sm text-foreground/70">
              Connecting the local community with trusted businesses and services in and around Madhepura.
            </p>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-2 border-t border-black/5 pt-6 text-xs text-foreground/50 sm:flex-row">
          <p>
            &copy; {year} {SITE.name}, a property of{" "}
            <a
              href="https://zeratech.io/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-brand"
            >
              Zera Technologies
            </a>
            . All rights reserved.
          </p>
          <p>
            Designed and developed by{" "}
            <a
              href="https://zeratech.io/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-brand"
            >
              Zera Technologies
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
