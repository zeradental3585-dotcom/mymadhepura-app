import { ImageResponse } from "next/og";
import { getAllListings, getListingBySlug } from "@/lib/data";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export async function generateStaticParams() {
  const all = await getAllListings();
  return all.map((l) => ({ slug: l.slug }));
}

export default async function Image({ params }: { params: { slug: string } }) {
  const listing = await getListingBySlug(params.slug);
  const name = listing?.name ?? "myMadhepura";
  const category = listing?.category ?? "";
  const address = listing?.address ?? "";
  const photo = listing?.imageUrl;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          background: "#b34d1f",
        }}
      >
        {photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={photo}
            alt=""
            width={1200}
            height={630}
            style={{
              position: "absolute",
              inset: 0,
              width: "1200px",
              height: "630px",
              objectFit: "cover",
            }}
          />
        ) : (
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              background: "linear-gradient(135deg, #b34d1f 0%, #d9622b 100%)",
            }}
          />
        )}

        {/* Darkening scrim so text stays legible over any photo */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            background:
              "linear-gradient(0deg, rgba(20,10,5,0.92) 0%, rgba(20,10,5,0.55) 42%, rgba(20,10,5,0.05) 68%)",
          }}
        />

        {/* Brand chip, top-left, non-essential so it's fine near the edge */}
        <div
          style={{
            position: "absolute",
            top: 40,
            left: 150,
            display: "flex",
            alignItems: "center",
            gap: 10,
            background: "rgba(255,255,255,0.92)",
            padding: "10px 20px",
            borderRadius: 999,
            fontSize: 26,
            fontWeight: 700,
            color: "#b34d1f",
          }}
        >
          📍 myMadhepura
        </div>

        {/* Safe-zone text block, centered within x: 150-1050, anchored low */}
        <div
          style={{
            position: "absolute",
            left: 150,
            right: 150,
            bottom: 56,
            display: "flex",
            flexDirection: "column",
          }}
        >
          {category && (
            <div
              style={{
                display: "flex",
                alignSelf: "flex-start",
                fontSize: 28,
                fontWeight: 700,
                color: "#ffffff",
                background: "rgba(217,98,43,0.9)",
                padding: "8px 22px",
                borderRadius: 999,
                marginBottom: 20,
              }}
            >
              {category}
            </div>
          )}
          <div
            style={{
              display: "flex",
              fontSize: name.length > 28 ? 56 : 68,
              fontWeight: 800,
              color: "#ffffff",
              lineHeight: 1.08,
              letterSpacing: -1,
            }}
          >
            {name}
          </div>
          {address && (
            <div
              style={{
                display: "flex",
                marginTop: 18,
                fontSize: 30,
                fontWeight: 600,
                color: "#f5e4d8",
              }}
            >
              {address.length > 60 ? address.slice(0, 57) + "…" : address}
            </div>
          )}
        </div>
      </div>
    ),
    { ...size }
  );
}
