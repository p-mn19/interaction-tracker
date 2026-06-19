"use client";

import { useEffect, useState } from "react";
import { getPages, getHeatmap, HeatmapPoint } from "@/lib/api";
import HeatmapView from "@/components/HeatmapView";
import LiveIndicator from "@/components/LiveIndicator";

const REFRESH_INTERVAL_MS = 10000;

export default function HeatmapPage() {
  const [pages, setPages] = useState<string[]>([]);
  const [selectedPage, setSelectedPage] = useState<string>("");
  const [points, setPoints] = useState<HeatmapPoint[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getPages()
      .then((data) => {
        setPages(data);
        if (data.length > 0) setSelectedPage((current) => current || data[0]);
      })
      .catch((err) => setError(err.message));
  }, []);

  // Poll the heatmap points for the currently selected page every 10s.
  useEffect(() => {
    if (!selectedPage) return;
    let active = true;

    async function load(isInitial: boolean) {
      if (isInitial) setLoading(true);
      try {
        const data = await getHeatmap(selectedPage);
        if (active) setPoints(data);
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
  }, [selectedPage]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-semibold text-slate-800 dark:text-zinc-100">Heatmap</h1>
            <LiveIndicator />
          </div>
          <p className="mt-1 text-sm text-slate-500 dark:text-zinc-400">
            Visual click density by page. Pick a page to see where visitors clicked.
          </p>
        </div>

        {pages.length > 0 && (
          <select
            value={selectedPage}
            onChange={(e) => setSelectedPage(e.target.value)}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
          >
            {pages.map((page) => (
              <option key={page} value={page}>
                {page}
              </option>
            ))}
          </select>
        )}
      </div>

      {error && (
        <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-400">
          {error}
        </div>
      )}

      {pages.length === 0 && !error && (
        <div className="rounded-xl border border-dashed border-slate-200 p-6 text-sm text-slate-400 dark:border-zinc-700 dark:text-zinc-500">
          No pages tracked yet. Visit the demo page first.
        </div>
      )}

      {pages.length > 0 && <HeatmapView points={points} loading={loading} />}
    </div>
  );
}