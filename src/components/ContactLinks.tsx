"use client";

import { useEffect, useRef } from "react";

// Zera Technologies portfolio standard: shared inbox + WhatsApp number, with
// the site and the page the visitor came from prefilled so we know which
// property the message is about.
const SITE_LABEL = "myMadhepura (mymadhepura.com)";
const EMAIL = "hello@zeratech.io";
const WHATSAPP = "919835102324";

export default function ContactLinks() {
  const emailRef = useRef<HTMLAnchorElement>(null);
  const waRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const from = document.referrer || "Direct visit / typed URL";
    const subject = encodeURIComponent(`Message from ${SITE_LABEL}`);
    const body = encodeURIComponent(`Site: ${SITE_LABEL}\nCame from page: ${from}\n\nHi, `);
    const text = encodeURIComponent(`Hi, I'm contacting about ${SITE_LABEL}. I came from: ${from}\n\n`);
    if (emailRef.current) emailRef.current.href = `mailto:${EMAIL}?subject=${subject}&body=${body}`;
    if (waRef.current) waRef.current.href = `https://wa.me/${WHATSAPP}?text=${text}`;
  }, []);

  return (
    <div className="mt-8 grid gap-4 sm:grid-cols-2">
      <div className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
        <p className="text-sm text-foreground/50">Email</p>
        <a
          ref={emailRef}
          href={`mailto:${EMAIL}`}
          className="text-lg font-semibold text-brand hover:underline"
        >
          {EMAIL}
        </a>
      </div>
      <div className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
        <p className="text-sm text-foreground/50">WhatsApp</p>
        <a
          ref={waRef}
          href={`https://wa.me/${WHATSAPP}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-lg font-semibold text-brand hover:underline"
        >
          +91 98351 02324
        </a>
      </div>
    </div>
  );
}
