import type { Metadata } from "next";
import Link from "next/link";
import BlogPostLayout from "@/components/BlogPostLayout";
import { getBlogPost } from "@/lib/blogPosts";

const post = getBlogPost("coaching-and-exam-preparation-in-madhepura")!;

export const metadata: Metadata = {
  title: post.title,
  description: post.description,
  openGraph: { title: post.title, description: post.description },
};

export default function Page() {
  return (
    <BlogPostLayout post={post}>
      <p>
        Students in Madhepura have a growing set of local coaching centres for
        board exams, medical and engineering entrance tests, and teaching and
        competitive exams. This guide groups the centres listed on myMadhepura by
        subject so you can shortlist faster, along with questions worth asking
        before you pay any fee.
      </p>

      <h2>Biology and medical entrance</h2>
      <p>
        Several centres focus on biology and NEET-style preparation, including{" "}
        <Link href="/listing/ub-biology-classes">UB Biology Classes</Link>,{" "}
        <Link href="/listing/a-one-biology-classes">A-One Biology Classes</Link>,{" "}
        <Link href="/listing/biology-study-point">Biology Study Point</Link> and{" "}
        <Link href="/listing/oxygen-bio-study-centre">Oxygen Bio Study Centre</Link>.
      </p>

      <h2>Physics and mathematics</h2>
      <p>
        For physics, options include{" "}
        <Link href="/listing/freedom-classes-physics">Freedom Classes (Physics)</Link>,{" "}
        <Link href="/listing/physics-by-j-p-sir">Physics by J.P. Sir</Link> and{" "}
        <Link href="/listing/a-basic-concept-of-physics">A Basic Concept of Physics</Link>.
        For maths and JEE foundations, see{" "}
        <Link href="/listing/jee-mathematics-classes">JEE Mathematics Classes</Link>{" "}
        and <Link href="/listing/arya-bhatt-math-classes">Arya Bhatt Math Classes</Link>.
      </p>

      <h2>Multi-subject and competitive exams</h2>
      <p>
        <Link href="/listing/anand-competition-classes">Anand Competition Classes</Link>,{" "}
        <Link href="/listing/a-to-z-coaching-madhepura">A to Z Coaching</Link>,{" "}
        <Link href="/listing/one-tract-coaching">One Tract Coaching</Link> and{" "}
        <Link href="/listing/the-result-factory">The Result Factory</Link> cover
        broader exam preparation. For teaching-eligibility preparation there is{" "}
        <Link href="/listing/nandan-ctet-center">Nandan CTET Center</Link>, and{" "}
        <Link href="/listing/utsav-infotech-computer-class">Utsav Infotech</Link>{" "}
        offers computer classes.
      </p>

      <h2>Questions to ask before enrolling</h2>
      <ul>
        <li>What is the batch size, and how often are doubts cleared individually?</li>
        <li>Is there a free demo class before you pay?</li>
        <li>How often are tests held, and are results shared with parents?</li>
        <li>What is the full fee, including study material, and is it refundable?</li>
        <li>Does the schedule fit around school timings?</li>
      </ul>

      <h2>Books and stationery</h2>
      <p>
        Study material and stationery are available at shops such as{" "}
        <Link href="/listing/nand-book-store-and-stationary">Nand Book Store and Stationary</Link>{" "}
        and <Link href="/listing/jyoti-book-store">Jyoti Book Store</Link>.
      </p>

      <p>
        Looking for schools and colleges instead? Read our{" "}
        <Link href="/blog/schools-and-colleges-in-madhepura">schools and colleges guide</Link>, or
        browse the <Link href="/category/education">Education category</Link>.
        Run a coaching centre? <Link href="/list-your-business">List it for free</Link>.
      </p>
    </BlogPostLayout>
  );
}
