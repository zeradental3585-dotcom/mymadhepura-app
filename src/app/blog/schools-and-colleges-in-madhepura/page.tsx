import type { Metadata } from "next";
import Link from "next/link";
import BlogPostLayout from "@/components/BlogPostLayout";
import { getBlogPost } from "@/lib/blogPosts";

const post = getBlogPost("schools-and-colleges-in-madhepura")!;

export const metadata: Metadata = {
  title: post.title,
  description: post.description,
  openGraph: { title: post.title, description: post.description },
};

export default function Page() {
  return (
    <BlogPostLayout post={post}>
      <p>
        Madhepura is home to a full range of education options — from play
        schools through to B.N. Mandal University, one of Bihar&apos;s state
        universities headquartered in the district. Here&apos;s a practical
        breakdown by stage, with links to listings you can check for admissions
        details, fees, and contact information.
      </p>

      <h2>Play schools and early education</h2>
      <p>
        For pre-primary and early childhood education, options in Madhepura
        include <Link href="/listing/nanhe-kadam-play-school">Nanhe Kadam Play School</Link>.
        If you&apos;re starting the search for your youngest child, it&apos;s
        worth visiting a few in person — class sizes and teaching style vary a
        lot at this stage.
      </p>

      <h2>Primary and secondary schools</h2>
      <p>
        Madhepura has several private schools covering primary through secondary
        levels, including <Link href="/listing/darjeeling-public-school">Darjeeling Public School</Link>,{" "}
        <Link href="/listing/radiant-public-school">Radiant Public School</Link>,{" "}
        <Link href="/listing/madhepura-public-school">Madhepura Public School</Link>,{" "}
        <Link href="/listing/pragati-public-school">Pragati Public School</Link>,{" "}
        <Link href="/listing/kiran-public-school">Kiran Public School</Link>,{" "}
        <Link href="/listing/shalom-mission-school">Shalom Mission School</Link>, and{" "}
        <Link href="/listing/new-era-smart-school">New Era Smart School</Link>. Boards,
        fee structures, and transport options differ from school to school, so
        it&apos;s worth calling ahead using the contact details on each listing.
      </p>

      <h2>Coaching centres and competitive exam prep</h2>
      <p>
        Madhepura has a genuinely active coaching-centre scene, particularly for
        maths, physics, and biology at the +2 and competitive-exam level.
        Listings include <Link href="/listing/one-tract-coaching">One Tract Coaching</Link>,{" "}
        <Link href="/listing/a-to-z-coaching-madhepura">A to Z Coaching Madhepura</Link>,{" "}
        <Link href="/listing/ub-biology-classes">UB Biology Classes</Link>,{" "}
        <Link href="/listing/biology-study-point">Biology Study Point</Link>,{" "}
        <Link href="/listing/a-one-biology-classes">A-One Biology Classes</Link>,{" "}
        <Link href="/listing/arya-bhatt-math-classes">Arya Bhatt Math Classes</Link>,{" "}
        <Link href="/listing/jee-mathematics-classes">JEE Mathematics Classes</Link>, and{" "}
        <Link href="/listing/oxygen-bio-study-centre">Oxygen Bio Study Centre</Link>,
        among others under the{" "}
        <Link href="/listings?category=Education">Education category</Link>.
      </p>

      <h2>Colleges and higher education</h2>
      <p>
        For higher education, Madhepura is the seat of{" "}
        <Link href="/listing/b-n-m-u-university">B.N. Mandal University (BNMU)</Link>,
        with affiliated colleges in the district including{" "}
        <Link href="/listing/t-p-college-madhepura">T.P. College</Link>,{" "}
        <Link href="/listing/s-a-k-n-d-college-madhepura">S.A.K.N.D. College</Link>,{" "}
        <Link href="/listing/parwati-science-college-madhepura">Parwati Science College</Link>,{" "}
        <Link href="/listing/ved-vyas-college-madhepura">Ved Vyas College</Link>, and{" "}
        <Link href="/listing/b-p-mandal-college-of-engineering-madhepura">B.P. Mandal College of Engineering</Link>.
        Admission cycles, entrance exams, and eligibility criteria are best
        confirmed directly with each institution.
      </p>

      <h2>Browse the full list</h2>
      <p>
        See every school, coaching centre, and college currently listed under{" "}
        <Link href="/listings?category=Education">Education</Link> or{" "}
        <Link href="/listings">search all of myMadhepura</Link>. Run an
        institution that isn&apos;t listed yet?{" "}
        <Link href="/list-your-business">Add it for free</Link>.
      </p>
    </BlogPostLayout>
  );
}
