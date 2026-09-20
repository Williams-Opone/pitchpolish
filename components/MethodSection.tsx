"use client";

import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  animate,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import { IconCheck } from "@/components/icons";

/* ------------------------------ data ------------------------------ */

const ACTS = [
  {
    n: "01",
    title: "Upload",
    copy: "Drop your PDF deck. Every slide is extracted server-side — nothing is copy-pasted, nothing is skimmed, nothing leaves the building.",
    detail: "Parsing runs in an isolated environment. Your file is read for analysis and never resold, reused, or shown around.",
    gets: ["Text-based PDF in — one-pager to 40 slides", "Structured slide text out, numbers intact", "Private, isolated parse. Deleted on request"],
  },
  {
    n: "02",
    title: "Score",
    copy: "Nine dimensions, weighted the way partners actually weigh them. Section scores from 0–10, one verdict out of 100 — quoted against your own text.",
    detail: "Problem, solution, market, model, traction, team, competition, financials, ask. Each red flag cites the slide that caused it.",
    gets: ["9 weighted dimension scores, 0–10 each", "Red flags in crimson, with receipts", "One verdict out of 100, banded honestly"],
  },
  {
    n: "03",
    title: "Fix",
    copy: "Coach with the machine. It answers from your deck's actual words — then rescores until the number is one you'd put in a cold email.",
    detail: "“How do I fix market size?” returns your missing TAM figures, the exact slide to rebuild, and the sentence to open it with.",
    gets: ["Coach grounded in your 2,381 words", "Slide-level rewrites, not template advice", "Rescore loop until it reads fundable"],
  },
];

/** section bars for the machine: [code, before, after] */
const BARS: [string, number, number][] = [
  ["PRB", 9, 9],
  ["SOL", 7, 8],
  ["MKT", 2, 7],
  ["MOD", 8, 8],
  ["TRC", 9, 9],
  ["TEM", 8, 9],
  ["CMP", 2, 6],
  ["FIN", 4, 8],
  ["ASK", 8, 9],
];

/* --------------------------- small pieces --------------------------- */

function AnimatedNumber({ to, duration = 1.4 }: { to: number; duration?: number }) {
  const reduced = useReducedMotion();
  const mv = useMotionValue(0);
  const [txt, setTxt] = useState("0");

  useEffect(() => {
    if (reduced) {
      setTxt(String(to));
      return;
    }
    const controls = animate(mv, to, { duration, ease: [0.22, 1, 0.36, 1] });
    const unsub = mv.on("change", (v) => setTxt(String(Math.round(v))));
    return () => {
      controls.stop();
      unsub();
    };
  }, [to, duration, reduced, mv]);

  return <>{txt}</>;
}

const barTone = (v: number) =>
  v >= 8 ? "bg-moss-400" : v <= 3 ? "bg-flame-400" : "bg-copper-400";

/* ------------------------------ stage 0 ------------------------------ */

function StageExtract() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* sheet feeding the slot */}
      <div className="relative flex h-56 items-end justify-center overflow-hidden rounded-xl border border-paper/[0.08] bg-ink-950/70">
        <div className="absolute inset-x-0 top-0 h-full bg-[radial-gradient(circle_at_50%_78%,rgba(214,129,79,0.14),transparent_60%)]" />
        {/* the sheet */}
        <motion.div
          initial={{ y: -120, rotate: -3, opacity: 0 }}
          animate={{ y: 0, rotate: 0, opacity: 1 }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          className="relative mb-14 w-28 rounded-md border border-paper/15 bg-paper/[0.06] p-2.5 shadow-2xl"
        >
          <div className="mb-1.5 h-1.5 w-3/4 rounded bg-paper/25" />
          <div className="mb-1 h-1 w-full rounded bg-paper/15" />
          <div className="mb-1 h-1 w-full rounded bg-paper/15" />
          <div className="h-1 w-2/3 rounded bg-paper/15" />
          <div className="absolute -right-1.5 -top-1.5 rounded-sm bg-copper-400 px-1 py-0.5 font-mono text-[7px] font-bold text-ink-950">
            PDF
          </div>
        </motion.div>
        {/* scan beam */}
        <div
          aria-hidden="true"
          className="absolute left-0 h-8 w-full animate-scan bg-gradient-to-b from-transparent via-copper-400/25 to-transparent"
        />
        {/* the slot */}
        <div className="absolute bottom-8 left-1/2 h-[3px] w-40 -translate-x-1/2 rounded-full bg-copper-400 shadow-[0_0_24px_rgba(214,129,79,0.8)]" />
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 font-mono text-[8.5px] uppercase tracking-[0.28em] text-paper-dim/70">
          intake
        </div>
      </div>

      {/* terminal */}
      <div className="flex flex-col justify-between rounded-xl border border-paper/[0.08] bg-ink-950/70 p-5 font-mono text-[11px] leading-relaxed">
        <div>
          <div className="mb-3 flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-flame-400/70" />
            <span className="h-2 w-2 rounded-full bg-copper-400/70" />
            <span className="h-2 w-2 rounded-full bg-moss-400/70" />
          </div>
          {["$ pitchpolish extract seed-v4.pdf", "✓ 14 pages parsed", "✓ 2,381 words · 9 tables kept", "→ slide 06 “Market” — no dollar sizing", "→ slide 08 “Traction” — 6 metrics found"].map(
            (line, i) => (
              <motion.p
                key={line}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + i * 0.35, duration: 0.4 }}
                className={i === 0 ? "text-copper-300" : line.startsWith("✓") ? "text-moss-300/90" : "text-paper-dim/80"}
              >
                {line}
              </motion.p>
            )
          )}
        </div>
        <div className="mt-4 border-t border-paper/[0.08] pt-3 text-paper-dim">
          words extracted —{" "}
          <span className="text-paper">
            <AnimatedNumber to={2381} duration={2} />
          </span>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------ stage 1 ------------------------------ */

function StageScore() {
  return (
    <div className="grid gap-6 md:grid-cols-[1fr_auto]">
      <div className="grid grid-cols-3 gap-x-5 gap-y-4 rounded-xl border border-paper/[0.08] bg-ink-950/70 p-5">
        {BARS.map(([code, before], i) => (
          <div key={code}>
            <div className="mb-1.5 flex justify-between font-mono text-[9px] uppercase tracking-[0.18em] text-paper-dim">
              <span>{code}</span>
              <span className={before <= 3 ? "text-flame-300" : "text-paper-dim"}>{before}/10</span>
            </div>
            <div className="h-[5px] overflow-hidden rounded-full bg-paper/[0.07]">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${before * 10}%` }}
                transition={{ delay: 0.3 + i * 0.09, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className={`h-full rounded-full ${barTone(before)}`}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col items-center justify-between gap-4 rounded-xl border border-paper/[0.08] bg-ink-950/70 p-5 md:w-44">
        <div className="text-center">
          <div className="font-display text-6xl leading-none text-copper-300">
            <AnimatedNumber to={72} duration={1.6} />
          </div>
          <div className="mt-1 font-mono text-[9px] uppercase tracking-[0.26em] text-paper-dim">
            verdict / 100
          </div>
        </div>
        <div className="w-full space-y-2">
          {["No TAM / SAM / SOM", "No named incumbents"].map((f, i) => (
            <motion.div
              key={f}
              initial={{ opacity: 0, scale: 0.8, x: 12 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ delay: 1.1 + i * 0.3, type: "spring", stiffness: 260, damping: 18 }}
              className="flex items-center gap-2 rounded-lg border border-flame-400/25 bg-flame-400/[0.08] px-2.5 py-1.5"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-flame-400" />
              <span className="font-mono text-[8.5px] uppercase tracking-[0.14em] text-flame-300">{f}</span>
            </motion.div>
          ))}
        </div>
        <div className="font-mono text-[8.5px] uppercase tracking-[0.2em] text-paper-dim/70">
          promising — fix the gaps
        </div>
      </div>
    </div>
  );
}

/* ------------------------------ stage 2 ------------------------------ */

function StageFix() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="space-y-3 rounded-xl border border-paper/[0.08] bg-ink-950/70 p-5">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="ml-auto w-fit max-w-[85%] rounded-2xl rounded-br-md bg-paper/[0.08] px-3.5 py-2.5 text-[12px] text-paper"
        >
          How do I fix my market slide?
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.4 }}
          className="max-w-[92%] rounded-2xl rounded-bl-md border border-copper-400/15 bg-copper-400/[0.05] px-3.5 py-2.5 text-[12px] leading-relaxed text-paper/90"
        >
          Slide 6 says “33M SMBs” but never prices it. Rebuild: <span className="text-copper-300">TAM $52B</span>,{" "}
          <span className="text-copper-300">SAM $8.3B</span>, <span className="text-copper-300">SOM $410M</span>. Cite
          SBA census + your pilot data.
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3, duration: 0.5 }}
          className="flex items-center gap-2 pl-1 font-mono text-[8.5px] uppercase tracking-[0.2em] text-paper-dim/60"
        >
          <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-copper-400" />
          grounded in your deck · rescore queued
        </motion.div>
      </div>

      <div className="flex flex-col justify-between rounded-xl border border-paper/[0.08] bg-ink-950/70 p-5">
        <div className="flex items-end justify-center gap-4 py-2">
          <span className="font-display text-5xl leading-none text-paper-dim/50 line-through decoration-flame-400/70 decoration-2">
            72
          </span>
          <svg width="26" height="14" viewBox="0 0 26 14" fill="none" className="mb-2 text-paper-dim" aria-hidden="true">
            <path d="M1 7h21M17 2l6 5-6 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <motion.span
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.8, type: "spring", stiffness: 200, damping: 14 }}
            className="font-display text-6xl leading-none text-moss-300 drop-shadow-[0_0_18px_rgba(100,181,127,0.45)]"
          >
            91
          </motion.span>
        </div>
        <div className="space-y-3">
          {BARS.filter(([, b, a]) => a !== b).map(([code, , after], i) => (
            <div key={code}>
              <div className="mb-1 flex justify-between font-mono text-[9px] uppercase tracking-[0.18em]">
                <span className="text-moss-300">{code} · fixed</span>
                <span className="text-paper-dim">{after}/10</span>
              </div>
              <div className="h-[5px] overflow-hidden rounded-full bg-paper/[0.07]">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${after * 10}%` }}
                  transition={{ delay: 1 + i * 0.15, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                  className="h-full rounded-full bg-moss-400"
                />
              </div>
            </div>
          ))}
        </div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6, duration: 0.5 }}
          className="mx-auto mt-4 inline-flex items-center gap-2 rounded-full border border-moss-400/40 bg-moss-400/[0.08] px-3.5 py-1.5 font-mono text-[9px] uppercase tracking-[0.2em] text-moss-300"
        >
          <IconCheck size={11} /> ready for partners
        </motion.div>
      </div>
    </div>
  );
}

/* ------------------------------ machine ------------------------------ */

function Machine({ stage }: { stage: number }) {
  const STAGE_LABEL = ["extract", "score", "fix"];
  return (
    <div className="relative overflow-hidden rounded-[1.8rem] border border-paper/[0.09] bg-gradient-to-b from-ink-800/90 to-ink-900/95 shadow-2xl">
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(#f2ede3 1px, transparent 1px), linear-gradient(90deg, #f2ede3 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />
      {/* header */}
      <div className="relative flex items-center justify-between border-b border-paper/[0.07] px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-flame-400/70" />
            <span className="h-2 w-2 rounded-full bg-copper-400/70" />
            <span className="h-2 w-2 rounded-full bg-moss-400/70" />
          </div>
          <span className="font-mono text-[9.5px] uppercase tracking-[0.26em] text-paper-dim">
            pitchpolish · runtime
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          {STAGE_LABEL.map((s, i) => (
            <span
              key={s}
              className={`rounded-full px-3 py-1 font-mono text-[9px] uppercase tracking-[0.18em] transition-all duration-500 ${
                stage === i
                  ? "bg-copper-400 text-ink-950 shadow-[0_0_18px_rgba(214,129,79,0.5)]"
                  : "bg-paper/[0.05] text-paper-dim/70"
              }`}
            >
              {s}
            </span>
          ))}
        </div>
      </div>

      {/* stage view */}
      <div className="relative min-h-[380px] p-6 md:p-7">
        <AnimatePresence mode="wait">
          <motion.div
            key={stage}
            initial={{ opacity: 0, y: 22, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -18, scale: 0.99 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            {stage === 0 ? <StageExtract /> : stage === 1 ? <StageScore /> : <StageFix />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ------------------------------ section ------------------------------ */

export default function MethodSection() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [scrollStage, setScrollStage] = useState(0);
  const [override, setOverride] = useState<number | null>(null);
  const stage = override ?? scrollStage;

  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start 0.65", "end 0.5"],
  });
  const railScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setScrollStage(v < 0.34 ? 0 : v < 0.67 ? 1 : 2);
  });

  return (
    <section id="method" className="relative mx-auto max-w-7xl scroll-mt-24 px-6 pb-28 md:px-10 md:pb-40">
      {/* heading */}
      <div className="mb-16 md:mb-20">
        <div className="mb-5 font-mono text-[10.5px] uppercase tracking-[0.28em] text-copper-300">
          02 — The Machine
        </div>
        <h2 className="max-w-3xl font-display text-5xl leading-[0.98] tracking-tight text-paper md:text-7xl">
          From PDF to verdict, <em className="copper-shimmer">in three acts.</em>
        </h2>
      </div>

      <div ref={trackRef} className="grid gap-12 lg:grid-cols-12 lg:gap-10">
        {/* sticky machine */}
        <div className="lg:col-span-6">
          <div className="lg:sticky lg:top-24">
            <Machine stage={stage} />
            <p className="mt-4 text-center font-mono text-[9.5px] uppercase tracking-[0.24em] text-paper-dim/60">
              live run · ledgerline seed v4 · scroll to advance
            </p>
          </div>
        </div>

        {/* act track */}
        <div className="relative lg:col-span-6">
          {/* rail */}
          <div className="absolute bottom-6 left-[13px] top-6 w-px bg-paper/[0.08] max-lg:hidden">
            <motion.div
              style={{ scaleY: railScale }}
              className="h-full w-full origin-top bg-gradient-to-b from-copper-300 to-copper-500"
            />
          </div>

          {ACTS.map((act, i) => (
            <div
              key={act.n}
              onPointerEnter={() => setOverride(i)}
              onPointerLeave={() => setOverride(null)}
              className={`relative min-h-[62vh] py-10 pl-0 transition-opacity duration-700 lg:min-h-[58vh] lg:pl-14 ${
                stage === i ? "opacity-100" : "opacity-35"
              }`}
            >
              {/* rail node */}
              <div
                className={`absolute left-0 top-14 hidden h-[27px] w-[27px] items-center justify-center rounded-full border transition-all duration-500 lg:flex ${
                  stage === i
                    ? "border-copper-300 bg-copper-400/20 shadow-[0_0_20px_rgba(214,129,79,0.5)]"
                    : "border-paper/15 bg-ink-900"
                }`}
              >
                <span className={`h-2 w-2 rounded-full transition-colors ${stage === i ? "bg-copper-300" : "bg-paper/25"}`} />
              </div>

              <div className="relative">
                <span className="pointer-events-none absolute -top-8 right-0 select-none font-display text-[7rem] leading-none text-paper/[0.04] md:text-[9rem]">
                  {act.n}
                </span>
                <div className="font-mono text-[10px] uppercase tracking-[0.26em] text-copper-300/80">
                  act {act.n}
                </div>
                <h3 className="mt-3 font-display text-5xl tracking-tight text-paper transition-colors duration-500 md:text-6xl">
                  {act.title}
                  <span className="text-copper-400">.</span>
                </h3>
                <p className="mt-5 max-w-lg text-lg leading-relaxed text-paper/85">{act.copy}</p>
                <p className="mt-3 max-w-lg text-sm leading-relaxed text-paper-dim">{act.detail}</p>

                <ul className="mt-7 space-y-2.5">
                  {act.gets.map((g) => (
                    <li key={g} className="flex items-center gap-3 text-[13.5px] font-medium text-paper-dim">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-copper-400/30 bg-copper-400/[0.08] text-copper-300">
                        <IconCheck size={10} />
                      </span>
                      {g}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
