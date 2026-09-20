"use client";

import { AuthenticateWithRedirectCallback } from "@clerk/nextjs";
import { clerkEnabled } from "@/lib/authMode";

export const dynamic = "force-dynamic";

/** Landing target for Clerk OAuth redirects (Google, etc.). */
export default function SsoCallbackPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-ink-900">
      <div className="text-center">
        {clerkEnabled ? (
          <>
            <div className="mx-auto mb-5 h-9 w-9 animate-spin rounded-full border-2 border-copper-400/25 border-t-copper-400" />
            <p className="font-mono text-[10px] uppercase tracking-[0.26em] text-paper-dim">
              Completing sign-in…
            </p>
            <AuthenticateWithRedirectCallback />
          </>
        ) : (
          <p className="font-mono text-[10px] uppercase tracking-[0.26em] text-paper-dim">
            Social sign-in isn&apos;t configured here.
          </p>
        )}
      </div>
    </main>
  );
}
