"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Reveal } from "@/components/fx";

const NOTES = [
  {
    tag: "Scoring · 6 min",
    title: "TAM math that survives diligence",
    body: "Bottoms-up only: reachable customers × annual spend. Top-down numbers from analyst PDFs are decoration — partners know it, and so do you. One citation per figure, and a single assumption you'd bet the round on.",
  },
  {
    tag: "Structure · 8 min",
    title: "The twelve-slide seed canon",
    body: "Problem, solution, market, model, traction, team, competition, financials, ask — plus three spares for the demo. Every slide answers exactly one question. If a slide answers two, split it. If it answers none, delete it.",
  },
  {
    tag: "Psychology · 5 min",
    title: "Red flags that kill in thirty seconds",
    body: "“No competition.” “Projections on request.” Adjectives where numbers belong. A partner scans slide three and decides; the meeting is just them confirming it. Fix the scan before you fix the story.",
  },
  {
    tag: "The Ask · 4 min",
    title: "Your ask is a contract, not a wish",
    body: "Amount, instrument, allocation, milestone. “Raising $1.5M to reach 10k customers and 18 months of runway” is a plan. “Raising $2M” is a shrug. Plans get term sheets.",
  },
];

export default function PlaybookSection() {
  const [open, setOpen] = useState(0);

  return (
    <section id="playbook" className="relative mx-auto max-w-7xl scroll-mt-24 px-6 pb-32 md:px-10 md:pb-44">
      <div className="mb-14 flex flex-wrap items-end justify-between gap-8 md:mb-20">
        <Reveal>
          <div className="mb-5 font-mono text-[10.5px] uppercase tracking-[0.28em] text-copper-300">
            Field notes
          </div>
          <h2 className="max-w-2xl font-display text-5xl leading-[0.95] tracking-tight text-paper md:text-7xl">
            The coach&apos;s <em className="copper-shimmer">playbook.</em>
          </h2>
        </Reveal>
        <Reveal delay={120}>
          <p className="max-w-sm text-[15px] font-light leading-relaxed text-paper-dim">
            Excerpts from the rules the machine scores against. Open one — every note ships inside
            your report&apos;s coaching answers.
          </p>
        </Reveal>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {NOTES.map((n, i) => {
          const isOpen = open === i;
          return (
            <Reveal key={n.title} delay={Math.min(i * 80, 240)}>
              <div
                className={`relative overflow-hidden rounded-[1.6rem] border p-8 transition-all duration-500 md:p-9 ${
                  isOpen
                    ? "border-copper-400/35 bg-ink-800 shadow-[0_24px_60px_-24px_rgba(214,129,79,0.25)]"
                    : "border-paper/[0.08] bg-ink-850/70 hover:border-paper/20"
                }`}
              >
                <span className="pointer-events-none absolute -right-3 -top-6 select-none font-display text-[7rem] leading-none text-paper/[0.04]">
                  {String(i + 1).padStart(2, "0")}
                </span>

                <button
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  aria-expanded={isOpen}
                  className="relative flex w-full items-start justify-between gap-6 text-left"
                >
                  <div>
                    <div className="mb-3 font-mono text-[9.5px] uppercase tracking-[0.24em] text-copper-300/80">
                      {n.tag}
                    </div>
                    <h3 className="font-display text-2xl leading-tight tracking-tight text-paper transition-colors duration-300 md:text-3xl">
                      {n.title}
                    </h3>
                  </div>
                  <span
                    className={`mt-2 shrink-0 rounded-full border p-2 transition-all duration-300 ${
                      isOpen ? "rotate-45 border-copper-400/60 text-copper-300" : "border-paper/15 text-paper-dim"
                    }`}
                  >
                    <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                      <path d="M8 2.5v11M2.5 8h11" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                    </svg>
                  </span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="body"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                      className="relative overflow-hidden"
                    >
                      <p className="pt-5 leading-relaxed text-paper-dim">{n.body}</p>
                      <p className="mt-4 font-mono text-[9.5px] uppercase tracking-[0.22em] text-paper-dim/50">
                        — from the coach&apos;s playbook · quoted in {1200 + i * 300}+ reports
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
