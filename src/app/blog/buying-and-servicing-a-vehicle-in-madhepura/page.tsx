import type { Metadata } from "next";
import Link from "next/link";
import BlogPostLayout from "@/components/BlogPostLayout";
import { getBlogPost } from "@/lib/blogPosts";

const post = getBlogPost("buying-and-servicing-a-vehicle-in-madhepura")!;

export const metadata: Metadata = {
  title: post.title,
  description: post.description,
  openGraph: { title: post.title, description: post.description },
};

export default function Page() {
  return (
    <BlogPostLayout post={post}>
      <p>
        Two-wheelers and cars are part of daily life in Madhepura, and so are the
        garages, parts shops and accessory stores that keep them running. If you
        are buying a new vehicle, getting a repair done, or fitting accessories,
        here is a practical guide to the local options listed on myMadhepura.
      </p>

      <h2>Showrooms</h2>
      <p>
        Two-wheeler buyers can start with the{" "}
        <Link href="/listing/honda-showroom">Honda showroom on the bypass road</Link>{" "}
        and the <Link href="/listing/tvs-showroom">TVS showroom on Bypass Road</Link>.
        Both sit on the main bypass, which also makes them easy to reach from
        outlying villages. Before you buy, compare the on-road price (not just
        the ex-showroom price), ask about the warranty and free service
        schedule, and take a test ride.
      </p>

      <h2>Genuine parts and servicing</h2>
      <p>
        For car owners,{" "}
        <Link href="/listing/maruti-suzuki-genuine-parts">Maruti Suzuki Genuine Parts</Link>{" "}
        near the bus stand is the place to ask for original spares. For bike
        repair and general servicing, local workshops such as{" "}
        <Link href="/listing/janta-garage-bike-repairing-centre">Janta Garage</Link>{" "}
        and <Link href="/listing/salen-motor-garage">Salen Motor Garage</Link> are
        listed with their addresses, so you can drive over and ask for an
        estimate before handing over the vehicle.
      </p>

      <h2>Accessories</h2>
      <p>
        Seat covers, music systems, mats and other fittings are available at{" "}
        <Link href="/listing/car-accessories">Car Accessories</Link> and{" "}
        <Link href="/listing/car-king-accessories">Car King Accessories</Link>.
        For anything electrical, insist on a bill and a short written warranty.
      </p>

      <h2>Tips before you buy or repair</h2>
      <ul>
        <li>Get at least two quotes for any major repair</li>
        <li>Ask for the old parts back after a replacement</li>
        <li>Keep the service booklet and every invoice together</li>
        <li>Check insurance validity and pollution certificate dates</li>
        <li>For used vehicles, verify the registration papers in person before paying</li>
      </ul>

      <p>
        See every local automotive business in the{" "}
        <Link href="/category/automobile">Automobile category</Link>. If you run
        a garage, showroom or parts shop, you can{" "}
        <Link href="/list-your-business">add your business for free</Link>.
      </p>
    </BlogPostLayout>
  );
}
