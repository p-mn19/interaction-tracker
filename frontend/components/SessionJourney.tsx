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
      <div className="flex h-full min-h-[240px] items-center justify-center rounded-xl border border-dashed border-slate-200 text-sm text-slate-400">
        Select a session to view its details
      </div>
    );
  }

  if (loading) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-400">
        Loading journey...
      </div>
    );
  }

  function handleExport() {
    if (!sessionId) return;
    downloadCSV(
      `session-${sessionId.slice(0, 8)}.csv`,
      events.map((event) => ({
        event_type: event.event_type,
        page_url: event.page_url,
        timestamp: event.timestamp,
        click_x: event.click_x ?? "",
        click_y: event.click_y ?? "",
      }))
    );
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-sm font-medium text-slate-700">
          Journey for{" "}
          <span className="font-mono text-xs text-slate-400">{sessionId.slice(0, 12)}...</span>
        </h2>
        <button
          onClick={handleExport}
          className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-500 transition-colors hover:bg-slate-50"
        >
          <Download className="h-3.5 w-3.5" />
          Export
        </button>
      </div>

      <div className="relative">
        <div className="absolute bottom-2 left-4 top-2 w-px bg-slate-100" />

        <ol className="space-y-5">
          {events.map((event) => {
            const isClick = event.event_type === "click";
            return (
              <li key={event._id} className="relative flex items-start gap-3">
                <div
                  className={`relative z-10 flex h-8 w-8 flex-none items-center justify-center rounded-full ${
                    isClick ? "bg-rose-100 text-rose-500" : "bg-sky-100 text-sky-500"
                  }`}
                >
                  {isClick ? (
                    <MousePointerClick className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </div>
                <div className="flex-1 rounded-lg bg-slate-50 px-3 py-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-700">
                      {isClick ? "Click" : "Page view"}
                    </span>
                    <span className="text-xs text-slate-400">{formatTime(event.timestamp)}</span>
                  </div>
                  <p className="mt-0.5 truncate text-xs text-slate-500">{event.page_url}</p>
                  {isClick && (
                    <p className="mt-0.5 font-mono text-xs text-slate-400">
                      ({event.click_x}, {event.click_y})
                    </p>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}