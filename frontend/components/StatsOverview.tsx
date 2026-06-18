"use client";

import { Users, Activity, Globe, TrendingUp } from "lucide-react";
import type { ReactNode } from "react";

type Stat = {
  label: string;
  value: string | number;
  icon: ReactNode;
  gradient: string;
  topBorder: string;
  iconBg: string;
  iconColor: string;
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
      label: "Total Sessions",
      value: totalSessions,
      icon: <Users className="h-4 w-4" />,
      gradient: "from-indigo-500 to-violet-500",
      topBorder: "before:from-indigo-500 before:to-violet-500",
      iconBg: "bg-indigo-50 dark:bg-indigo-950",
      iconColor: "text-indigo-600 dark:text-indigo-400",
    },
    {
      label: "Total Events",
      value: totalEvents,
      icon: <Activity className="h-4 w-4" />,
      gradient: "from-emerald-500 to-teal-500",
      topBorder: "before:from-emerald-500 before:to-teal-500",
      iconBg: "bg-emerald-50 dark:bg-emerald-950",
      iconColor: "text-emerald-600 dark:text-emerald-400",
    },
    {
      label: "Pages Tracked",
      value: totalPages,
      icon: <Globe className="h-4 w-4" />,
      gradient: "from-sky-500 to-cyan-500",
      topBorder: "before:from-sky-500 before:to-cyan-500",
      iconBg: "bg-sky-50 dark:bg-sky-950",
      iconColor: "text-sky-600 dark:text-sky-400",
    },
    {
      label: "Avg. Events / Session",
      value: avgPerSession,
      icon: <TrendingUp className="h-4 w-4" />,
      gradient: "from-amber-500 to-orange-500",
      topBorder: "before:from-amber-500 before:to-orange-500",
      iconBg: "bg-amber-50 dark:bg-amber-950",
      iconColor: "text-amber-600 dark:text-amber-400",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="relative overflow-hidden rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
        >
          {/* Gradient top bar */}
          <div
            className={`absolute inset-x-0 top-0 h-1 rounded-t-xl bg-gradient-to-r ${stat.gradient}`}
          />

          <div className={`mb-3 inline-flex h-8 w-8 items-center justify-center rounded-lg ${stat.iconBg} ${stat.iconColor}`}>
            {stat.icon}
          </div>

          <p className="text-2xl font-bold text-slate-800 dark:text-zinc-100">{stat.value}</p>
          <p className="mt-0.5 text-xs font-medium text-slate-500 dark:text-zinc-400">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}