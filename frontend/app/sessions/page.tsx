"use client";

import { useEffect, useState } from "react";
import { Download } from "lucide-react";
import { getSessions, getSessionEvents, getPages, Session, TrackedEvent } from "@/lib/api";
import { downloadCSV } from "@/lib/csv";
import SessionsTable from "@/components/SessionsTable";
import SessionJourney from "@/components/SessionJourney";
import StatsOverview from "@/components/StatsOverview";

export default function SessionsPage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [pageCount, setPageCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [events, setEvents] = useState<TrackedEvent[]>([]);
  const [eventsLoading, setEventsLoading] = useState(false);

  useEffect(() => {
    Promise.all([getSessions(), getPages()])
      .then(([sessionData, pages]) => {
        setSessions(sessionData);
        setPageCount(pages.length);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  function handleSelect(sessionId: string) {
    setSelectedId(sessionId);
    setEventsLoading(true);
    getSessionEvents(sessionId)
      .then(setEvents)
      .catch((err) => setError(err.message))
      .finally(() => setEventsLoading(false));
  }

  const totalEvents = sessions.reduce((sum, s) => sum + s.eventCount, 0);
  const avgPerSession =
    sessions.length > 0 ? (totalEvents / sessions.length).toFixed(1) : "0";

  function handleExport() {
    downloadCSV(
      "sessions.csv",
      sessions.map((s) => ({
        session_id: s._id,
        event_count: s.eventCount,
        first_seen: s.firstSeen,
        last_seen: s.lastSeen,
      }))
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-slate-800 dark:text-zinc-100">Sessions</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-zinc-400">
            Every visitor session, grouped by ID. Select one to view their journey.
          </p>
        </div>
        {sessions.length > 0 && (
          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 shadow-sm transition-colors hover:bg-slate-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
          >
            <Download className="h-4 w-4" />
            Export CSV
          </button>
        )}
      </div>

      {!loading && !error && (
        <StatsOverview
          totalSessions={sessions.length}
          totalEvents={totalEvents}
          totalPages={pageCount}
          avgPerSession={avgPerSession}
        />
      )}

      {error && (
        <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-400">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <SessionsTable
            sessions={sessions}
            loading={loading}
            selectedId={selectedId}
            onSelect={handleSelect}
          />
        </div>
        <div className="lg:col-span-3">
          <SessionJourney
            sessionId={selectedId}
            events={events}
            loading={eventsLoading}
          />
        </div>
      </div>
    </div>
  );
}