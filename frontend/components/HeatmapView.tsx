"use client";

import { useState } from "react";
import { HeatmapPoint } from "@/lib/api";

const TICK_COUNT = 5;

function getTicks(max: number, count: number): number[] {
  return Array.from({ length: count + 1 }, (_, i) => Math.round((max / count) * i));
}

export default function HeatmapView({
  points,
  loading,
}: {
  points: HeatmapPoint[];
  loading: boolean;
}) {
  const [tooltip, setTooltip] = useState<{ x: number; y: number; px: number; py: number } | null>(null);

  if (loading) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-400 dark:border-zinc-800 dark:bg-zinc-900">
        Loading clicks...
      </div>
    );
  }

  if (points.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-200 p-6 text-sm text-slate-400 dark:border-zinc-700 dark:text-zinc-500">
        No clicks recorded for this page yet.
      </div>
    );
  }

  const maxX = Math.max(...points.map((p) => p.click_x), 400);
  const maxY = Math.max(...points.map((p) => p.click_y), 300);

  const xTicks = getTicks(maxX, TICK_COUNT);
  const yTicks = getTicks(maxY, TICK_COUNT);

  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 dark:border-zinc-800">
        <div>
          <h2 className="text-sm font-semibold text-slate-700 dark:text-zinc-200">Click Heatmap</h2>
          <p className="text-xs text-slate-400 dark:text-zinc-500">
            Coordinates are pixel positions within the browser viewport
          </p>
        </div>
        <div className="flex items-center gap-3 text-xs text-slate-400 dark:text-zinc-500">
          <span className="flex items-center gap-1">
            <span className="h-2.5 w-2.5 rounded-full bg-rose-300" /> sparse
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2.5 w-2.5 rounded-full bg-rose-500" /> dense
          </span>
          <span className="ml-2 rounded-full bg-indigo-50 px-2.5 py-0.5 font-semibold text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
            {points.length} clicks
          </span>
        </div>
      </div>

      <div className="p-5">
        {/* X-axis label */}
        <p className="mb-1 text-center text-xs font-medium text-slate-400 dark:text-zinc-500">
          X — Horizontal position (px)
        </p>

        <div className="flex gap-3">
          {/* Y-axis label */}
          <div className="flex items-center">
            <p
              className="text-xs font-medium text-slate-400 dark:text-zinc-500"
              style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
            >
              Y — Vertical position (px)
            </p>
          </div>

          {/* Y tick labels */}
          <div
            className="flex flex-col justify-between py-0 text-right"
            style={{ aspectRatio: "auto" }}
          >
            {[...yTicks].reverse().map((tick) => (
              <span key={tick} className="text-[10px] leading-none text-slate-400 dark:text-zinc-600">
                {tick}
              </span>
            ))}
          </div>

          {/* Canvas area */}
          <div className="flex flex-1 flex-col gap-1">
            <div
              className="relative w-full overflow-hidden rounded-lg border border-slate-200 dark:border-zinc-700"
              style={{
                aspectRatio: `${maxX} / ${maxY}`,
                backgroundColor: "#0f172a",
                backgroundImage:
                  "linear-gradient(to right, rgba(99,102,241,0.07) 1px, transparent 1px), linear-gradient(to bottom, rgba(99,102,241,0.07) 1px, transparent 1px)",
                backgroundSize: "10% 20%",
              }}
            >
              {/* Axis lines */}
              <div className="absolute inset-x-0 top-0 h-px bg-indigo-500/20" />
              <div className="absolute inset-y-0 left-0 w-px bg-indigo-500/20" />

              {/* Click dots */}
              {points.map((point, index) => (
                <span
                  key={index}
                  className="absolute cursor-crosshair rounded-full transition-transform hover:scale-150"
                  onMouseEnter={() =>
                    setTooltip({
                      x: point.click_x,
                      y: point.click_y,
                      px: (point.click_x / maxX) * 100,
                      py: (point.click_y / maxY) * 100,
                    })
                  }
                  onMouseLeave={() => setTooltip(null)}
                  style={{
                    left: `${(point.click_x / maxX) * 100}%`,
                    top: `${(point.click_y / maxY) * 100}%`,
                    width: "8px",
                    height: "8px",
                    transform: "translate(-50%, -50%)",
                    backgroundColor: "rgba(251, 113, 133, 0.9)",
                    boxShadow: "0 0 6px 2px rgba(244, 63, 94, 0.45)",
                  }}
                />
              ))}

              {/* Hover tooltip */}
              {tooltip && (
                <div
                  className="pointer-events-none absolute z-10 rounded-md border border-zinc-700 bg-zinc-900/95 px-2 py-1.5 text-xs text-zinc-200 shadow-lg"
                  style={{
                    left: `${tooltip.px}%`,
                    top: `${tooltip.py}%`,
                    transform:
                      tooltip.px > 70
                        ? "translate(-110%, -50%)"
                        : "translate(12px, -50%)",
                  }}
                >
                  <span className="font-mono">
                    x: {tooltip.x} · y: {tooltip.y}
                  </span>
                </div>
              )}
            </div>

            {/* X tick labels */}
            <div className="flex justify-between px-0">
              {xTicks.map((tick) => (
                <span key={tick} className="text-[10px] leading-none text-slate-400 dark:text-zinc-600">
                  {tick}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}