"use client";

import { TopPage } from "@/lib/api";

export default function TopPagesList({
  pages,
  loading,
}: {
  pages: TopPage[];
  loading: boolean;
}) {
  if (loading) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-400">
        Loading pages...
      </div>
    );
  }

  if (pages.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-200 p-6 text-sm text-slate-400">
        No pages tracked yet. Visit the demo page first.
      </div>
    );
  }

  const maxEvents = Math.max(...pages.map((p) => p.totalEvents));

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <ol className="space-y-3">
        {pages.map((page, index) => (
          <li key={page.page_url} className="flex items-center gap-4">
            <span className="w-5 flex-none text-sm font-medium text-slate-400">{index + 1}</span>

            <div className="flex-1">
              <div className="mb-1 flex items-center justify-between gap-3">
                <span className="truncate text-sm font-medium text-slate-700">
                  {page.page_url}
                </span>
                <span className="flex-none text-xs text-slate-400">
                  {page.totalEvents} events · {page.sessionCount} sessions
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-indigo-400 to-sky-400"
                  style={{ width: `${(page.totalEvents / maxEvents) * 100}%` }}
                />
              </div>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}