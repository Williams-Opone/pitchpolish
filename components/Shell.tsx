import Link from "next/link";
import type { ReactNode } from "react";
import Background3D from "@/components/Background3D";
import SessionSlot from "@/components/SessionSlot";
import { IconArrow } from "@/components/icons";

export default function Shell({ children }: { children: ReactNode }) {
  return (
    <>
      <Background3D />
      <div className="grain pointer-events-none fixed inset-0 z-[9999] opacity-[0.045]" aria-hidden="true" />

      <nav className="sticky top-0 z-50 border-b border-paper/[0.07] bg-ink-900/75 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:px-10">
          <Link href="/" className="font-display text-2xl tracking-tight text-paper">
            Pitch<span className="italic text-copper-300">Polish</span>
            <span className="text-copper-400">.</span>
          </Link>
          <div className="flex items-center gap-3 md:gap-5">
            <Link
              href="/dashboard"
              className="navlink hidden text-[13px] font-semibold tracking-wide text-paper-dim transition hover:text-paper sm:block"
            >
              Reports
            </Link>
            <Link
              href="/upload"
              className="btn-shine group inline-flex items-center gap-2 rounded-full bg-copper-400 px-4 py-2.5 text-[13px] font-bold text-ink-950 transition-colors duration-300 hover:bg-copper-300"
            >
              New analysis
              <IconArrow size={13} className="transition-transform group-hover:translate-x-0.5" />
            </Link>
            <SessionSlot />
          </div>
        </div>
      </nav>

      <main className="relative z-10 min-h-screen">{children}</main>

      <footer className="relative z-10 border-t border-paper/[0.06] py-8 text-center font-mono text-[10px] uppercase tracking-[0.24em] text-paper-dim/50">
        PitchPolish — Not a pitch. A score.
      </footer>
    </>
  );
}
