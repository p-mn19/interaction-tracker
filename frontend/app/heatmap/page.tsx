"use client";

import { useEffect, useState } from "react";
import { getPages, getHeatmap, HeatmapPoint } from "@/lib/api";
import HeatmapView from "@/components/HeatmapView";

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
        if (data.length > 0) setSelectedPage(data[0]);
      })
      .catch((err) => setError(err.message));
  }, []);

  useEffect(() => {
    if (!selectedPage) return;
    setLoading(true);
    getHeatmap(selectedPage)
      .then(setPoints)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [selectedPage]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-xl font-medium text-slate-800">Heatmap</h1>
          <p className="mt-1 text-sm text-slate-500">
            Click density by page. Pick a page to see where visitors clicked.
          </p>
        </div>

        {pages.length > 0 && (
          <select
            value={selectedPage}
            onChange={(e) => setSelectedPage(e.target.value)}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-200"
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
        <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600">
          {error}
        </div>
      )}

      {pages.length === 0 && !error && (
        <div className="rounded-xl border border-dashed border-slate-200 p-6 text-sm text-slate-400">
          No pages tracked yet. Visit the demo page first.
        </div>
      )}

      {pages.length > 0 && <HeatmapView points={points} loading={loading} />}
    </div>
  );
}