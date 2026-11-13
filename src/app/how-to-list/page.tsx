import type { Metadata } from "next";
import VideoGuide from "@/components/VideoGuide";

export const metadata: Metadata = {
  title: "अपना बिज़नेस मुफ़्त में कैसे जोड़ें – वीडियो गाइड",
  description:
    "myMadhepura पर अपना बिज़नेस मुफ़्त में जोड़ने का आसान हिंदी वीडियो गाइड। सिर्फ़ 2 मिनट में अपनी दुकान या सेवा लिस्ट करें।",
  alternates: { canonical: "/how-to-list" },
};

export default function HowToListPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <div className="text-center">
        <h1 className="text-2xl font-extrabold text-foreground sm:text-3xl">
          अपना बिज़नेस मुफ़्त में कैसे जोड़ें?
        </h1>
        <p className="mt-3 text-lg text-foreground/70">
          नीचे वाला ‘वीडियो’ चलाएँ और स्टेप बाय स्टेप देखें। आवाज़ चालू रखें।
        </p>
      </div>
      <div className="mt-6">
        <VideoGuide />
      </div>
      <p className="mt-6 text-center text-sm text-foreground/50">
        How to list your business on myMadhepura – Hindi video guide.
      </p>
    </div>
  );
}
