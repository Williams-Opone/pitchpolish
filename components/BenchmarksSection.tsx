"use client";

import { motion } from "motion/react";
import { CountUp, Reveal } from "@/components/fx";

const BENCH = [
  { label: "Problem", funded: 8.6, passed: 5.1 },
  { label: "Solution", funded: 8.2, passed: 5.4 },
  { label: "Market Size", funded: 7.9, passed: 3.2 },
  { label: "Business Model", funded: 7.6, passed: 4.0 },
  { label: "Traction", funded: 7.8, passed: 3.5 },
  { label: "Team", funded: 8.4, passed: 6.0 },
  { label: "Competition", funded: 7.1, passed: 3.8 },
  { label: "Financials", funded: 6.9, passed: 3.1 },
  { label: "The Ask", funded: 8.0, passed: 4.2 },
];

export default function BenchmarksSection() {
  return (
    <section id="benchmarks" className="relative border-y border-paper/[0.06] bg-ink-950/40 py-28 md:py-40">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <div className="grid gap-16 lg:grid-cols-12 lg:gap-10">
          {/* left — sticky narrative */}
          <div className="lg:col-span-5">
            <div className="space-y-9 lg:sticky lg:top-28">
              <Reveal>
                <div className="mb-5 font-mono text-[10.5px] uppercase tracking-[0.28em] text-copper-300">
                  04 — The Benchmarks
                </div>
                <h2 className="font-display text-5xl leading-[0.95] tracking-tight text-paper md:text-7xl">
                  What funded
                  <br />
                  looks <em className="copper-shimmer">like.</em>
                </h2>
                <p className="mt-7 max-w-md text-lg font-light leading-relaxed text-paper-dim">
                  We scored 1,284 decks. 61 went on to close rounds. The gap between the two lines
                  below isn&apos;t talent or luck — it&apos;s discipline, per dimension, and it&apos;s
                  learnable in a weekend.
                </p>
              </Reveal>

              <Reveal delay={140}>
                <dl className="grid grid-cols-3 gap-6 border-t border-paper/[0.08] pt-7">
                  <div>
                    <dt className="font-mono text-[9.5px] uppercase tracking-[0.22em] text-paper-dim/70">Decks scored</dt>
                    <dd className="mt-1 font-display text-4xl text-paper">
                      <CountUp to={1284} />
                    </dd>
                  </div>
                  <div>
                    <dt className="font-mono text-[9.5px] uppercase tracking-[0.22em] text-paper-dim/70">Went on to fund</dt>
                    <dd className="mt-1 font-display text-4xl text-moss-300">
                      <CountUp to={61} />
                    </dd>
                  </div>
                  <div>
                    <dt className="font-mono text-[9.5px] uppercase tracking-[0.22em] text-paper-dim/70">Biggest gap</dt>
                    <dd className="mt-1 font-display text-4xl text-flame-300">
                      <CountUp to={4.7} decimals={1} prefix="×" />
                    </dd>
                  </div>
                </dl>
                <p className="mt-5 font-mono text-[9.5px] uppercase tracking-[0.2em] text-paper-dim/50">
                  market size is where passed decks die · 4.7× spread
                </p>
              </Reveal>
            </div>
          </div>

          {/* right — the two lines */}
          <div className="lg:col-span-7">
            <Reveal>
              <div className="mb-8 flex items-center gap-6 font-mono text-[10px] uppercase tracking-[0.22em]">
                <span className="flex items-center gap-2 text-moss-300">
                  <span className="h-2 w-6 rounded-full bg-moss-400" /> decks that funded
                </span>
                <span className="flex items-center gap-2 text-flame-300/80">
                  <span className="h-2 w-6 rounded-full bg-flame-400/50" /> decks that passed
                </span>
              </div>
            </Reveal>

            <div className="space-y-7">
              {BENCH.map((b, i) => (
                <Reveal key={b.label} delay={Math.min(i * 50, 250)}>
                  <div className="group">
                    <div className="mb-2 flex items-baseline justify-between">
                      <span className="font-display text-xl tracking-tight text-paper transition-colors duration-300 group-hover:text-copper-200 md:text-2xl">
                        {b.label}
                      </span>
                      <span className="font-mono text-[10.5px] tabular-nums tracking-[0.14em] text-paper-dim">
                        <span className="text-moss-300">{b.funded.toFixed(1)}</span>
                        {" vs "}
                        <span className="text-flame-300/80">{b.passed.toFixed(1)}</span>
                      </span>
                    </div>
                    <div className="space-y-1.5">
                      <div className="h-[7px] overflow-hidden rounded-full bg-paper/[0.06]">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${b.funded * 10}%` }}
                          viewport={{ once: true, amount: 0.6 }}
                          transition={{ delay: 0.1 + i * 0.05, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                          className="h-full rounded-full bg-gradient-to-r from-moss-400/70 to-moss-300 shadow-[0_0_14px_rgba(100,181,127,0.4)]"
                        />
                      </div>
                      <div className="h-[7px] overflow-hidden rounded-full bg-paper/[0.06]">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${b.passed * 10}%` }}
                          viewport={{ once: true, amount: 0.6 }}
                          transition={{ delay: 0.2 + i * 0.05, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                          className="h-full rounded-full bg-flame-400/45"
                        />
                      </div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>

            <Reveal delay={200}>
              <p className="mt-10 border-t border-paper/[0.08] pt-6 font-mono text-[9.5px] uppercase tracking-[0.2em] leading-relaxed text-paper-dim/50">
                methodology · means per dimension, 0–10 · self-reported outcomes, verified where
                founders allowed it · your deck is scored against the green line
              </p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
