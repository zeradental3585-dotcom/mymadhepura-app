"use client";

import { useRef, useState } from "react";
import Link from "next/link";

// Lightweight "video": Hindi voiceover (~1 MB mp3, loaded only on Play) synced
// to big Hindi step cards. Far lighter than an mp4 for low-end phones.
const SCENES = [
  { t: 0, icon: "🙏", title: "नमस्ते!", text: "अपना बिज़नेस माय मधेपुरा पर बिल्कुल मुफ़्त जोड़ें। सिर्फ़ 2 मिनट लगेंगे।" },
  { t: 9.4, icon: "📱", title: "1. वेबसाइट खोलें", text: "फ़ोन के ब्राउज़र में mymadhepura.com खोलें, फिर “List Your Business” बटन दबाएँ।" },
  { t: 18.0, icon: "🏪", title: "2. नाम और कैटेगरी", text: "बिज़नेस का नाम लिखें और सही कैटेगरी चुनें: रेस्टोरेंट, डॉक्टर, स्कूल, दुकान आदि।" },
  { t: 26.3, icon: "📞", title: "3. नंबर और पता", text: "मोबाइल नंबर और पूरा पता लिखें। पता मधेपुरा ज़िले का ही होना चाहिए।" },
  { t: 34.5, icon: "📷", title: "4. जानकारी और फ़ोटो", text: "2-3 लाइन में लिखें कि आप क्या बेचते हैं या कौन सी सेवा देते हैं। दुकान की एक साफ़ फ़ोटो जोड़ें।" },
  { t: 44.1, icon: "✅", title: "5. सबमिट करें", text: "सब जानकारी जाँचें और “Submit for Review” बटन दबाएँ।" },
  { t: 48.6, icon: "🎉", title: "हो गया!", text: "हमारी टीम जाँच करेगी, फिर आपका बिज़नेस वेबसाइट पर दिखेगा। दिक्कत हो तो WhatsApp करें।" },
];
const DURATION = 60.5;

function fmt(s: number) {
  const m = Math.floor(s / 60);
  const r = Math.floor(s % 60);
  return m + ":" + (r < 10 ? "0" : "") + r;
}

export default function VideoGuide() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);

  let idx = 0;
  SCENES.forEach((s, i) => {
    if (time >= s.t) idx = i;
  });
  const scene = SCENES[idx];

  function toggle() {
    const a = audioRef.current;
    if (!a) return;
    if (a.paused) {
      if (a.ended || a.currentTime >= DURATION - 0.5) a.currentTime = 0;
      a.play();
    } else {
      a.pause();
    }
  }

  function seek(t: number) {
    const a = audioRef.current;
    if (!a) return;
    a.currentTime = t;
    setTime(t);
    if (a.paused) a.play();
  }

  return (
    <div className="mx-auto w-full max-w-md overflow-hidden rounded-3xl border border-black/10 bg-white shadow-lg">
      <audio
        ref={audioRef}
        src="/how-to-list/audio/"
        preload="none"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => setPlaying(false)}
        onTimeUpdate={(e) => setTime(e.currentTarget.currentTime)}
      />

      <div className="flex min-h-[22rem] flex-col items-center justify-center bg-brand-light px-6 py-8 text-center">
        <div className="text-7xl" aria-hidden="true">{scene.icon}</div>
        <h2 className="mt-4 text-2xl font-extrabold text-brand-dark">{scene.title}</h2>
        <p className="mt-3 text-xl font-medium leading-relaxed text-foreground">{scene.text}</p>
      </div>

      <div className="px-4 pb-5 pt-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={toggle}
            aria-label={playing ? "रोकें" : "वीडियो चलाएँ"}
            className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-brand text-3xl text-white shadow active:scale-95"
          >
            {playing ? "❚❚" : "▶"}
          </button>
          <div className="flex-1">
            <div className="h-2 w-full overflow-hidden rounded-full bg-black/10">
              <div className="h-full bg-brand" style={{ width: Math.min(100, (time / DURATION) * 100) + "%" }} />
            </div>
            <p className="mt-1 text-xs text-foreground/60">
              {fmt(time)} / {fmt(DURATION)} · आवाज़ चालू रखें 🔊
            </p>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap justify-center gap-2">
          {SCENES.map((s, i) => (
            <button
              key={s.t}
              type="button"
              onClick={() => seek(s.t)}
              aria-label={"स्टेप " + (i + 1)}
              className={"h-10 w-10 rounded-full text-sm font-bold " + (i === idx ? "bg-brand text-white" : "bg-black/5 text-foreground/70")}
            >
              {i === 0 ? "▶" : i === SCENES.length - 1 ? "✓" : i}
            </button>
          ))}
        </div>

        <div className="mt-5 grid gap-3">
          <Link
            href="/list-your-business"
            className="block rounded-xl bg-brand px-4 py-4 text-center text-lg font-bold text-white"
          >
            अभी अपना बिज़नेस जोड़ें
          </Link>
          <a
            href="https://wa.me/919835102324?text=%E0%A4%A8%E0%A4%AE%E0%A4%B8%E0%A5%8D%E0%A4%A4%E0%A5%87%2C%20%E0%A4%AE%E0%A5%81%E0%A4%9D%E0%A5%87%20myMadhepura%20%E0%A4%AA%E0%A4%B0%20%E0%A4%AC%E0%A4%BF%E0%A4%9C%E0%A4%A8%E0%A5%87%E0%A4%B8%20%E0%A4%9C%E0%A5%8B%E0%A4%A1%E0%A4%BC%E0%A4%A8%E0%A5%87%20%E0%A4%AE%E0%A5%87%E0%A4%82%20%E0%A4%AE%E0%A4%A6%E0%A4%A6%20%E0%A4%9A%E0%A4%BE%E0%A4%B9%E0%A4%BF%E0%A4%8F"
            target="_blank"
            rel="noopener noreferrer"
            className="block rounded-xl border border-black/10 px-4 py-3 text-center font-semibold text-foreground"
          >
            💬 मदद चाहिए? WhatsApp करें
          </a>
        </div>
      </div>
    </div>
  );
}
