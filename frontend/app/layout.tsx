import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { ThemeProvider } from "@/components/ThemeProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Interaction Tracker",
  description: "Session and click tracking dashboard",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        style={{ fontFamily: inter.style.fontFamily }}
        className="min-h-screen bg-slate-50 text-slate-900 antialiased transition-colors duration-200 dark:bg-zinc-950 dark:text-zinc-100"
      >
        <ThemeProvider>
          <Navbar />
          <main className="mx-auto max-w-6xl px-6 py-8">{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}