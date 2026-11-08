import { redirect } from "next/navigation";
import { isAdminAuthed } from "@/lib/adminAuth";
import QuickAddForm from "./QuickAddForm";

// Private staff tool: never cached, always checks the admin session first.
export const dynamic = "force-dynamic";

export default async function QuickAddPage() {
  const authed = await isAdminAuthed();
  if (!authed) redirect("/admin/login");
  return <QuickAddForm />;
}
