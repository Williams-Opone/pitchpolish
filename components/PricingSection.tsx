"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Magnetic, ShineBorder } from "@/components/premium";
import { Reveal } from "@/components/fx";
import { IconArrow, IconCheck } from "@/components/icons";

/* ------------------------------ tiny glyphs ------------------------------ */

function Cross({ className = "" }: { className?: string }) {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className={className} aria-hidden="true">
      <path d="M2.5 2.5l7 7M9.5 2.5l-7 7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function Minus({ className = "" }: { className?: string }) {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className={className} aria-hidden="true">
      <path d="M2 6h8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

type Row = { t: string; tone: "good" | "bad" | "none" };

/* ------------------------------ section ------------------------------ */

export default function PricingSection() {
  const [yearly, setYearly] = useState(false);

  const OLD: Row[] = [
    { t: "“Great energy, love the vision” — and nothing else", tone: "bad" },
    { t: "Three weeks of calendar ping-pong", tone: "bad" },
    { t: "Feedback that never quotes your slides", tone: "bad" },
    { t: "One deck, one pass, one invoice", tone: "bad" },
  ];
  const FREE: Row[] = [
    { t: "One full nine-dimension analysis", tone: "good" },
    { t: "Red flags named in crimson, with receipts", tone: "good" },
    { t: "A score you can argue with", tone: "good" },
    { t: "Context-aware coach", tone: "none" },
    { t: "Rescore loop & executive summaries", tone: "none" },
  ];
  const PRO: Row[] = [
    { t: "Unlimited analyses, unlimited decks", tone: "good" },
    { t: "Coach grounded in every word of your deck", tone: "good" },
    { t: "Rescore until the number is fundable", tone: "good" },
    { t: "Executive summaries partners actually read", tone: "good" },
    { t: "Reports stay yours, forever", tone: "good" },
  ];

  const rowIcon = (tone: Row["tone"]) =>
    tone === "good" ? (
      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-moss-400/30 bg-moss-400/[0.08] text-moss-300">
        <IconCheck size={10} />
      </span>
    ) : tone === "bad" ? (
      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-flame-400/30 bg-flame-400/[0.08] text-flame-300">
        <Cross />
      </span>
    ) : (
      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-paper/10 bg-paper/[0.03] text-paper-dim/50">
        <Minus />
      </span>
    );

  return (
    <section id="pricing" className="relative mx-auto max-w-7xl scroll-mt-24 px-6 py-28 md:px-10 md:py-40">
      {/* heading */}
      <div className="mb-16 flex flex-wrap items-end justify-between gap-10 md:mb-20">
        <Reveal>
          <div className="mb-5 font-mono text-[10.5px] uppercase tracking-[0.28em] text-copper-300">
            06 — Pricing
          </div>
          <h2 className="max-w-2xl font-display text-5xl leading-[0.95] tracking-tight text-paper md:text-7xl">
            Cheaper than one <em className="copper-shimmer">mistake.</em>
          </h2>
          <p className="mt-6 max-w-md text-lg font-light leading-relaxed text-paper-dim">
            A single silent kill in a partner meeting costs you the round.
            The fix costs less than lunch with an associate.
          </p>
        </Reveal>

        {/* billing toggle */}
        <Reveal delay={120}>
          <div className="flex flex-col items-start gap-3 md:items-end">
            <div className="grid grid-cols-2 rounded-full border border-paper/12 bg-ink-950/70 p-1">
              {(
                [
                  [false, "Monthly"],
                  [true, "Annual"],
                ] as [boolean, string][]
              ).map(([v, label]) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => setYearly(v)}
                  className={`relative rounded-full px-6 py-2.5 text-sm font-bold transition-colors duration-300 ${
                    yearly === v ? "text-ink-950" : "text-paper-dim hover:text-paper"
                  }`}
                >
                  {yearly === v && (
                    <motion.span
                      layoutId="billing-pill"
                      className="absolute inset-0 rounded-full bg-copper-400"
                      transition={{ type: "spring", stiffness: 340, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{label}</span>
                </button>
              ))}
            </div>
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-moss-300">
              annual = two months free
            </span>
          </div>
        </Reveal>
      </div>

      {/* the confrontation */}
      <div className="grid items-stretch gap-6 lg:grid-cols-3 lg:gap-7">
        {/* -------- the old way -------- */}
        <Reveal className="order-3 lg:order-1">
          <div className="relative flex h-full flex-col overflow-hidden rounded-[1.6rem] border border-flame-400/20 bg-ink-950/80 p-8 opacity-90 transition-transform duration-500 hover:-translate-y-1.5 md:p-9">
            {/* redline sweep */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,transparent_42%,rgba(224,92,84,0.07)_50%,transparent_58%)]"
            />
            <div className="pointer-events-none absolute right-6 top-7 rotate-[10deg] rounded border-2 border-flame-400/60 px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-flame-300 opacity-80">
              Declined
            </div>

            <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-flame-300/80">
              The old way
            </div>
            <h3 className="mt-3 font-display text-3xl tracking-tight text-paper/80">
              A pitch consultant
            </h3>

            <div className="mt-6 flex items-end gap-3">
              <span className="font-display text-6xl leading-none text-paper-dim/70">$15k</span>
              <span className="mb-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-paper-dim/60">
                per pass · 3 weeks
              </span>
            </div>

            <ul className="mt-8 flex-1 space-y-3.5">
              {OLD.map((r) => (
                <li key={r.t} className="flex items-center gap-3 text-[13.5px] leading-snug text-paper-dim/80 line-through decoration-flame-400/40">
                  {rowIcon(r.tone)}
                  {r.t}
                </li>
              ))}
            </ul>

            <p className="mt-8 border-t border-paper/[0.07] pt-5 font-mono text-[10px] uppercase tracking-[0.18em] text-paper-dim/50">
              and they still didn&apos;t read slide 9
            </p>
          </div>
        </Reveal>

        {/* -------- free pass -------- */}
        <Reveal delay={100} className="order-2 lg:order-2">
          <div className="flex h-full flex-col rounded-[1.6rem] border border-paper/[0.1] bg-ink-800/60 p-8 transition-all duration-500 hover:-translate-y-1.5 hover:border-paper/20 md:p-9">
            <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-paper-dim">
              The free pass
            </div>
            <h3 className="mt-3 font-display text-3xl tracking-tight text-paper">One deck, judged</h3>

            <div className="mt-6 flex items-end gap-3">
              <span className="font-display text-6xl leading-none text-paper">$0</span>
              <span className="mb-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-paper-dim/60">
                no card · 48 seconds
              </span>
            </div>

            <ul className="mt-8 flex-1 space-y-3.5">
              {FREE.map((r) => (
                <li
                  key={r.t}
                  className={`flex items-center gap-3 text-[13.5px] leading-snug ${
                    r.tone === "none" ? "text-paper-dim/50" : "text-paper/85"
                  }`}
                >
                  {rowIcon(r.tone)}
                  {r.t}
                </li>
              ))}
            </ul>

            <Link
              href="/upload"
              className="group mt-8 inline-flex items-center justify-center gap-3 rounded-full border border-paper/15 bg-paper/[0.04] px-7 py-3.5 text-base font-bold text-paper transition-all duration-300 hover:border-copper-400/40 hover:bg-paper/[0.07]"
            >
              Run it once
              <IconArrow size={16} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </Reveal>

        {/* -------- founder -------- */}
        <Reveal delay={200} className="order-1 lg:order-3">
          <ShineBorder radius="1.8rem" duration={4.5} className="h-full">
            <div className="relative flex h-full flex-col overflow-hidden rounded-[1.8rem] border border-copper-400/25 bg-gradient-to-b from-ink-700/95 to-ink-850 p-8 shadow-[0_40px_90px_-30px_rgba(214,129,79,0.25)] transition-transform duration-500 hover:-translate-y-2 md:p-9 lg:-translate-y-4 lg:hover:-translate-y-6">
              <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(214,129,79,0.12),transparent_60%)]" />
              <div className="pointer-events-none absolute right-6 top-7 rotate-[8deg] rounded border-2 border-copper-400/70 px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-copper-300">
                Founding price
              </div>

              <div className="relative font-mono text-[10px] uppercase tracking-[0.24em] text-copper-300">
                The founder plan
              </div>
              <h3 className="relative mt-3 font-display text-3xl tracking-tight text-paper">
                Every deck, until funded
              </h3>

              <div className="relative mt-6 flex items-end gap-3">
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.span
                    key={yearly ? "y" : "m"}
                    initial={{ y: 26, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -26, opacity: 0 }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    className="font-display text-7xl leading-none text-copper-300"
                  >
                    {yearly ? "$190" : "$19"}
                  </motion.span>
                </AnimatePresence>
                <span className="mb-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-paper-dim/70">
                  {yearly ? "/year" : "/month"}
                </span>
              </div>
              <div className="relative mt-2 font-mono text-[10px] uppercase tracking-[0.18em] text-paper-dim/70">
                {yearly ? "≈ $15.80/mo · two months free" : "≈ $0.53 per analysis at 3 decks/mo"}
              </div>

              <ul className="relative mt-8 flex-1 space-y-3.5">
                {PRO.map((r) => (
                  <li key={r.t} className="flex items-center gap-3 text-[13.5px] leading-snug text-paper/90">
                    {rowIcon(r.tone)}
                    {r.t}
                  </li>
                ))}
              </ul>

              <div className="relative mt-8">
                <Magnetic strength={0.14} className="block">
                  <Link
                    href="/upload"
                    className="btn-shine group flex w-full items-center justify-center gap-3 rounded-full bg-copper-400 px-7 py-4 text-base font-bold text-ink-950 shadow-[0_0_50px_-12px_rgba(214,129,79,0.65)] transition-colors duration-300 hover:bg-copper-300"
                  >
                    Start free — upgrade when hooked
                    <IconArrow size={17} className="transition-transform group-hover:translate-x-1" />
                  </Link>
                </Magnetic>
              </div>
            </div>
          </ShineBorder>
        </Reveal>
      </div>

      {/* guarantee strip */}
      <Reveal delay={150}>
        <div className="mt-16 grid gap-6 border-y border-paper/[0.08] py-7 sm:grid-cols-3 md:mt-24">
          {[
            ["No card for the free pass", "The first verdict costs you a PDF and 48 seconds."],
            ["Cancel in two clicks", "No retention dark patterns. We keep the score honest, not you hostage."],
            ["Reports stay yours", "Forever-readable, exportable, private to your account."],
          ].map(([h, d]) => (
            <div key={h} className="flex gap-4">
              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-copper-400" />
              <div>
                <div className="font-display text-lg text-paper">{h}</div>
                <p className="mt-1 text-[13px] leading-relaxed text-paper-dim">{d}</p>
              </div>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
