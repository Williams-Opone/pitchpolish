"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function UserChip({
  name,
  email,
  onSignOut,
}: {
  name: string;
  email: string;
  onSignOut?: () => Promise<void> | void;
}) {
  const router = useRouter();
  const [signingOut, setSigningOut] = useState(false);
  const initial = (name[0] ?? email[0] ?? "?").toUpperCase();

  const signOut = async () => {
    if (signingOut) return;
    setSigningOut(true);
    try {
      if (onSignOut) {
        await onSignOut();
      } else {
        await fetch("/api/auth/signout", { method: "POST" });
      }
      router.push("/");
      router.refresh();
    } catch {
      setSigningOut(false);
    }
  };

  return (
    <div className="flex items-center gap-3">
      <Link
        href="/dashboard"
        className="group flex items-center gap-2.5 rounded-full border border-paper/10 bg-paper/[0.04] py-1.5 pl-1.5 pr-4 transition-colors hover:border-copper-400/40"
        title={email}
      >
        <span className="flex h-7 w-7 items-center justify-center rounded-full border border-copper-400/40 bg-copper-400/15 font-display text-sm text-copper-200">
          {initial}
        </span>
        <span className="hidden max-w-[130px] truncate text-[13px] font-semibold text-paper sm:block">
          {name.split(" ")[0]}
        </span>
      </Link>
      <button
        onClick={signOut}
        disabled={signingOut}
        className="rounded-full border border-paper/10 p-2.5 text-paper-dim transition hover:border-flame-400/40 hover:text-flame-300 disabled:opacity-50"
        aria-label="Sign out"
        title="Sign out"
      >
        <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M6 2.5H3.8A1.3 1.3 0 0 0 2.5 3.8v8.4a1.3 1.3 0 0 0 1.3 1.3H6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          <path d="M10.5 5 13.5 8l-3 3M13.2 8H6.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  );
}
