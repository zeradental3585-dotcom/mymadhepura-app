"use client";

import { useState } from "react";
import Link from "next/link";
import { looksLocal, looksIndianPhone, looksSpammy } from "@/lib/geo";
import {
  CATEGORY_NAMES,
  CATEGORY_SERVICES,
  generateDraft,
  parseMapsText,
} from "@/lib/quickAdd";

const MIN_NOTES = 40;

const input =
  "w-full rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm outline-none focus:border-brand";
const label = "mb-1 block text-xs font-semibold text-foreground/60";

// Downscale + re-encode so a phone photo becomes a ~150-300 KB JPEG.
function compressImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Could not read the image."));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("That file is not a valid image."));
      img.onload = () => {
        const max = 1200;
        const scale = Math.min(1, max / Math.max(img.width, img.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        canvas.getContext("2d")!.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", 0.8));
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}

export default function QuickAddForm() {
  const [paste, setPaste] = useState("");
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Others");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [hours, setHours] = useState("");
  const [weeklyOff, setWeeklyOff] = useState("");
  const [services, setServices] = useState<string[]>([]);
  const [notes, setNotes] = useState("");
  const [shortText, setShortText] = useState("");
  const [longText, setLongText] = useState("");
  const [seoTitle, setSeoTitle] = useState("");
  const [image, setImage] = useState("");
  const [busy, setBusy] = useState(false);
  const [hint, setHint] = useState("");
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  function applyParsed(text: string) {
    const p = parseMapsText(text);
    if (p.name) setName(p.name);
    if (p.address) setAddress(p.address);
    if (p.phone) {
      setPhone(p.phone);
      setWhatsapp((w) => w || p.phone);
    }
    if (p.latitude) setLatitude(p.latitude);
    if (p.longitude) setLongitude(p.longitude);
    if (!text.trim()) {
      setHint("");
    } else if (!p.address || !p.phone) {
      setHint(
        "A Maps link only gives the name and map position. Open the place in Google Maps, copy the address and phone number text from the panel, and paste it here too. Or type them in below."
      );
    } else {
      setHint("");
    }
    return p;
  }

  async function handlePaste(value: string) {
    setPaste(value);
    applyParsed(value);

    // Short links (maps.app.goo.gl/...) hide the place name and position;
    // ask the server to expand them to the full link and re-read that.
    const short = value.match(/https?:\/\/(?:maps\.app\.goo\.gl|goo\.gl\/maps)\/\S+/i);
    if (!short) return;
    setHint("Reading the Maps link...");
    try {
      const res = await fetch("/api/admin/resolve-map", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: short[0] }),
      });
      const json = await res.json().catch(() => null);
      if (res.ok && json?.ok && json.url) {
        applyParsed(value + "\n" + json.url);
      } else {
        applyParsed(value);
      }
    } catch {
      applyParsed(value);
    }
  }

  function toggleService(s: string) {
    setServices((cur) => (cur.includes(s) ? cur.filter((x) => x !== s) : [...cur, s]));
  }

  function changeCategory(c: string) {
    setCategory(c);
    setServices([]);
  }

  function generate() {
    const d = generateDraft({ name, category, address, phone, hours, weeklyOff, services, notes });
    setShortText(d.short);
    setLongText(d.long);
    setSeoTitle(d.seoTitle);
  }

  async function onPhoto(file?: File) {
    if (!file) return;
    try {
      setImage(await compressImage(file));
    } catch (e) {
      setMsg({ type: "err", text: e instanceof Error ? e.message : "Image error." });
    }
  }

  function reset() {
    setPaste(""); setName(""); setCategory("Others"); setAddress(""); setPhone("");
    setWhatsapp(""); setLatitude(""); setLongitude(""); setHours(""); setWeeklyOff("");
    setServices([]); setNotes(""); setShortText(""); setLongText(""); setSeoTitle("");
    setImage("");
  }

  async function submit() {
    setMsg(null);
    if (!name.trim() || !address.trim() || !phone.trim()) {
      return setMsg({ type: "err", text: "Name, address and phone are required." });
    }
    if (!looksLocal(address, name)) {
      return setMsg({ type: "err", text: "Address must be in Madhepura district (include the area or a 852xxx PIN)." });
    }
    if (!looksIndianPhone(phone)) {
      return setMsg({ type: "err", text: "Enter a valid 10-digit Indian mobile number." });
    }
    if (notes.trim().length < MIN_NOTES) {
      return setMsg({ type: "err", text: "Add 2-3 real details about the business (at least " + MIN_NOTES + " characters) so the listing is not thin content." });
    }
    if (!longText.trim()) {
      return setMsg({ type: "err", text: "Click Generate text first, then review it." });
    }
    if (looksSpammy(name, shortText, longText)) {
      return setMsg({ type: "err", text: "This looks like spam content. Please check the text." });
    }

    setBusy(true);
    try {
      const res = await fetch("/api/submit-listing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          category,
          description: (shortText.trim() ? shortText.trim() + "\n\n" : "") + longText.trim(),
          address: address.trim(),
          phone: phone.trim(),
          whatsapp: whatsapp.trim(),
          businessHours: hours.trim(),
          weeklyOff: weeklyOff.trim(),
          topProducts: services.join(", "),
          latitude: latitude.trim(),
          longitude: longitude.trim(),
          imageDataUrl: image || undefined,
          formLoadedAt: Date.now() - 10000,
        }),
      });
      const json = await res.json().catch(() => null);
      if (!res.ok || !json?.ok) throw new Error(json?.error || "Could not submit.");
      setMsg({ type: "ok", text: "Submitted for approval: " + name.trim() + ". Review it in the dashboard." });
      reset();
    } catch (e) {
      setMsg({ type: "err", text: e instanceof Error ? e.message : "Something went wrong." });
    } finally {
      setBusy(false);
    }
  }

  const available = CATEGORY_SERVICES[category] || [];

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <span className="rounded-full bg-brand-light px-3 py-1 text-xs font-semibold text-brand-dark">Admin</span>
          <h1 className="mt-3 text-2xl font-bold text-foreground">Quick Add Listing</h1>
          <p className="mt-1 text-sm text-foreground/60">
            Paste details from Google Maps, tick what is true, add real details, then submit for approval.
          </p>
        </div>
        <Link
          href="/admin"
          className="rounded-full border border-black/10 px-4 py-2 text-sm font-semibold text-foreground hover:border-brand hover:text-brand"
        >
          Review queue
        </Link>
      </div>

      {msg && (
        <div className={"mt-6 rounded-xl px-4 py-3 text-sm " + (msg.type === "ok" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600")}>
          {msg.text}
        </div>
      )}

      <section className="mt-6 rounded-2xl border border-black/5 bg-white p-5 shadow-sm">
        <h2 className="text-sm font-bold text-foreground">1. Paste from Google Maps</h2>
        <p className="mt-1 text-xs text-foreground/50">
          Select the place details in Google Maps, copy, and paste here (include the Maps link if you can). Fields below fill in automatically.
        </p>
        <textarea
          value={paste}
          onChange={(e) => handlePaste(e.target.value)}
          rows={4}
          placeholder="Paste name, address, phone and/or the Maps link"
          className={input + " mt-3"}
        />
        {hint && <p className="mt-2 text-xs text-amber-700">{hint}</p>}
      </section>

      <section className="mt-5 grid gap-4 rounded-2xl border border-black/5 bg-white p-5 shadow-sm sm:grid-cols-2">
        <h2 className="text-sm font-bold text-foreground sm:col-span-2">2. Check the basics</h2>
        <div className="sm:col-span-2">
          <label className={label}>Business name</label>
          <input className={input} value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="sm:col-span-2">
          <label className={label}>Address (must include Madhepura area or 852xxx PIN)</label>
          <input className={input} value={address} onChange={(e) => setAddress(e.target.value)} />
        </div>
        <div>
          <label className={label}>Phone (confirmed by calling)</label>
          <input className={input} value={phone} onChange={(e) => setPhone(e.target.value)} />
        </div>
        <div>
          <label className={label}>WhatsApp (optional)</label>
          <input className={input} value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} />
        </div>
        <div>
          <label className={label}>Category</label>
          <select className={input} value={category} onChange={(e) => changeCategory(e.target.value)}>
            {CATEGORY_NAMES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={label}>Latitude</label>
            <input className={input} value={latitude} onChange={(e) => setLatitude(e.target.value)} />
          </div>
          <div>
            <label className={label}>Longitude</label>
            <input className={input} value={longitude} onChange={(e) => setLongitude(e.target.value)} />
          </div>
        </div>
        <div>
          <label className={label}>Opening hours</label>
          <input className={input} value={hours} onChange={(e) => setHours(e.target.value)} placeholder="e.g. 9AM to 9PM" />
        </div>
        <div>
          <label className={label}>Weekly off</label>
          <input className={input} value={weeklyOff} onChange={(e) => setWeeklyOff(e.target.value)} placeholder="e.g. Sunday / Never" />
        </div>
      </section>

      <section className="mt-5 rounded-2xl border border-black/5 bg-white p-5 shadow-sm">
        <h2 className="text-sm font-bold text-foreground">3. Services (tick only what the owner confirmed)</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {available.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => toggleService(s)}
              className={
                "rounded-full border px-3 py-1.5 text-xs font-medium " +
                (services.includes(s)
                  ? "border-brand bg-brand-light text-brand-dark"
                  : "border-black/10 text-foreground/60 hover:border-brand")
              }
            >
              {s}
            </button>
          ))}
        </div>
        <label className={label + " mt-5"}>
          Real details about this business, from a call or visit (min {MIN_NOTES} characters)
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          placeholder="e.g. Run by the family for 15 years. Known for fresh sweets made daily. Parking available in front."
          className={input}
        />
        <p className="mt-1 text-xs text-foreground/40">{notes.trim().length} characters</p>
      </section>

      <section className="mt-5 rounded-2xl border border-black/5 bg-white p-5 shadow-sm">
        <h2 className="text-sm font-bold text-foreground">4. Photo (owner's or your own - not from Google Maps)</h2>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => onPhoto(e.target.files?.[0])}
          className="mt-3 block text-sm"
        />
        {image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={image} alt="Preview" className="mt-3 h-40 rounded-xl object-cover" />
        )}
      </section>

      <section className="mt-5 rounded-2xl border border-black/5 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-foreground">5. Draft text (edit freely)</h2>
          <button
            type="button"
            onClick={generate}
            className="rounded-full bg-brand px-4 py-2 text-xs font-semibold text-white hover:bg-brand-dark"
          >
            Generate text
          </button>
        </div>
        {seoTitle && (
          <p className="mt-3 text-xs text-foreground/50">
            Search title preview: <span className="font-semibold text-foreground/70">{seoTitle}</span>
          </p>
        )}
        <label className={label + " mt-4"}>Short description</label>
        <textarea className={input} rows={2} value={shortText} onChange={(e) => setShortText(e.target.value)} />
        <label className={label + " mt-4"}>Long description</label>
        <textarea className={input} rows={8} value={longText} onChange={(e) => setLongText(e.target.value)} />
      </section>

      <button
        type="button"
        onClick={submit}
        disabled={busy}
        className="mt-6 w-full rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-brand-dark disabled:opacity-60"
      >
        {busy ? "Submitting..." : "Submit for approval"}
      </button>
    </div>
  );
}
