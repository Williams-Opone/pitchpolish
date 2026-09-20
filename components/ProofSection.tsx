"use client";

import { motion } from "motion/react";
import { CountUp, Marquee, Reveal } from "@/components/fx";

/* ------------------------------ case files ------------------------------ */

interface CaseFile {
  id: string;
  stage: string;
  name: string;
  role: string;
  quote: string;
  before: number;
  after: number;
  raised: string;
  fix: string;
  spark: number[];
  stamp: string;
  stampTone: "moss" | "copper";
  cls: string;
  rot: number;
  big?: boolean;
}

const CASES: CaseFile[] = [
  {
    id: "CASE 014",
    stage: "pre-seed · closed",
    name: "Sara Lindqvist",
    role: "Founder, Havn",
    quote:
      "It flagged the missing TAM before my lead investor did. Two weeks of back-and-forth, saved — we closed at the number we asked for.",
    before: 58,
    after: 88,
    raised: "$2.1M",
    fix: "market slide rebuilt · +14 pts",
    spark: [58, 61, 70, 79, 88],
    stamp: "FUNDED",
    stampTone: "moss",
    cls: "md:col-span-5",
    rot: -2.2,
    big: true,
  },
  {
    id: "CASE 021",
    stage: "series a · advancing",
    name: "Marcus Chen",
    role: "CEO, Parcelo",
    quote:
      "The score hurt. That's the point. We rewrote four slides against the red flags and went from cold replies to three partner meetings in a week.",
    before: 49,
    after: 77,
    raised: "3 partner mtgs",
    fix: "4 slides vs red flags · +28 pts",
    spark: [49, 52, 63, 71, 77],
    stamp: "ADVANCING",
    stampTone: "copper",
    cls: "md:col-span-4 md:mt-16",
    rot: 1.8,
  },
  {
    id: "CASE 009",
    stage: "angel · closed",
    name: "Adaeze Obi",
    role: "Co-founder, Brightline",
    quote: "I've paid consultants $15k for less. This thing actually read my deck.",
    before: 63,
    after: 85,
    raised: "$1.4M",
    fix: "ask slide priced · +22 pts",
    spark: [63, 68, 74, 81, 85],
    stamp: "FUNDED",
    stampTone: "moss",
    cls: "md:col-span-3 md:mt-28",
    rot: -1.4,
  },
  {
    id: "CASE 032",
    stage: "seed ext · closed",
    name: "Jonas Weber",
    role: "CTO, Feldwerk",
    quote:
      "Competition slide said 'we have no competitors.' The machine called it naive in crimson. Investors had been thinking exactly that for months.",
    before: 55,
    after: 79,
    raised: "$800K",
    fix: "5 rivals named · +24 pts",
    spark: [55, 60, 66, 73, 79],
    stamp: "EXTENDED",
    stampTone: "copper",
    cls: "md:col-span-4 md:col-start-2 md:mt-6",
    rot: 2,
  },
  {
    id: "CASE 027",
    stage: "series a · closed",
    name: "Priya Raman",
    role: "Founder, Kite Analytics",
    quote:
      "Rescored it four times in one weekend. Each pass the coach told me exactly which sentence was costing me points. Walked into the partner meeting with a 90 and left with a term sheet.",
    before: 66,
    after: 90,
    raised: "$6.0M",
    fix: "financials bottom-up · +24 pts",
    spark: [66, 71, 78, 84, 90],
    stamp: "FUNDED",
    stampTone: "moss",
    cls: "md:col-span-5 md:col-start-7 md:mt-14",
    rot: -1.8,
    big: true,
  },
];

/* ------------------------------ pieces ------------------------------ */

function Spark({ points }: { points: number[] }) {
  const W = 120;
  const H = 30;
  const lo = 40;
  const hi = 100;
  const n = points.length;
  const pts = points.map((p, i) => {
    const x = (i / (n - 1)) * (W - 6) + 3;
    const y = H - 3 - ((Math.min(hi, Math.max(lo, p)) - lo) / (hi - lo)) * (H - 8);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });
  const [lx, ly] = pts[n - 1].split(",").map(Number);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-[30px] w-[120px]" aria-hidden="true">
      <motion.polyline
        points={pts.join(" ")}
        fill="none"
        stroke="#64b57f"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 1.2, delay: 0.4, ease: "easeOut" }}
      />
      <motion.circle
        cx={lx}
        cy={ly}
        r="2.6"
        fill="#a8d5b5"
        initial={{ scale: 0, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 1.5, type: "spring", stiffness: 260, damping: 15 }}
      />
    </svg>
  );
}

function FileCard({ c, i }: { c: CaseFile; i: number }) {
  const moss = c.stampTone === "moss";
  return (
    <motion.article
      initial={{ opacity: 0, y: 80, rotate: c.rot * 3 }}
      whileInView={{ opacity: 1, y: 0, rotate: c.rot }}
      whileHover={{ rotate: 0, y: -10, scale: 1.02 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ type: "spring", stiffness: 80, damping: 15, delay: (i % 3) * 0.12 }}
      className={`relative ${c.cls}`}
    >
      {/* tape strip */}
      <div
        aria-hidden="true"
        className="absolute -top-3.5 left-1/2 z-10 h-7 w-28 -translate-x-1/2 rotate-[-3deg] border border-paper/10 bg-paper/[0.08] backdrop-blur-sm"
      />

      <div className="relative flex h-full flex-col overflow-hidden rounded-xl border border-paper/[0.1] bg-gradient-to-b from-ink-700/90 to-ink-850/95 p-7 shadow-[0_24px_60px_-24px_rgba(0,0,0,0.8)] transition-shadow duration-500 hover:shadow-[0_36px_80px_-24px_rgba(214,129,79,0.2)]">
        {/* faint ruled-paper texture */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.05]"
          style={{ backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 27px, rgba(242,237,227,0.5) 28px)" }}
        />

        {/* stamp */}
        <div
          className={`pointer-events-none absolute right-5 top-6 rotate-[12deg] rounded border-2 px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.3em] opacity-70 transition-all duration-500 group-hover:opacity-100 ${
            moss ? "border-moss-400/70 text-moss-300" : "border-copper-400/70 text-copper-300"
          }`}
          style={{ boxShadow: "inset 0 0 0 1.5px rgba(7,5,4,0.9), inset 0 0 0 2.5px currentColor" }}
        >
          {c.stamp}
        </div>

        {/* meta row */}
        <div className="relative flex items-center gap-3 font-mono text-[9.5px] uppercase tracking-[0.22em] text-paper-dim/70">
          <span className="text-copper-300/90">{c.id}</span>
          <span className="h-px flex-1 bg-paper/[0.1]" />
          <span>{c.stage}</span>
        </div>

        {/* quote */}
        <blockquote
          className={`relative mt-5 flex-1 font-display italic leading-snug text-paper/95 ${
            c.big ? "text-2xl md:text-[1.7rem]" : "text-xl"
          }`}
        >
          “{c.quote}”
        </blockquote>

        {/* evidence row */}
        <div className="relative mt-6 flex items-end justify-between gap-4 border-t border-paper/[0.09] pt-5">
          <div>
            <div className="flex items-baseline gap-2 font-display">
              <span className="text-2xl text-paper-dim/60 line-through decoration-flame-400/60 decoration-2">
                {c.before}
              </span>
              <svg width="20" height="12" viewBox="0 0 20 12" fill="none" className="mb-0.5 text-paper-dim/60" aria-hidden="true">
                <path d="M1 6h15M12 1.5 16.5 6 12 10.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className={`text-3xl ${moss ? "text-moss-300" : "text-copper-300"}`}>{c.after}</span>
            </div>
            <div className="mt-1.5 font-mono text-[9px] uppercase tracking-[0.18em] text-paper-dim/70">
              {c.fix}
            </div>
          </div>
          <div className="flex flex-col items-end gap-1">
            <Spark points={c.spark} />
            <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-paper-dim/60">
              score trajectory
            </span>
          </div>
        </div>

        {/* signature row */}
        <div className="relative mt-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full border border-copper-400/40 bg-copper-400/10 font-display text-base text-copper-200">
              {c.name[0]}
            </span>
            <div>
              <div className="font-display text-[15px] text-paper">{c.name}</div>
              <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-paper-dim">{c.role}</div>
            </div>
          </div>
          <div className={`font-display text-xl ${moss ? "text-moss-300" : "text-copper-300"}`}>{c.raised}</div>
        </div>
      </div>
    </motion.article>
  );
}

/* ------------------------------ section ------------------------------ */

export default function ProofSection() {
  return (
    <section id="stories" className="relative overflow-hidden border-y border-paper/[0.06] bg-ink-950/40 py-24 md:py-32">
      {/* desk-lamp glow */}
      <div aria-hidden="true" className="pointer-events-none absolute -top-40 left-1/2 h-96 w-[52rem] -translate-x-1/2 rounded-full bg-copper-400/[0.06] blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-6 md:px-10">
        <div className="mb-14 flex flex-wrap items-end justify-between gap-8 md:mb-20">
          <Reveal>
            <div className="mb-5 font-mono text-[10.5px] uppercase tracking-[0.28em] text-copper-300">
              05 — After the score
            </div>
            <h2 className="max-w-2xl font-display text-5xl leading-[0.98] tracking-tight text-paper md:text-7xl">
              Heard it from the machine <em className="copper-shimmer">first.</em>
            </h2>
          </Reveal>

          {/* evidence band */}
          <Reveal delay={150}>
            <dl className="flex gap-10 border-l border-paper/[0.1] pl-10">
              <div>
                <dt className="font-mono text-[9.5px] uppercase tracking-[0.24em] text-paper-dim/70">Raised by members</dt>
                <dd className="mt-1 font-display text-4xl text-paper">
                  <CountUp to={14.2} decimals={1} prefix="$" suffix="M" />
                </dd>
              </div>
              <div>
                <dt className="font-mono text-[9.5px] uppercase tracking-[0.24em] text-paper-dim/70">Avg score lift</dt>
                <dd className="mt-1 font-display text-4xl text-moss-300">
                  <CountUp to={19} prefix="+" />
                </dd>
              </div>
              <div>
                <dt className="font-mono text-[9.5px] uppercase tracking-[0.24em] text-paper-dim/70">Decks funded</dt>
                <dd className="mt-1 font-display text-4xl text-copper-300">
                  <CountUp to={38} />
                </dd>
              </div>
            </dl>
          </Reveal>
        </div>

        {/* the scattered case files */}
        <div className="grid gap-10 md:grid-cols-12 md:gap-7">
          {CASES.map((c, i) => (
            <FileCard key={c.id} c={c} i={i} />
          ))}
        </div>

        {/* closings ticker */}
        <div className="mt-20 border-y border-paper/[0.07] py-5 md:mt-28">
          <Marquee
            items={[
              "HAVN — $2.1M pre-seed closed",
              "PARCELO — series a advancing",
              "BRIGHTLINE — $1.4M angel closed",
              "FELDWERK — $800K extension closed",
              "KITE — $6.0M series a closed",
              "LEDGERLINE — rescore 72 → 91",
            ]}
          />
        </div>

        <p className="mt-6 text-center font-mono text-[9.5px] uppercase tracking-[0.22em] text-paper-dim/50">
          Names shared with permission · amounts self-reported · scores from our runtime
        </p>
      </div>
    </section>
  );
}
