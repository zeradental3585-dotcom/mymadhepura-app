"use client";

import { useRef, useState } from "react";

// Anti-spam: this form has no login, so it's an open target for bots.
// Two lightweight, invisible-to-humans checks are layered on top of the
// existing manual-review step:
//  1. Honeypot field ("company") — hidden from real users via CSS, but
//     most bots fill in every input they find. Any value here means bot.
//  2. Minimum fill time — a hidden timestamp set on mount lets the API
//     reject submissions that arrive suspiciously fast (a human can't
//     read + fill this form in under ~2.5s).

const MAX_DIMENSION = 1600;
const JPEG_QUALITY = 0.82;

function resizeImageToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Could not read the file."));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("Could not read the image."));
      img.onload = () => {
        let { width, height } = img;
        if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
          if (width > height) {
            height = Math.round((height * MAX_DIMENSION) / width);
            width = MAX_DIMENSION;
          } else {
            width = Math.round((width * MAX_DIMENSION) / height);
            height = MAX_DIMENSION;
          }
        }
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Canvas not supported."));
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", JPEG_QUALITY));
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}

const FIELD_CLASS =
  "w-full rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm text-foreground placeholder:text-foreground/40 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20";
const LABEL_CLASS = "mb-1.5 block text-sm font-semibold text-foreground";

export default function ListingForm({ categories }: { categories: string[] }) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const [customCategory, setCustomCategory] = useState(false);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [formLoadedAt] = useState(() => Date.now());

  async function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageError(null);

    if (!file.type.startsWith("image/")) {
      setImageError("Please choose an image file.");
      return;
    }
    if (file.size > 15 * 1024 * 1024) {
      setImageError("That image is too large — please choose one under 15MB.");
      return;
    }

    try {
      const dataUrl = await resizeImageToDataUrl(file);
      setImageDataUrl(dataUrl);
      setImagePreview(dataUrl);
    } catch {
      setImageError("Could not process that image. Try a different file.");
    }
  }

  function removeImage() {
    setImageDataUrl(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMessage("");

    const form = e.currentTarget;
    const data = new FormData(form);

    const category =
      (data.get("category") as string) === "__custom__"
        ? (data.get("customCategory") as string) || ""
        : (data.get("category") as string) || "";

    const payload = {
      name: (data.get("name") as string) || "",
      category,
      description: (data.get("description") as string) || "",
      address: (data.get("address") as string) || "",
      phone: (data.get("phone") as string) || "",
      whatsapp: (data.get("whatsapp") as string) || "",
      businessHours: (data.get("businessHours") as string) || "",
      weeklyOff: (data.get("weeklyOff") as string) || "",
      topProducts: (data.get("topProducts") as string) || "",
      facebook: (data.get("facebook") as string) || "",
      instagram: (data.get("instagram") as string) || "",
      website: (data.get("website") as string) || "",
      imageDataUrl: imageDataUrl || undefined,
      company: (data.get("company") as string) || "",
      formLoadedAt,
    };

    try {
      const res = await fetch("/api/submit-listing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) {
        throw new Error(json?.error || "Something went wrong. Please try again.");
      }
      setStatus("success");
      form.reset();
      removeImage();
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-2xl border border-black/5 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-2xl">
          ✅
        </div>
        <h2 className="mt-4 text-xl font-bold text-foreground">Submission received!</h2>
        <p className="mt-2 text-foreground/70">
          Thanks — we&apos;ll review your listing and it&apos;ll go live within a
          few days. Questions in the meantime? Email{" "}
          <a href="mailto:Satish@mymadhepura.com" className="text-brand hover:underline">
            Satish@mymadhepura.com
          </a>
          .
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-6 rounded-full border border-black/10 px-5 py-2 text-sm font-semibold text-foreground hover:border-brand hover:text-brand"
        >
          Submit another listing
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-black/5 bg-white p-6 text-left shadow-sm sm:p-8"
    >
      {/* Honeypot: invisible to real visitors, but most spam bots fill in
          every field they find. Moved off-screen rather than display:none,
          since some bots specifically skip display:none fields. */}
      <div
        aria-hidden="true"
        style={{ position: "absolute", left: "-9999px", top: "-9999px", opacity: 0 }}
      >
        <label htmlFor="company">Company</label>
        <input id="company" name="company" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className={LABEL_CLASS} htmlFor="name">
            Business name *
          </label>
          <input id="name" name="name" required className={FIELD_CLASS} placeholder="e.g. Caffè Mocha" />
        </div>

        <div>
          <label className={LABEL_CLASS} htmlFor="category">
            Category *
          </label>
          <select
            id="category"
            name="category"
            required
            className={FIELD_CLASS}
            defaultValue=""
            onChange={(e) => setCustomCategory(e.target.value === "__custom__")}
          >
            <option value="" disabled>
              Select a category
            </option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
            <option value="__custom__">Other (type below)</option>
          </select>
          {customCategory && (
            <input
              name="customCategory"
              className={`${FIELD_CLASS} mt-2`}
              placeholder="Enter a category"
              required
            />
          )}
        </div>

        <div>
          <label className={LABEL_CLASS} htmlFor="phone">
            Phone number *
          </label>
          <input id="phone" name="phone" required className={FIELD_CLASS} placeholder="10-digit number" />
        </div>

        <div>
          <label className={LABEL_CLASS} htmlFor="whatsapp">
            WhatsApp number
          </label>
          <input id="whatsapp" name="whatsapp" className={FIELD_CLASS} placeholder="10-digit number" />
        </div>

        <div>
          <label className={LABEL_CLASS} htmlFor="businessHours">
            Business hours
          </label>
          <input id="businessHours" name="businessHours" className={FIELD_CLASS} placeholder="9 AM - 9 PM" />
        </div>

        <div className="sm:col-span-2">
          <label className={LABEL_CLASS} htmlFor="address">
            Address *
          </label>
          <input id="address" name="address" required className={FIELD_CLASS} placeholder="Full address in Madhepura" />
        </div>

        <div className="sm:col-span-2">
          <label className={LABEL_CLASS} htmlFor="description">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={4}
            className={FIELD_CLASS}
            placeholder="Tell customers what makes your business worth visiting"
          />
        </div>

        <div className="sm:col-span-2">
          <label className={LABEL_CLASS} htmlFor="topProducts">
            Top products / services
          </label>
          <input id="topProducts" name="topProducts" className={FIELD_CLASS} placeholder="e.g. Cappuccino, Cold brew, Sandwiches" />
        </div>

        <div>
          <label className={LABEL_CLASS} htmlFor="weeklyOff">
            Weekly off day
          </label>
          <input id="weeklyOff" name="weeklyOff" className={FIELD_CLASS} placeholder="e.g. Sunday, or Never" />
        </div>

        <div>
          <label className={LABEL_CLASS} htmlFor="website">
            Website
          </label>
          <input id="website" name="website" type="url" className={FIELD_CLASS} placeholder="https://" />
        </div>

        <div>
          <label className={LABEL_CLASS} htmlFor="facebook">
            Facebook page
          </label>
          <input id="facebook" name="facebook" type="url" className={FIELD_CLASS} placeholder="https://facebook.com/..." />
        </div>

        <div>
          <label className={LABEL_CLASS} htmlFor="instagram">
            Instagram page
          </label>
          <input id="instagram" name="instagram" type="url" className={FIELD_CLASS} placeholder="https://instagram.com/..." />
        </div>

        <div className="sm:col-span-2">
          <label className={LABEL_CLASS} htmlFor="photo">
            Photo
          </label>
          {imagePreview ? (
            <div className="flex items-center gap-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imagePreview}
                alt="Preview"
                className="h-24 w-24 rounded-xl border border-black/10 object-cover"
              />
              <button
                type="button"
                onClick={removeImage}
                className="rounded-full border border-black/10 px-4 py-2 text-sm font-semibold text-foreground hover:border-red-400 hover:text-red-500"
              >
                Remove photo
              </button>
            </div>
          ) : (
            <input
              ref={fileInputRef}
              id="photo"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="block w-full text-sm text-foreground/70 file:mr-4 file:rounded-full file:border-0 file:bg-brand-light file:px-4 file:py-2 file:text-sm file:font-semibold file:text-brand-dark hover:file:bg-brand-light/70"
            />
          )}
          {imageError && <p className="mt-1.5 text-xs text-red-500">{imageError}</p>}
          <p className="mt-1.5 text-xs text-foreground/50">Optional, but listings with a photo get more attention. No account or login needed.</p>
        </div>
      </div>

      {status === "error" && (
        <div className="mt-6 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
          {errorMessage}
        </div>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="mt-7 w-full rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      >
        {status === "submitting" ? "Submitting…" : "Submit for Review"}
      </button>
      <p className="mt-3 text-xs text-foreground/50">
        Every submission is reviewed before it goes live, usually within a few days.
      </p>
    </form>
  );
}
