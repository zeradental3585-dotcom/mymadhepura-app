import type { Metadata } from "next";
import Link from "next/link";
import BlogPostLayout from "@/components/BlogPostLayout";
import { getBlogPost } from "@/lib/blogPosts";

const post = getBlogPost("things-to-do-in-madhepura")!;

export const metadata: Metadata = {
  title: post.title,
  description: post.description,
  openGraph: { title: post.title, description: post.description },
};

export default function Page() {
  return (
    <BlogPostLayout post={post}>
      <p>
        Madhepura is a district headquarters town in the Kosi region of Bihar —
        not a major tourist destination, but a town with a genuine pilgrimage
        site, an active market, and the everyday rhythm of a growing district
        centre. Here&apos;s what&apos;s worth knowing whether you&apos;re
        visiting or you&apos;ve just settled in.
      </p>

      <h2>Singheshwar Sthan</h2>
      <p>
        The best-known landmark in Madhepura district is{" "}
        <Link href="/listing/singeshwar-temple">Singheshwar Temple (Singheshwar Sthan)</Link>,
        a Shiva temple that draws pilgrims from across the region, especially
        during Shravan and Shivratri. It&apos;s the single most significant
        religious site in the district and worth building a visit around if
        you&apos;re passing through.
      </p>

      <h2>Markets and shopping</h2>
      <p>
        The main market area in Madhepura town covers everything from clothing
        and footwear to electronics and general stores.{" "}
        <Link href="/listing/trends-mall">Trends Mall</Link> is one of the more
        organised shopping options in town, and the{" "}
        <Link href="/listings?category=Fashion">Fashion category</Link> on
        myMadhepura lists individual garment, footwear, and accessory shops
        across the district if you&apos;re looking for something specific.
      </p>

      <h2>Public institutions and landmarks</h2>
      <p>
        As the district headquarters, Madhepura is home to the{" "}
        <Link href="/listing/collectorate-madhepura">Collectorate</Link>, the{" "}
        <Link href="/listing/civil-court-madhepura">Civil Court</Link>, and the{" "}
        <Link href="/listing/nagar-parisad-madhepura">Nagar Parishad (municipal council)</Link>{" "}
        offices — useful reference points if you need official paperwork
        handled. Sports facilities are anchored by{" "}
        <Link href="/listing/b-n-mandal-stadium-madhepura">B.N. Mandal Stadium</Link>, and
        intercity travel runs through the{" "}
        <Link href="/listing/new-bus-stand">New Bus Stand</Link>.
      </p>

      <h2>Where to stay</h2>
      <p>
        Madhepura has a reasonable spread of budget and mid-range hotels for an
        overnight stay, including{" "}
        <Link href="/listing/hotel-grand-haveli">Hotel Grand Haveli</Link>,{" "}
        <Link href="/listing/hotel-hemchandra-palace">Hotel Hemchandra Palace</Link>,{" "}
        <Link href="/listing/hotel-atithi">Hotel Atithi</Link>, and{" "}
        <Link href="/listing/hotel-s-k-palace">Hotel S. K. Palace</Link>, among
        others. See the full spread under the{" "}
        <Link href="/listings?category=Hotels">Hotels category</Link>.
      </p>

      <h2>Getting oriented</h2>
      <p>
        Madhepura is compact enough that most essentials — banks, hospitals,
        schools, and the market — are within a short ride of the town centre.
        The <Link href="/listings">full myMadhepura directory</Link> is
        organised by category, so whatever you&apos;re looking for, searching by
        category is usually faster than browsing everything.
      </p>
    </BlogPostLayout>
  );
}
