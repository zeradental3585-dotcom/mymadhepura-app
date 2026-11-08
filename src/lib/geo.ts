// Rules for keeping the directory focused on Madhepura district, Bihar.
// Used by the public submission API (hard block) and the admin dashboard
// (warning badge), so both stay consistent.

const LOCAL_PLACES = [
  "madhepura", "madhepur", "madhipura", "मधेपुरा",
  "singheshwar", "singheswar", "bihariganj", "udakishunganj", "uda kishunganj",
  "udakishanganj", "murliganj", "alamnagar", "gamharia", "kumarkhand",
  "shankarpur", "chausa", "gwalpara", "puraini", "ghailarh", "ghailar",
  "manikpur", "grihasthi",
];

// Madhepura district PIN codes start with 852.
const LOCAL_PIN = /\b852\d{3}\b/;

export function looksLocal(address: string, name = ""): boolean {
  const text = `${address} ${name}`.toLowerCase();
  return LOCAL_PLACES.some((p) => text.includes(p)) || LOCAL_PIN.test(text);
}

// Indian mobile (10 digits, starts 6-9), optionally prefixed with +91 / 0,
// or a Madhepura landline (STD 06476).
export function looksIndianPhone(raw: string): boolean {
  let d = (raw || "").replace(/\D+/g, "");
  if (d.length === 12 && d.startsWith("91")) d = d.slice(2);
  if (d.length === 11 && d.startsWith("0")) d = d.slice(1);
  if (/^[6-9]\d{9}$/.test(d)) return true;
  return /^6476\d{5,6}$/.test(d);
}

const SPAM_WORDS =
  /\b(casino|betting|satta|matka|parimatch|1xbet|apk|hair transplant|ivf|backlink|guest post|seo (services|agency)|digital marketing|crypto|forex|loan approval|escort|viagra|cbd)\b/i;

export function looksSpammy(...fields: string[]): boolean {
  const text = fields.join(" ");
  if (SPAM_WORDS.test(text)) return true;
  const links = (text.match(/https?:\/\//gi) || []).length;
  return links > 2;
}
