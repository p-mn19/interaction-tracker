"use client";

import { useState } from "react";
import { ChevronRight, Search } from "lucide-react";
import { Session } from "@/lib/api";

function formatDate(value: string) {
  return new Date(value).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function SessionsTable({
  sessions,
  loading,
  selectedId,
  onSelect,
}: {
  sessions: Session[];
  loading: boolean;
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  const [search, setSearch] = useState("");

  if (loading) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-400 dark:border-zinc-800 dark:bg-zinc-900">
        Loading sessions...
      </div>
    );
  }

  if (sessions.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-200 p-6 text-sm text-slate-400 dark:border-zinc-700">
        No sessions recorded yet. Visit the demo page and click around.
      </div>
    );
  }

  const filtered = sessions.filter((s) =>
    s._id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      {/* Search */}
      <div className="flex items-center gap-2 border-b border-slate-100 px-4 py-3 dark:border-zinc-800">
        <Search className="h-4 w-4 flex-none text-slate-300 dark:text-zinc-600" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by session ID..."
          className="w-full bg-transparent text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none dark:text-zinc-300 dark:placeholder:text-zinc-600"
        />
      </div>

      {filtered.length === 0 ? (
        <p className="px-4 py-6 text-sm text-slate-400 dark:text-zinc-500">
          No sessions match &quot;{search}&quot;.
        </p>
      ) : (
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-400 dark:bg-zinc-800/60 dark:text-zinc-500">
            <tr>
              <th className="px-4 py-3 font-medium">Session</th>
              <th className="px-4 py-3 font-medium">Events</th>
              <th className="px-4 py-3 font-medium">Last seen</th>
              <th className="px-2 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-zinc-800">
            {filtered.map((session) => {
              const active = session._id === selectedId;
              return (
                <tr
                  key={session._id}
                  onClick={() => onSelect(session._id)}
                  className={`cursor-pointer border-l-2 transition-colors ${
                    active
                      ? "border-l-indigo-500 bg-indigo-50/60 dark:bg-indigo-950/40"
                      : "border-l-transparent hover:bg-slate-50 dark:hover:bg-zinc-800/50"
                  }`}
                >
                  <td className="px-4 py-3 font-mono text-xs text-slate-600 dark:text-zinc-400">
                    {session._id.slice(0, 8)}...
                  </td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
                      {session.eventCount}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-500 dark:text-zinc-500">
                    {formatDate(session.lastSeen)}
                  </td>
                  <td className="px-2 py-3 text-slate-300 dark:text-zinc-600">
                    <ChevronRight
                      className={`h-4 w-4 transition-transform ${
                        active ? "translate-x-0.5 text-indigo-500 dark:text-indigo-400" : ""
                      }`}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}