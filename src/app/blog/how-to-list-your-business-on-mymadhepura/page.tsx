import type { Metadata } from "next";
import Link from "next/link";
import BlogPostLayout from "@/components/BlogPostLayout";
import { getBlogPost } from "@/lib/blogPosts";

const post = getBlogPost("how-to-list-your-business-on-mymadhepura")!;

export const metadata: Metadata = {
  title: post.title,
  description: post.description,
  openGraph: { title: post.title, description: post.description },
};

export default function Page() {
  return (
    <BlogPostLayout post={post}>
      <p>
        myMadhepura.com is a free local business directory for Madhepura, Bihar —
        built to make it easier for people to find hotels, restaurants, doctors,
        schools, shops, and services nearby. If you run a business in or around
        Madhepura and you&apos;re not listed yet, here&apos;s what that involves.
      </p>

      <h2>What listing includes</h2>
      <p>
        Each listing gets its own page on the site with your business name,
        category, address, phone number, WhatsApp contact, business hours, a
        description, and a photo if you provide one. Listings also show up in
        search and category browsing, so people looking specifically for what
        you offer — say, &quot;dentist in Madhepura&quot; or &quot;hotels near
        the bus stand&quot; — can find you directly.
      </p>

      <h2>What you&apos;ll need</h2>
      <ul>
        <li>Business name and category (restaurant, hotel, doctor, school, shop, etc.)</li>
        <li>Address and, if you have them, GPS coordinates or a Google Maps link</li>
        <li>A phone number and, ideally, a WhatsApp number people can message</li>
        <li>Business hours and your weekly off day, if any</li>
        <li>A short description of what you offer</li>
        <li>A photo of your storefront, workspace, or products (optional but recommended)</li>
      </ul>

      <h2>How approval works</h2>
      <p>
        Submissions are reviewed before they go live — myMadhepura keeps the
        directory focused on genuine, operating local businesses rather than
        open, unmoderated listings. That review step is also why photos and
        accurate contact details help: it makes your listing easier to approve
        and easier for customers to trust once it&apos;s live.
      </p>

      <h2>Why it&apos;s worth doing</h2>
      <p>
        Listing is free, and a business page on myMadhepura gives you a
        shareable link you can post to your own WhatsApp status, Facebook page,
        or Instagram bio — the listing page is built to preview cleanly when
        shared on WhatsApp, so it looks good wherever you send it. It also means
        you show up when someone searches the directory by category or
        location, rather than relying only on word of mouth.
      </p>

      <h2>Get started</h2>
      <p>
        Ready to add your business? Head to{" "}
        <Link href="/list-your-business">List Your Business</Link> and fill out
        the form — it takes a few minutes. If you&apos;re not sure which
        category fits, browse the{" "}
        <Link href="/listings">existing directory</Link> for examples similar to
        your business.
      </p>
    </BlogPostLayout>
  );
}
