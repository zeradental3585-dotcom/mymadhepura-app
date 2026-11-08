// Logic for the staff-only Quick Add tool (/admin/quick-add).
// Nothing here invents facts: text is built only from what the staff member
// pasted, ticked or typed.

export const CATEGORY_SERVICES: Record<string, string[]> = {
  Restaurants: ["Dine-in", "Takeaway", "Home delivery", "Vegetarian", "Non-vegetarian", "Family seating", "Online payment accepted"],
  Cafe: ["Dine-in", "Takeaway", "Coffee", "Snacks", "Cakes & desserts", "Online payment accepted"],
  Hotels: ["AC rooms", "Non-AC rooms", "Restaurant", "Parking", "Wi-Fi", "Family rooms", "Online booking"],
  Banquets: ["Marriage hall", "Catering", "Decoration", "Parking", "AC hall", "Rooms for guests", "Generator backup"],
  Doctors: ["OPD consultation", "Appointment by phone", "Emergency", "Health check-ups"],
  Hospitals: ["24x7 emergency", "Ambulance", "ICU", "Pharmacy", "Pathology lab", "Maternity", "Cashless / insurance accepted"],
  Dentists: ["Dental check-up", "Root canal", "Braces & aligners", "Scaling & polishing", "Implants", "Kids dentistry"],
  Chemist: ["Prescription medicines", "Home delivery", "Generic medicines", "Open late", "Online payment accepted"],
  Education: ["Classroom coaching", "Doubt classes", "Test series", "Study material", "Online classes", "Small batches"],
  Schools: ["Nursery to 10th", "CBSE", "BSEB", "School transport", "Smart classes", "Sports facilities"],
  Colleges: ["Undergraduate courses", "Postgraduate courses", "Hostel", "Library", "Scholarships"],
  Fashion: ["Men's wear", "Women's wear", "Kids wear", "Tailoring", "Wedding collection", "Footwear", "Accessories"],
  Grocery: ["Daily essentials", "Home delivery", "Wholesale", "Packaged food", "Online payment accepted"],
  Automobile: ["New vehicles", "Servicing", "Genuine parts", "Accessories", "Insurance help", "Finance help"],
  "Printing Press": ["Digital printing", "Visiting cards", "Banners & flex", "Photocopy", "Wedding cards", "Lamination"],
  Beauty: ["Haircut", "Facial", "Bridal makeup", "Waxing", "Hair colour", "Men's grooming"],
  Others: ["Home service", "Online payment accepted", "Free estimate", "Open on holidays"],
};

export const CATEGORY_NAMES = Object.keys(CATEGORY_SERVICES);

export interface ParsedMaps {
  name: string;
  address: string;
  phone: string;
  latitude: string;
  longitude: string;
}

// Pulls what it can out of text copied from a Google Maps place panel (and/or
// a Maps URL). Anything not found stays empty for the staff member to fill in.
export function parseMapsText(text: string): ParsedMaps {
  const out: ParsedMaps = { name: "", address: "", phone: "", latitude: "", longitude: "" };
  if (!text.trim()) return out;

  const coord =
    text.match(/@(-?\d{1,3}\.\d+),(-?\d{1,3}\.\d+)/) ||
    text.match(/!3d(-?\d{1,3}\.\d+)!4d(-?\d{1,3}\.\d+)/) ||
    text.match(/[?&](?:query|q|ll)=(-?\d{1,3}\.\d+)(?:,|%2C)(-?\d{1,3}\.\d+)/i);
  if (coord) {
    out.latitude = coord[1];
    out.longitude = coord[2];
  }

  const phone = text.match(/(?:\+?91[\s-]*)?0?[6-9](?:[\s-]?\d){9}/);
  if (phone) out.phone = phone[0].replace(/\D+/g, "").slice(-10);

  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l && !/^https?:\/\//i.test(l));

  const isNoise = (l: string) =>
    /^\(?\d(\.\d)?\)?$/.test(l) || /^(\d+ reviews?|open|closed|directions|save|share|website|call)/i.test(l);

  out.name = lines.find((l) => !isNoise(l) && l.length > 2) || "";
  out.address =
    lines.find((l) => l !== out.name && /madhepura|madhipura|bihar|852\d{3}/i.test(l)) ||
    lines.find((l) => l !== out.name && (l.match(/,/g) || []).length >= 2) ||
    "";
  out.address = out.address.replace(/^address:\s*/i, "");
  return out;
}

export interface DraftInput {
  name: string;
  category: string;
  address: string;
  phone: string;
  hours: string;
  weeklyOff: string;
  services: string[];
  notes: string;
}

function joinList(items: string[]): string {
  if (items.length <= 1) return items.join("");
  return items.slice(0, -1).join(", ") + " and " + items[items.length - 1];
}

export function generateDraft(d: DraftInput) {
  const services = d.services.map((s) => s.toLowerCase());
  const topServices = services.slice(0, 3);

  let short = `${d.name} - ${d.category} in Madhepura, Bihar.`;
  if (topServices.length) short += ` ${joinList(d.services.slice(0, 3))}.`;
  if (d.phone) short += ` Call ${d.phone}.`;
  if (short.length > 200) short = short.slice(0, 197).trimEnd() + "...";

  const paras: string[] = [];
  paras.push(
    `${d.name} is listed on myMadhepura under ${d.category}. You can find it at ${d.address || "Madhepura, Bihar"}.`
  );
  if (d.notes.trim()) paras.push(d.notes.trim());
  if (d.services.length) paras.push(`Services and facilities: ${joinList(d.services)}.`);
  if (d.hours.trim()) {
    paras.push(
      `Opening hours: ${d.hours.trim()}${d.weeklyOff.trim() ? ` (weekly off: ${d.weeklyOff.trim()})` : ""}.`
    );
  }
  paras.push(
    `${d.phone ? `To contact ${d.name}, call ${d.phone}. ` : ""}Please call ahead to confirm availability, timings and prices before you visit.`
  );

  return {
    short,
    long: paras.join("\n\n"),
    seoTitle: `${d.name} - ${d.category} in Madhepura | myMadhepura`,
  };
}
