"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/sessions", label: "Sessions" },
  { href: "/heatmap", label: "Heatmap" },
  { href: "/top-pages", label: "Top Pages" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-sky-400 text-sm font-semibold text-white">
            IT
          </span>
          <span className="text-base font-medium text-slate-800">Interaction Tracker</span>
        </div>

        <nav className="flex items-center gap-1">
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative rounded-md px-3 py-1.5 text-sm transition-colors ${
                  active ? "font-medium text-indigo-700" : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {link.label}
                {active && (
                  <span className="absolute inset-x-2 -bottom-[10px] h-[2px] rounded-full bg-indigo-500" />
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}