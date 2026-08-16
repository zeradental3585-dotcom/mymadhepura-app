import type { Metadata } from "next";
import Link from "next/link";
import BlogPostLayout from "@/components/BlogPostLayout";
import { getBlogPost } from "@/lib/blogPosts";

const post = getBlogPost("hospitals-and-healthcare-in-madhepura")!;

export const metadata: Metadata = {
  title: post.title,
  description: post.description,
  openGraph: { title: post.title, description: post.description },
};

export default function Page() {
  return (
    <BlogPostLayout post={post}>
      <p>
        This guide is meant as a starting point for finding healthcare in
        Madhepura — not medical advice. For a genuine emergency, go to the
        nearest hospital or call for help immediately rather than searching
        online first.
      </p>

      <h2>Hospitals and nursing homes</h2>
      <p>
        Madhepura has a mix of government and private hospitals. Listed private
        hospitals and nursing homes include{" "}
        <Link href="/listing/madhepura-christian-hospital">Madhepura Christian Hospital</Link>,{" "}
        <Link href="/listing/jannayak-karpoori-thakur-medical-college-and-hospital-madhepura-bihar">
          Jannayak Karpoori Thakur Medical College and Hospital
        </Link>,{" "}
        <Link href="/listing/anand-hospital">Anand Hospital</Link>,{" "}
        <Link href="/listing/ashirwad-hospital">Ashirwad Hospital</Link>,{" "}
        <Link href="/listing/gangotri-memorial-hospital">Gangotri Memorial Hospital</Link>,{" "}
        <Link href="/listing/psm-hospital">PSM Hospital</Link>,{" "}
        <Link href="/listing/vrindavan-hospital">Vrindavan Hospital</Link>, and{" "}
        <Link href="/listing/sai-hospital-and-kidney-care-centre">
          Sai Hospital and Kidney Care Centre
        </Link>. Bed availability, specialists on staff, and emergency capacity
        vary, so it&apos;s worth calling ahead when it isn&apos;t a critical
        emergency.
      </p>

      <h2>Maternity and child care</h2>
      <p>
        For maternity and newborn care, listings include{" "}
        <Link href="/listing/ashtha-maternity">Ashtha Maternity</Link> and{" "}
        <Link href="/listing/aditya-aarogya-baby-care-center">
          Aditya Aarogya Baby Care Center
        </Link>.
      </p>

      <h2>Dental care</h2>
      <p>
        If you need a dentist, Madhepura has a few dedicated dental clinics,
        including{" "}
        <Link href="/listing/dentist-dr-yamini-singh-and-dr-pranav-pratap-singh">
          Dr. Yamini Singh &amp; Dr. Pranav Pratap Singh
        </Link>,{" "}
        <Link href="/listing/oral-dental-clinic">Oral Dental Clinic</Link>, and{" "}
        <Link href="/listing/dental-hospital-orthodontic-implant-centre">
          Dental Hospital Orthodontic &amp; Implant Centre
        </Link>.
      </p>

      <h2>Diagnostics, labs, and pharmacies</h2>
      <p>
        For lab tests and diagnostics, see <Link href="/listing/dr-anand-lab">Dr. Anand Lab</Link>,{" "}
        <Link href="/listing/madhepura-lab">Madhepura Lab</Link>, and{" "}
        <Link href="/listing/r-m-s-dygnosis">R.M.S. Dygnosis</Link>. Common pharmacies and
        medical halls include{" "}
        <Link href="/listing/janta-medical-hall">Janta Medical Hall</Link>,{" "}
        <Link href="/listing/fiza-drug-store">Fiza Drug Store</Link>, and{" "}
        <Link href="/listing/kiran-pharma">Kiran Pharma</Link>.
      </p>

      <h2>Browse the full list</h2>
      <p>
        See every hospital, clinic, and doctor currently listed under{" "}
        <Link href="/listings?category=Hospitals">Hospitals</Link> and{" "}
        <Link href="/listings?category=Doctors">Doctors</Link>, or{" "}
        <Link href="/listings">search all of myMadhepura</Link>. Run a clinic
        that isn&apos;t listed yet?{" "}
        <Link href="/list-your-business">Add it for free</Link>.
      </p>
    </BlogPostLayout>
  );
}
