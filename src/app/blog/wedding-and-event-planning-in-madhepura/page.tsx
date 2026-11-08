import type { Metadata } from "next";
import Link from "next/link";
import BlogPostLayout from "@/components/BlogPostLayout";
import { getBlogPost } from "@/lib/blogPosts";

const post = getBlogPost("wedding-and-event-planning-in-madhepura")!;

export const metadata: Metadata = {
  title: post.title,
  description: post.description,
  openGraph: { title: post.title, description: post.description },
};

export default function Page() {
  return (
    <BlogPostLayout post={post}>
      <p>
        A wedding, engagement or family function in Madhepura usually means
        coordinating several local vendors at once: a hall, catering, decoration,
        guest accommodation, and the shopping that goes with it. This guide
        walks through how families here typically plan, and points to the local
        businesses listed on myMadhepura for each step.
      </p>

      <h2>Step 1: Choose the venue early</h2>
      <p>
        Marriage halls book up quickly during the wedding season, so the venue
        is the first decision to lock in. Two halls listed on myMadhepura are{" "}
        <Link href="/listing/k-k-darbar-marriage-hall">K K Darbar Marriage Hall</Link>{" "}
        and{" "}
        <Link href="/listing/subhmanglam-marriage-hall">Subhmanglam Marriage Hall</Link>.
        Visit in person before booking: check the hall capacity against your
        guest count, parking space, generator backup, and whether catering and
        decoration are included or have to be arranged separately. The full
        list is under the{" "}
        <Link href="/category/banquets">Banquets category</Link>.
      </p>

      <h2>Step 2: Book guest accommodation</h2>
      <p>
        If relatives are travelling in from other districts, reserve rooms well
        ahead. Madhepura has several hotels within a short ride of the main
        market, including{" "}
        <Link href="/listing/hotel-grand-haveli">Hotel Grand Haveli</Link>,{" "}
        <Link href="/listing/hotel-hemchandra-palace">Hotel Hemchandra Palace</Link>{" "}
        and <Link href="/listing/hotel-atithi">Hotel Atithi</Link>. Ask for a
        group rate if you are booking several rooms, and confirm check-in and
        check-out times against your ceremony schedule. Browse all options in
        the <Link href="/category/hotels">Hotels category</Link>.
      </p>

      <h2>Step 3: Food and sweets</h2>
      <p>
        Catering is the largest part of most budgets. For sweets and snacks for
        the family and for guests, local shops such as{" "}
        <Link href="/listing/bikaner-sweets">Bikaner Sweets</Link>,{" "}
        <Link href="/listing/gokul-sweets">Gokul Sweets</Link> and{" "}
        <Link href="/listing/makhan-bhog-sweets-corner">Makhan Bhog Sweets Corner</Link>{" "}
        are good places to start, and{" "}
        <Link href="/listing/madhepura-cake-palace">Madhepura Cake Palace</Link>{" "}
        handles cakes. Ask for a tasting where possible and agree the menu and
        per-plate rate in writing.
      </p>

      <h2>Step 4: Decoration, flowers and photography</h2>
      <p>
        <Link href="/listing/maa-sharda-flowers-decoration">Maa Sharda Flowers Decoration</Link>{" "}
        covers stage and floral decoration, and{" "}
        <Link href="/listing/kajal-digital-studio">Kajal Digital Studio</Link>{" "}
        offers photography and printing. Share your date, venue and theme with
        vendors as early as you can; the best slots go first.
      </p>

      <h2>Step 5: Clothes, jewellery and beauty</h2>
      <p>
        The main market has most of what a wedding wardrobe needs. Look at{" "}
        <Link href="/category/fashion">Fashion</Link> for garments and
        footwear, and <Link href="/listing/gahna-jwellers">Gahna Jwellers</Link>{" "}
        for jewellery. For bridal and party beauty services, see{" "}
        <Link href="/listing/kamini-beauty-parlour">Kamini Beauty Parlour</Link>{" "}
        and <Link href="/listing/sonali-beauty-parlour">Sonali Beauty Parlour</Link>.
        Book trial appointments at least a few weeks before the event.
      </p>

      <h2>A simple planning checklist</h2>
      <ul>
        <li>Fix the date and book the venue first</li>
        <li>Reserve guest rooms and confirm group rates</li>
        <li>Finalise catering, sweets and the cake</li>
        <li>Confirm decoration and photography slots</li>
        <li>Order invitation cards, clothes and jewellery ahead of time</li>
        <li>Keep written confirmations and advance receipts for every vendor</li>
      </ul>

      <h2>Are you a wedding service provider?</h2>
      <p>
        If you run a hall, catering, decoration or photography business in
        Madhepura, you can <Link href="/list-your-business">list it for free</Link>{" "}
        so families planning an event can find you.
      </p>
    </BlogPostLayout>
  );
}
