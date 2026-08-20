"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface PendingSubmission {
  rowNumber: number;
  name: string;
  category: string;
  description: string;
  address: string;
  phone: string;
  whatsapp: string;
  businessHours: string;
  weeklyOff: string;
  topProducts: string;
  facebook: string;
  instagram: string;
  website: string;
  imageUrl: string;
  dateAdded: string;
}

type Toast = { type: "success" | "error"; text: string };

export default function AdminDashboard() {
  const router = useRouter();
  const [items, setItems] = useState<PendingSubmission[] | null>(null);
  const [error, setError] = useState("");
  const [busyRow, setBusyRow] = useState<number | null>(null);
  const [toast, setToast] = useState<Toast | null>(null);

  const load = useCallback(async () => {
    setError("");
    try {
      const res = await fetch("/api/admin/pending", { cache: "no-store" });
      if (res.status === 401) {
        router.push("/admin/login");
        return;
      }
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json?.error || "Could not load submissions.");
      setItems(json.pending);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  }, [router]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- standard fetch-on-mount pattern
    load();
  }, [load]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3500);
    return () => clearTimeout(t);
  }, [toast]);

  async function handleAction(item: PendingSubmission, action: "approve" | "reject") {
    setBusyRow(item.rowNumber);
    try {
      const res = await fetch("/api/admin/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ row: item.rowNumber, name: item.name, action }),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json?.error || "Action failed.");
      setItems((prev) => (prev ? prev.filter((i) => i.rowNumber !== item.rowNumber) : prev));
      setToast({
        type: "success",
        text: action === "approve" ? `Published "${item.name}"` : `Rejected "${item.name}"`,
      });
    } catch (err) {
      setToast({ type: "error", text: err instanceof Error ? err.message : "Something went wrong." });
    } finally {
      setBusyRow(null);
    }
  }

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="rounded-full bg-brand-light px-3 py-1 text-xs font-semibold text-brand-dark">
            Admin
          </span>
          <h1 className="mt-3 text-2xl font-bold text-foreground">Listing Review</h1>
          <p className="mt-1 text-sm text-foreground/60">
            {items === null
              ? "Loading…"
              : `${items.length} submission${items.length === 1 ? "" : "s"} waiting for review`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={load}
            className="rounded-full border border-black/10 px-4 py-2 text-sm font-semibold text-foreground transition hover:border-brand hover:text-brand"
          >
            Refresh
          </button>
          <button
            onClick={handleLogout}
            className="rounded-full border border-black/10 px-4 py-2 text-sm font-semibold text-foreground/60 transition hover:border-red-300 hover:text-red-500"
          >
            Sign out
          </button>
        </div>
      </div>

      {error && (
        <div className="mt-6 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>
      )}

      {items === null && !error && (
        <div className="mt-16 flex justify-center text-sm text-foreground/50">Loading submissions…</div>
      )}

      {items !== null && items.length === 0 && !error && (
        <div className="mt-10 rounded-2xl border border-dashed border-black/10 bg-white p-12 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-2xl">
            ✅
          </div>
          <h2 className="mt-4 text-lg font-semibold text-foreground">All caught up</h2>
          <p className="mt-1 text-sm text-foreground/60">No submissions waiting for review right now.</p>
        </div>
      )}

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        {items?.map((item) => (
          <div
            key={item.rowNumber}
            className="flex flex-col overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm"
          >
            <div className="relative h-40 w-full bg-brand-light">
              {item.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={item.imageUrl} alt={item.name} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center text-sm text-foreground/40">
                  No photo
                </div>
              )}
              <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-foreground shadow-sm">
                {item.category || "Uncategorized"}
              </span>
            </div>

            <div className="flex flex-1 flex-col p-5">
              <h3 className="text-base font-bold text-foreground">{item.name}</h3>
              {item.address && <p className="mt-1 text-xs text-foreground/50">📍 {item.address}</p>}
              {item.description && (
                <p className="mt-3 line-clamp-4 text-sm text-foreground/70">{item.description}</p>
              )}

              <dl className="mt-4 grid grid-cols-2 gap-x-3 gap-y-2 text-xs">
                {item.phone && (
                  <div>
                    <dt className="text-foreground/40">Phone</dt>
                    <dd className="text-foreground/70">{item.phone}</dd>
                  </div>
                )}
                {item.dateAdded && (
                  <div>
                    <dt className="text-foreground/40">Submitted</dt>
                    <dd className="text-foreground/70">{item.dateAdded}</dd>
                  </div>
                )}
                {item.website && (
                  <div className="col-span-2 overflow-hidden">
                    <dt className="text-foreground/40">Website</dt>
                    <dd className="truncate text-foreground/70">{item.website}</dd>
                  </div>
                )}
              </dl>

              <div className="mt-auto flex gap-2 pt-5">
                <button
                  onClick={() => handleAction(item, "approve")}
                  disabled={busyRow === item.rowNumber}
                  className="flex-1 rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {busyRow === item.rowNumber ? "…" : "Approve"}
                </button>
                <button
                  onClick={() => handleAction(item, "reject")}
                  disabled={busyRow === item.rowNumber}
                  className="flex-1 rounded-full border border-red-200 px-4 py-2 text-sm font-semibold text-red-500 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {busyRow === item.rowNumber ? "…" : "Reject"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {toast && (
        <div
          className={`fixed bottom-6 left-1/2 -translate-x-1/2 rounded-full px-5 py-2.5 text-sm font-semibold shadow-lg ${
            toast.type === "success" ? "bg-foreground text-white" : "bg-red-500 text-white"
          }`}
        >
          {toast.text}
        </div>
      )}
    </div>
  );
}
