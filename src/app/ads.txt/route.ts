import { NextResponse } from "next/server";

// AdSense site verification / ad-serving authorization file.
// See: https://support.google.com/adsense/answer/7532444
export async function GET() {
  const body = "google.com, pub-7577953323229534, DIRECT, f08c47fec0942fa0\n";
  return new NextResponse(body, {
    headers: { "Content-Type": "text/plain" },
  });
}
