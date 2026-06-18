"use client";

import { HeatmapPoint } from "@/lib/api";

export default function HeatmapView({
  points,
  loading,
}: {
  points: HeatmapPoint[];
  loading: boolean;
}) {
  if (loading) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-400">
        Loading clicks...
      </div>
    );
  }

  if (points.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-200 p-6 text-sm text-slate-400">
        No clicks recorded for this page yet.
      </div>
    );
  }

  const maxX = Math.max(...points.map((p) => p.click_x), 400);
  const maxY = Math.max(...points.map((p) => p.click_y), 300);

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <div className="mb-3 flex items-center justify-between text-xs text-slate-400">
        <span>{points.length} clicks recorded</span>
        <span className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-rose-300" /> each dot is one click
        </span>
      </div>

      <div
        className="relative w-full overflow-hidden rounded-lg border border-slate-100 bg-slate-50"
        style={{ aspectRatio: `${maxX} / ${maxY}` }}
      >
        {points.map((point, index) => (
          <span
            key={index}
            className="absolute h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-rose-400 opacity-30 blur-[1px]"
            style={{
              left: `${(point.click_x / maxX) * 100}%`,
              top: `${(point.click_y / maxY) * 100}%`,
            }}
          />
        ))}
      </div>
    </div>
  );
}