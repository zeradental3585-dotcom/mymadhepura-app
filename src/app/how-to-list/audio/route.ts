import { HOW_TO_AUDIO_B64 } from "@/lib/howToAudio";

export const dynamic = "force-static";

const buf = Buffer.from(HOW_TO_AUDIO_B64, "base64");

// Serves the Hindi how-to-list voiceover, with Range support (needed by
// iOS Safari and for seeking on mobile).
export function GET(req: Request) {
  const headers: Record<string, string> = {
    "Content-Type": "audio/mpeg",
    "Accept-Ranges": "bytes",
    "Cache-Control": "public, max-age=31536000, immutable",
  };
  const range = req.headers.get("range");
  const m = range && /bytes=(\d*)-(\d*)/.exec(range);
  if (m) {
    const start = m[1] ? parseInt(m[1], 10) : 0;
    const end = m[2] ? Math.min(parseInt(m[2], 10), buf.length - 1) : buf.length - 1;
    if (start <= end && start < buf.length) {
      const chunk = buf.subarray(start, end + 1);
      return new Response(new Uint8Array(chunk), {
        status: 206,
        headers: {
          ...headers,
          "Content-Range": `bytes ${start}-${end}/${buf.length}`,
          "Content-Length": String(chunk.length),
        },
      });
    }
  }
  return new Response(new Uint8Array(buf), {
    headers: { ...headers, "Content-Length": String(buf.length) },
  });
}
