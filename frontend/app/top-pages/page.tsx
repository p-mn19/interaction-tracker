"use client";

import { useEffect, useState } from "react";
import { getTopPages, TopPage } from "@/lib/api";
import TopPagesList from "@/components/TopPagesList";

export default function TopPagesPage() {
  const [pages, setPages] = useState<TopPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getTopPages()
      .then(setPages)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-slate-800 dark:text-zinc-100">Top Pages</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-zinc-400">
          Pages ranked by total events, busiest first.
        </p>
      </div>

      {error && (
        <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-400">
          {error}
        </div>
      )}

      <TopPagesList pages={pages} loading={loading} />
    </div>
  );
}