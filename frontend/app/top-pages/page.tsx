"use client";

import { useEffect, useState } from "react";
import { getTopPages, TopPage } from "@/lib/api";
import TopPagesList from "@/components/TopPagesList";
import LiveIndicator from "@/components/LiveIndicator";

const REFRESH_INTERVAL_MS = 10000;

export default function TopPagesPage() {
  const [pages, setPages] = useState<TopPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function load(isInitial: boolean) {
      if (isInitial) setLoading(true);
      try {
        const data = await getTopPages();
        if (active) setPages(data);
      } catch (err) {
        if (active) setError((err as Error).message);
      } finally {
        if (isInitial && active) setLoading(false);
      }
    }

    load(true);
    const interval = setInterval(() => load(false), REFRESH_INTERVAL_MS);

    return () => {
      active = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <h1 className="text-xl font-semibold text-slate-800 dark:text-zinc-100">Top Pages</h1>
        <LiveIndicator />
      </div>
      <p className="-mt-5 text-sm text-slate-500 dark:text-zinc-400">
        Pages ranked by total events, busiest first.
      </p>

      {error && (
        <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-400">
          {error}
        </div>
      )}

      <TopPagesList pages={pages} loading={loading} />
    </div>
  );
}