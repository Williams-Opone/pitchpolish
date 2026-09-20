"use client";

import { motion } from "motion/react";
import { Reveal, ScoreRing } from "@/components/fx";
import { IconFlag } from "@/components/icons";

const SECTIONS = [
  { label: "Problem", score: 9 },
  { label: "Solution", score: 7 },
  { label: "Market", score: 2 },
  { label: "Model", score: 8 },
  { label: "Traction", score: 9 },
  { label: "Team", score: 8 },
];

const FLAGS = [
  { slide: "SLIDE 06 · MARKET", text: "“33 million US SMBs” is an audience, not a market. No TAM/SAM/SOM, no dollar sizing — a partner stops reading here." },
  { slide: "SLIDE 10 · COMPETITION", text: "“We see no competition” reads as naïve. Name five rivals including the spreadsheet status quo, or the wedge doesn't land." },
  { slide: "SLIDE 12 · FINANCIALS", text: "“Projections on request” is never acceptable. The model is the argument; hiding it argues against you." },
];

export default function AnatomySection() {
  return (
    <section id="anatomy" className="relative mx-auto max-w-5xl scroll-mt-24 px-6 pb-32 md:px-10 md:pb-44">
      <Reveal>
        <div className="mb-5 font-mono text-[10.5px] uppercase tracking-[0.28em] text-copper-300">
          03 — The Artifact
        </div>
        <h2 className="max-w-3xl font-display text-5xl leading-[0.95] tracking-tight text-paper md:text-7xl">
          Inside a <em className="copper-shimmer">verdict.</em>
        </h2>
        <p className="mt-6 max-w-2xl text-lg font-light leading-relaxed text-paper-dim">
          Every analysis ships as four layers. Scroll the stack — this is exactly what lands in
          your ledger 48 seconds after upload.
        </p>
      </Reveal>

      {/* stacked, pinned cards */}
      <div className="mt-16 space-y-10 md:mt-24">
        {/* layer 1 — verdict */}
        <div className="sticky" style={{ top: 96 }}>
          <div className="overflow-hidden rounded-[1.8rem] border border-copper-400/25 bg-ink-800 shadow-[0_-20px_60px_-20px_rgba(0,0,0,0.8)]">
            <div className="flex items-center justify-between border-b border-paper/[0.07] px-7 py-4">
              <span className="font-mono text-[10px] uppercase tracking-[0.26em] text-copper-300">Layer 01 — The verdict</span>
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-paper-dim/60">48s after upload</span>
            </div>
            <div className="grid items-center gap-8 p-8 md:grid-cols-[auto_1fr] md:p-10">
              <ScoreRing value={72} size={150} stroke={6} />
              <div>
                <div className="mb-3 inline-flex rounded-full border border-copper-400/30 bg-copper-400/[0.08] px-4 py-1.5 font-mono text-[10px] uppercase tracking-[0.22em] text-copper-300">
                  Promising — fix the gaps
                </div>
                <p className="font-display text-2xl leading-snug tracking-tight text-paper md:text-3xl">
                  “Overall 72/100. Strongest: Problem. Weakest: Market Size. Three red flags would
                  surface in a partner meeting.”
                </p>
                <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.2em] text-paper-dim/60">
                  one number · one band · zero vibes
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* layer 2 — sections */}
        <div className="sticky" style={{ top: 112 }}>
          <div className="overflow-hidden rounded-[1.8rem] border border-paper/[0.1] bg-ink-700 shadow-[0_-20px_60px_-20px_rgba(0,0,0,0.8)]">
            <div className="flex items-center justify-between border-b border-paper/[0.07] px-7 py-4">
              <span className="font-mono text-[10px] uppercase tracking-[0.26em] text-copper-300">Layer 02 — Section scores</span>
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-paper-dim/60">9 dimensions</span>
            </div>
            <div className="grid gap-x-10 gap-y-6 p-8 sm:grid-cols-2 md:p-10">
              {SECTIONS.map((s, i) => (
                <div key={s.label}>
                  <div className="mb-1.5 flex justify-between font-mono text-[10px] uppercase tracking-[0.18em] text-paper-dim">
                    <span>{s.label}</span>
                    <span className={s.score <= 3 ? "text-flame-300" : s.score >= 8 ? "text-moss-300" : "text-copper-300"}>
                      {s.score}/10
                    </span>
                  </div>
                  <div className="h-[5px] overflow-hidden rounded-full bg-paper/[0.07]">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${s.score * 10}%` }}
                      viewport={{ once: true, amount: 0.6 }}
                      transition={{ delay: 0.15 + i * 0.08, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                      className={`h-full rounded-full ${s.score <= 3 ? "bg-flame-400" : s.score >= 8 ? "bg-moss-400" : "bg-copper-400"}`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* layer 3 — flags */}
        <div className="sticky" style={{ top: 128 }}>
          <div className="overflow-hidden rounded-[1.8rem] border border-flame-400/25 bg-ink-850 shadow-[0_-20px_60px_-20px_rgba(0,0,0,0.8)]">
            <div className="flex items-center justify-between border-b border-paper/[0.07] px-7 py-4">
              <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.26em] text-flame-300">
                <IconFlag size={11} /> Layer 03 — Red flags
              </span>
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-paper-dim/60">quoted per slide</span>
            </div>
            <div className="space-y-6 p-8 md:p-10">
              {FLAGS.map((f) => (
                <div key={f.slide} className="border-l-2 border-flame-400/60 pl-5">
                  <div className="mb-1.5 font-mono text-[9.5px] uppercase tracking-[0.24em] text-flame-300/80">{f.slide}</div>
                  <p className="leading-relaxed text-paper/85">{f.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* layer 4 — coach */}
        <div className="sticky" style={{ top: 144 }}>
          <div className="overflow-hidden rounded-[1.8rem] border border-moss-400/25 bg-ink-800 shadow-[0_-20px_60px_-20px_rgba(0,0,0,0.8)]">
            <div className="flex items-center justify-between border-b border-paper/[0.07] px-7 py-4">
              <span className="font-mono text-[10px] uppercase tracking-[0.26em] text-moss-300">Layer 04 — The coach</span>
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-paper-dim/60">grounded answers</span>
            </div>
            <div className="space-y-3 p-8 md:p-10">
              <div className="ml-auto w-fit max-w-[85%] rounded-2xl rounded-br-md bg-paper/[0.08] px-4 py-3 text-sm text-paper">
                Rewrite my market slide like you've read the rest of the deck.
              </div>
              <div className="max-w-[92%] rounded-2xl rounded-bl-md border border-moss-400/20 bg-moss-400/[0.05] px-4 py-3 text-sm leading-relaxed text-paper/90">
                Open on the cost, not the crowd: “US SMBs bleed $1.1B a week on cash-flow blind
                spots.” Then price it — <span className="text-moss-300">TAM $52B</span>,{" "}
                <span className="text-moss-300">SAM $8.3B</span>, <span className="text-moss-300">SOM $410M</span> —
                citing the SBA census and your own pilot data from slide 8.
              </div>
              <div className="flex items-center gap-2 pl-1 font-mono text-[9.5px] uppercase tracking-[0.2em] text-paper-dim/60">
                <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-moss-400" />
                rescore queued · 72 → 91 in four passes
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
