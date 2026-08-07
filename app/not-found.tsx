import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page Not Found",
  description: "The page you are looking for could not be found. Return to Abishek's portfolio homepage.",
  robots: {
    index: false,
    follow: true,
  },
};

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="text-center max-w-lg">
        <h1 className="text-8xl font-bold bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent mb-4">
          404
        </h1>
        <h2 className="text-2xl font-semibold text-white mb-4">
          Page Not Found
        </h2>
        <p className="text-white/50 mb-8 leading-relaxed">
          Sorry, the page you are looking for doesn&apos;t exist or has been moved.
          Let&apos;s get you back on track.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-medium text-sm tracking-wide bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 hover:scale-105 transition-all duration-300"
        >
          Back to Home
        </Link>
      </div>
    </main>
  );
}
