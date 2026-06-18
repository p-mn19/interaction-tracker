"use client";

import { TopPage } from "@/lib/api";

const barColors = [
  "from-indigo-500 to-violet-500",
  "from-sky-500 to-cyan-500",
  "from-emerald-500 to-teal-500",
  "from-amber-500 to-orange-500",
  "from-rose-500 to-pink-500",
];

export default function TopPagesList({
  pages,
  loading,
}: {
  pages: TopPage[];
  loading: boolean;
}) {
  if (loading) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-400 dark:border-zinc-800 dark:bg-zinc-900">
        Loading pages...
      </div>
    );
  }

  if (pages.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-200 p-6 text-sm text-slate-400 dark:border-zinc-700 dark:text-zinc-500">
        No pages tracked yet. Visit the demo page first.
      </div>
    );
  }

  const maxEvents = Math.max(...pages.map((p) => p.totalEvents));

  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      {/* Header */}
      <div className="border-b border-slate-100 px-5 py-4 dark:border-zinc-800">
        <h2 className="text-sm font-semibold text-slate-700 dark:text-zinc-200">
          Pages Ranked by Activity
        </h2>
        <p className="text-xs text-slate-400 dark:text-zinc-500">
          Total events and unique sessions per page
        </p>
      </div>

      <ol className="divide-y divide-slate-100 dark:divide-zinc-800">
        {pages.map((page, index) => (
          <li key={page.page_url} className="flex items-center gap-4 px-5 py-4">
            {/* Rank */}
            <span
              className={`flex h-7 w-7 flex-none items-center justify-center rounded-full bg-gradient-to-br text-xs font-bold text-white ${
                barColors[index % barColors.length]
              }`}
            >
              {index + 1}
            </span>

            <div className="flex-1 min-w-0">
              <div className="mb-1.5 flex items-center justify-between gap-3">
                <span className="truncate text-sm font-medium text-slate-700 dark:text-zinc-300">
                  {page.page_url}
                </span>
                <div className="flex flex-none items-center gap-2 text-xs">
                  <span className="rounded-full bg-indigo-50 px-2 py-0.5 font-semibold text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
                    {page.totalEvents} events
                  </span>
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 font-semibold text-slate-500 dark:bg-zinc-800 dark:text-zinc-400">
                    {page.sessionCount} sessions
                  </span>
                </div>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-zinc-800">
                <div
                  className={`h-full rounded-full bg-gradient-to-r transition-all ${
                    barColors[index % barColors.length]
                  }`}
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