"use client";

import { Users, Activity, Globe, TrendingUp } from "lucide-react";
import type { ReactNode } from "react";

type Stat = {
  label: string;
  value: string | number;
  icon: ReactNode;
  borderColor: string;
  chip: string;
};

export default function StatsOverview({
  totalSessions,
  totalEvents,
  totalPages,
  avgPerSession,
}: {
  totalSessions: number;
  totalEvents: number;
  totalPages: number;
  avgPerSession: string;
}) {
  const stats: Stat[] = [
    {
      label: "Sessions",
      value: totalSessions,
      icon: <Users className="h-4 w-4" />,
      borderColor: "border-l-indigo-400",
      chip: "bg-indigo-50 text-indigo-600",
    },
    {
      label: "Total events",
      value: totalEvents,
      icon: <Activity className="h-4 w-4" />,
      borderColor: "border-l-emerald-400",
      chip: "bg-emerald-50 text-emerald-600",
    },
    {
      label: "Pages tracked",
      value: totalPages,
      icon: <Globe className="h-4 w-4" />,
      borderColor: "border-l-sky-400",
      chip: "bg-sky-50 text-sky-600",
    },
    {
      label: "Avg. events / session",
      value: avgPerSession,
      icon: <TrendingUp className="h-4 w-4" />,
      borderColor: "border-l-amber-400",
      chip: "bg-amber-50 text-amber-600",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className={`rounded-xl border border-slate-200 border-l-4 bg-white p-4 transition-shadow hover:shadow-sm ${stat.borderColor}`}
        >
          <div
            className={`mb-2 inline-flex h-7 w-7 items-center justify-center rounded-lg ${stat.chip}`}
          >
            {stat.icon}
          </div>
          <p className="text-2xl font-semibold text-slate-800">{stat.value}</p>
          <p className="text-xs text-slate-500">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}