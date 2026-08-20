import { NextResponse } from "next/server";
import { put } from "@vercel/blob";

export const runtime = "nodejs";

// Keep image uploads reasonable — the client already resizes/compresses
// before sending, this is just a hard backstop against abuse.
const MAX_IMAGE_BYTES = 6 * 1024 * 1024;

interface SubmitBody {
  name?: string;
  category?: string;
  description?: string;
  address?: string;
  phone?: string;
  whatsapp?: string;
  businessHours?: string;
  weeklyOff?: string;
  topProducts?: string;
  facebook?: string;
  instagram?: string;
  website?: string;
  imageDataUrl?: string; // data:image/jpeg;base64,....
  company?: string; // honeypot — must stay empty
  formLoadedAt?: number; // client timestamp when the form mounted
}

function isValidDataUrl(value: string): boolean {
  return /^data:image\/(png|jpe?g|webp);base64,/.test(value);
}

// Below this, a submission is treated as a bot rather than a fast human.
const MIN_FILL_TIME_MS = 2500;

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as SubmitBody;

    // Anti-spam checks, before any real work happens. Both fail silently
    // with a fake success response — telling a bot "rejected" just teaches
    // it to adapt, whereas a fake 200 gives it nothing to react to.
    if ((body.company || "").trim() !== "") {
      console.warn("submit-listing: honeypot triggered, dropping silently");
      return NextResponse.json({ ok: true });
    }
    if (typeof body.formLoadedAt === "number" && Date.now() - body.formLoadedAt < MIN_FILL_TIME_MS) {
      console.warn("submit-listing: submitted too fast, dropping silently");
      return NextResponse.json({ ok: true });
    }

    const name = (body.name || "").trim();
    const category = (body.category || "").trim();
    const address = (body.address || "").trim();
    const phone = (body.phone || "").trim();

    if (!name || !category || !address || !phone) {
      return NextResponse.json(
        { ok: false, error: "Business name, category, address, and phone are required." },
        { status: 400 }
      );
    }

    let imageUrl = "";

    if (body.imageDataUrl) {
      if (!isValidDataUrl(body.imageDataUrl)) {
        return NextResponse.json(
          { ok: false, error: "Invalid image format." },
          { status: 400 }
        );
      }

      const base64 = body.imageDataUrl.split(",")[1] || "";
      const buffer = Buffer.from(base64, "base64");

      if (buffer.byteLength > MAX_IMAGE_BYTES) {
        return NextResponse.json(
          { ok: false, error: "Image is too large." },
          { status: 400 }
        );
      }

      const ext = body.imageDataUrl.includes("image/png")
        ? "png"
        : body.imageDataUrl.includes("image/webp")
        ? "webp"
        : "jpg";

      const slug = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "")
        .slice(0, 60);

      const blob = await put(
        `listing-submissions/${Date.now()}-${slug || "photo"}.${ext}`,
        buffer,
        { access: "public", contentType: `image/${ext === "jpg" ? "jpeg" : ext}` }
      );

      imageUrl = blob.url;
    }

    const scriptUrl = process.env.GOOGLE_FORM_SCRIPT_URL;
    const secret = process.env.GOOGLE_FORM_SCRIPT_SECRET;

    if (!scriptUrl || !secret) {
      console.error("Missing GOOGLE_FORM_SCRIPT_URL or GOOGLE_FORM_SCRIPT_SECRET env var");
      return NextResponse.json(
        { ok: false, error: "Server is not configured to accept submissions yet." },
        { status: 500 }
      );
    }

    const payload = {
      secret,
      name,
      category,
      description: (body.description || "").trim(),
      address,
      phone,
      whatsapp: (body.whatsapp || "").trim(),
      businessHours: (body.businessHours || "").trim(),
      weeklyOff: (body.weeklyOff || "").trim(),
      topProducts: (body.topProducts || "").trim(),
      facebook: (body.facebook || "").trim(),
      instagram: (body.instagram || "").trim(),
      website: (body.website || "").trim(),
      imageUrl,
      dateAdded: new Date().toISOString().slice(0, 10),
    };

    const scriptRes = await fetch(scriptUrl, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload),
    });

    const scriptJson = await scriptRes.json().catch(() => null);

    if (!scriptRes.ok || !scriptJson?.ok) {
      console.error("Apps Script submission failed", scriptJson);
      return NextResponse.json(
        { ok: false, error: "Could not save submission. Please try again." },
        { status: 502 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("submit-listing error", err);
    return NextResponse.json(
      { ok: false, error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
