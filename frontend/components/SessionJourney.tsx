"use client";

import { Download, Eye, MousePointerClick } from "lucide-react";
import { TrackedEvent } from "@/lib/api";
import { downloadCSV } from "@/lib/csv";

function formatTime(value: string) {
  return new Date(value).toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

export default function SessionJourney({
  sessionId,
  events,
  loading,
}: {
  sessionId: string | null;
  events: TrackedEvent[];
  loading: boolean;
}) {
  if (!sessionId) {
    return (
      <div className="flex h-full min-h-[240px] items-center justify-center rounded-xl border border-dashed border-slate-200 text-sm text-slate-400 dark:border-zinc-700 dark:text-zinc-600">
        ← Select a session to view its journey
      </div>
    );
  }

  if (loading) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-400 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-500">
        Loading journey...
      </div>
    );
  }

  function handleExport() {
    if (!sessionId) return;
    downloadCSV(
      `session-${sessionId.slice(0, 8)}.csv`,
      events.map((e) => ({
        event_type: e.event_type,
        page_url: e.page_url,
        timestamp: e.timestamp,
        click_x: e.click_x ?? "",
        click_y: e.click_y ?? "",
      }))
    );
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 dark:border-zinc-800">
        <div>
          <h2 className="text-sm font-semibold text-slate-700 dark:text-zinc-200">User Journey</h2>
          <p className="font-mono text-xs text-slate-400 dark:text-zinc-500">
            {sessionId.slice(0, 16)}...
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-violet-50 px-2.5 py-0.5 text-xs font-semibold text-violet-600 dark:bg-violet-950 dark:text-violet-400">
            {events.length} events
          </span>
          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-500 transition-colors hover:bg-slate-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
          >
            <Download className="h-3.5 w-3.5" />
            Export
          </button>
        </div>
      </div>

      {/* Timeline */}
      <div className="max-h-[520px] overflow-y-auto p-5">
        <div className="relative">
          <div className="absolute bottom-2 left-4 top-2 w-px bg-gradient-to-b from-indigo-200 via-slate-200 to-transparent dark:from-indigo-900 dark:via-zinc-800" />

          <ol className="space-y-4">
            {events.map((event) => {
              const isClick = event.event_type === "click";
              return (
                <li key={event._id} className="relative flex items-start gap-3">
                  <div
                    className={`relative z-10 flex h-8 w-8 flex-none items-center justify-center rounded-full shadow-sm ring-2 ring-white dark:ring-zinc-900 ${
                      isClick
                        ? "bg-gradient-to-br from-rose-400 to-pink-500 text-white"
                        : "bg-gradient-to-br from-sky-400 to-indigo-500 text-white"
                    }`}
                  >
                    {isClick ? (
                      <MousePointerClick className="h-3.5 w-3.5" />
                    ) : (
                      <Eye className="h-3.5 w-3.5" />
                    )}
                  </div>

                  <div className="flex-1 rounded-lg border border-slate-100 bg-slate-50 px-3 py-2.5 dark:border-zinc-800 dark:bg-zinc-800/50">
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={`text-xs font-semibold ${
                          isClick
                            ? "text-rose-500 dark:text-rose-400"
                            : "text-sky-600 dark:text-sky-400"
                        }`}
                      >
                        {isClick ? "Click" : "Page view"}
                      </span>
                      <span className="text-xs text-slate-400 dark:text-zinc-500">
                        {formatTime(event.timestamp)}
                      </span>
                    </div>
                    <p className="mt-0.5 truncate text-xs text-slate-600 dark:text-zinc-400">
                      {event.page_url}
                    </p>
                    {isClick && (
                      <p className="mt-0.5 font-mono text-xs text-slate-400 dark:text-zinc-600">
                        x: {event.click_x} · y: {event.click_y}
                      </p>
                    )}
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </div>
  );
}