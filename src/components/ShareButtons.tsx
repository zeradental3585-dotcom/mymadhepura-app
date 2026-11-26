"use client";

import { useState } from "react";
import { SITE } from "@/lib/site";

// Lightweight share bar: no third-party scripts, so it is cheap on slow phones.
export default function ShareButtons({
  path,
  title,
  label = "Share this",
}: {
  path: string;
  title: string;
  label?: string;
}) {
  const [copied, setCopied] = useState(false);
  const url = SITE.url + path;
  const text = title + " - " + url;

  const links = [
    { name: "WhatsApp", href: "https://wa.me/?text=" + encodeURIComponent(text), cls: "bg-[#25D366] text-white" },
    { name: "Facebook", href: "https://www.facebook.com/sharer/sharer.php?u=" + encodeURIComponent(url), cls: "bg-[#1877F2] text-white" },
    { name: "X", href: "https://twitter.com/intent/tweet?text=" + encodeURIComponent(title) + "&url=" + encodeURIComponent(url), cls: "bg-black text-white" },
    { name: "Telegram", href: "https://t.me/share/url?url=" + encodeURIComponent(url) + "&text=" + encodeURIComponent(title), cls: "bg-[#229ED9] text-white" },
  ];

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt("Copy this link", url);
    }
  }

  async function nativeShare() {
    if (typeof navigator !== "undefined" && "share" in navigator) {
      try {
        await navigator.share({ title: title, url: url });
        return;
      } catch {
        return;
      }
    }
    copy();
  }

  return (
    <div className="mt-8 rounded-2xl border border-black/5 bg-brand-light/60 p-4">
      <p className="text-sm font-semibold text-foreground">{label}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {links.map((l) => (
          <a
            key={l.name}
            href={l.href}
            target="_blank"
            rel="noopener noreferrer"
            className={"rounded-full px-4 py-2 text-sm font-semibold " + l.cls}
          >
            {l.name}
          </a>
        ))}
        <button
          type="button"
          onClick={copy}
          className="rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-semibold text-foreground"
        >
          {copied ? "Link copied" : "Copy link"}
        </button>
        <button
          type="button"
          onClick={nativeShare}
          className="rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-semibold text-foreground sm:hidden"
        >
          More
        </button>
      </div>
    </div>
  );
}
