import { redirect } from "next/navigation";
import { isAdminAuthed } from "@/lib/adminAuth";
import AdminDashboard from "./AdminDashboard";

// Always check auth fresh and never cache this page — it's a private,
// per-session admin view, not public content.
export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const authed = await isAdminAuthed();
  if (!authed) redirect("/admin/login");
  return <AdminDashboard />;
}
