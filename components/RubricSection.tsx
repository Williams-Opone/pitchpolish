"use client";

import { useEffect, useRef, useState } from "react";
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import { LampDivider } from "@/components/premium";

interface Dim {
  key: string;
  label: string;
  weight: number;
  desc: string;
  probe: string;
}

const DIMS: Dim[] = [
  { key: "problem", label: "Problem", weight: 12, desc: "Who is in pain, how badly, how often — and what it costs them.", probe: "pain · frequency · dollar cost" },
  { key: "solution", label: "Solution", weight: 12, desc: "The mechanism, in one sentence an investor can repeat back.", probe: "outcome first · one-line mechanism" },
  { key: "market", label: "Market Size", weight: 14, desc: "TAM / SAM / SOM with real dollar figures, not vibes.", probe: "tam · sam · som · citations" },
  { key: "model", label: "Business Model", weight: 12, desc: "Who pays, how much, and what margin you keep.", probe: "pricing · unit economics · margin" },
  { key: "traction", label: "Traction", weight: 14, desc: "Evidence of momentum — any honest number moving up.", probe: "growth · retention · pilots" },
  { key: "team", label: "Team", weight: 10, desc: "Founder–market fit argued with receipts, not assumed.", probe: "exits · domain years · unfair edge" },
  { key: "competition", label: "Competition", weight: 8, desc: "Named rivals and the wedge you drive into each.", probe: "named rivals · wedge · moat" },
  { key: "financials", label: "Financials", weight: 8, desc: "An assumptions-driven 18–24 month model.", probe: "projections · burn · runway" },
  { key: "ask", label: "The Ask", weight: 10, desc: "Amount, use of funds, and the runway it unlocks.", probe: "amount · split · milestone" },
];

const ICON_PATHS: Record<string, string[]> = {
  problem: ["M12 2.8a9.2 9.2 0 1 0 9.2 9.2", "M12 7v5.4", "M12 15.6v.2"],
  solution: ["M8.5 10.5a4 4 0 1 1 4 4", "M12.5 14.5 19 21", "M16 18l2-2"],
  market: ["M12 12h.01", "M8.5 12a3.5 3.5 0 0 1 7 0", "M5.5 12a6.5 6.5 0 0 1 13 0", "M2.5 12a9.5 9.5 0 0 1 19 0"],
  model: ["M12 6.5c4.7 0 8.5-1 8.5-2.3C20.5 3 16.7 2 12 2S3.5 3 3.5 4.2 7.3 6.5 12 6.5Z", "M3.5 4.5v7c0 1.3 3.8 2.3 8.5 2.3s8.5-1 8.5-2.3v-7", "M3.5 15v4.5c0 1.2 3.8 2.3 8.5 2.3s8.5-1.1 8.5-2.3V15"],
  traction: ["M3 20h18", "M5 16l4-4 3 3 6-6", "M15 9h3v3"],
  team: ["M9 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z", "M2.8 19a6.2 6.2 0 0 1 12.4 0", "M16.5 10.6a2.6 2.6 0 1 0-2-4.7", "M15.5 14.6a5.6 5.6 0 0 1 5.7 4.4"],
  competition: ["M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z", "M12 16.5a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9Z", "M12 12h.01"],
  financials: ["M4 20V10", "M9.3 20V4.5", "M14.6 20v-9", "M20 20V7"],
  ask: ["M6 21V3.5", "M6 4h11l-2.6 3.5L17 11H6"],
};

function DimIcon({ k, className = "" }: { k: string; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {(ICON_PATHS[k] ?? []).map((d, i) => (
        <motion.path
          key={d}
          d={d}
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8, delay: 0.15 + i * 0.12, ease: "easeOut" }}
        />
      ))}
    </svg>
  );
}

/* ------------------------------- row ------------------------------- */

function Row({
  d,
  i,
  onActive,
  onSeen,
}: {
  d: Dim;
  i: number;
  onActive: (i: number | null) => void;
  onSeen: (i: number, w: number) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });

  useEffect(() => {
    if (inView) onSeen(i, d.weight);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);

  const onMove = (e: React.PointerEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--rx", `${e.clientX - r.left}px`);
    el.style.setProperty("--ry", `${e.clientY - r.top}px`);
  };

  return (
    <motion.div
      ref={ref}
      onPointerEnter={() => onActive(i)}
      onPointerLeave={() => onActive(null)}
      onPointerMove={onMove}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.75, delay: (i % 3) * 0.07, ease: [0.22, 1, 0.36, 1] }}
      className="group/row relative cursor-default"
    >
      {/* cursor spotlight */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-x-4 inset-y-0 opacity-0 transition-opacity duration-500 group-hover/row:opacity-100"
        style={{
          background:
            "radial-gradient(420px circle at var(--rx, 50%) var(--ry, 50%), rgba(214,129,79,0.08), transparent 65%)",
        }}
      />

      <div className="relative grid grid-cols-[auto_1fr_auto] items-start gap-5 py-8 transition-transform duration-500 group-hover/row:translate-x-1.5 md:gap-8 md:py-9">
        {/* icon + index */}
        <div className="flex flex-col items-center gap-3 pt-1">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-copper-400/20 bg-copper-400/[0.05] text-copper-400/80 shadow-[inset_0_0_18px_rgba(214,129,79,0.08)] transition-all duration-500 group-hover/row:scale-105 group-hover/row:border-copper-400/50 group-hover/row:text-copper-300 md:h-14 md:w-14">
            <DimIcon k={d.key} className="h-6 w-6 md:h-7 md:w-7" />
          </div>
          <span className="font-mono text-[10px] tabular-nums text-paper-dim/60">
            {String(i + 1).padStart(2, "0")}
          </span>
        </div>

        {/* copy */}
        <div className="min-w-0">
          <div className="flex flex-wrap items-baseline gap-x-5 gap-y-1">
            <h3 className="font-display text-3xl tracking-tight text-paper transition-colors duration-400 group-hover/row:text-copper-200 md:text-4xl">
              {d.label}
            </h3>
            <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-paper-dim/70 transition-colors duration-400 group-hover/row:text-copper-300/80">
              probes → {d.probe}
            </span>
          </div>
          <p className="mt-2.5 max-w-xl leading-relaxed text-paper-dim">{d.desc}</p>

          {/* animated weight meter with ruler ticks */}
          <div className="relative mt-5 h-[5px] max-w-md overflow-hidden rounded-full bg-paper/[0.06]">
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 1, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="h-full origin-left rounded-full bg-gradient-to-r from-copper-500 via-copper-400 to-copper-300 shadow-[0_0_14px_rgba(214,129,79,0.5)] transition-shadow duration-500 group-hover/row:shadow-[0_0_22px_rgba(214,129,79,0.75)]"
              style={{ width: `${(d.weight / 14) * 100}%` }}
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 opacity-40"
              style={{
                backgroundImage:
                  "linear-gradient(to right, transparent 0, transparent calc(10% - 1px), rgba(12,10,8,0.9) calc(10% - 1px), rgba(12,10,8,0.9) 10%)",
                backgroundSize: "10% 100%",
              }}
            />
          </div>
        </div>

        {/* ghost weight numeral — fills with copper on hover */}
        <div className="pt-1 text-right">
          <span className="font-display text-6xl leading-none tracking-tight [-webkit-text-stroke:1px_rgba(214,129,79,0.4)] text-transparent transition-all duration-500 group-hover/row:scale-[1.06] group-hover/row:text-copper-300 group-hover/row:[-webkit-text-stroke-color:transparent] md:text-7xl">
            {d.weight}
          </span>
          <span className="block font-mono text-[10px] uppercase tracking-[0.2em] text-paper-dim/60">
            % weight
          </span>
        </div>
      </div>

      {/* dotted hairline */}
      <div className="hairline-row absolute inset-x-0 bottom-0 h-px" />
    </motion.div>
  );
}

/* --------------------------- calibration dial --------------------------- */

function CalibrationPanel({ accrued, active }: { accrued: number; active: number | null }) {
  const reduced = useReducedMotion();
  const mv = useMotionValue(0);
  const rounded = useTransform(mv, (v) => String(Math.round(v)));

  useEffect(() => {
    if (reduced) {
      mv.set(accrued);
      return;
    }
    const controls = animate(mv, accrued, { duration: 0.9, ease: [0.22, 1, 0.36, 1] });
    return () => controls.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accrued, reduced]);

  const R = 42;
  const C = 2 * Math.PI * R;
  const complete = accrued >= 100;

  return (
    <div className="relative overflow-hidden rounded-[1.6rem] border border-paper/[0.08] bg-ink-800/60 p-6 backdrop-blur-sm md:p-7">
      <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(214,129,79,0.08),transparent_60%)]" />

      <div className="relative flex items-center gap-7">
        {/* dial */}
        <div className="relative h-[124px] w-[124px] shrink-0">
          <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
            <circle cx="50" cy="50" r={R} fill="none" stroke="rgba(242,237,227,0.08)" strokeWidth="5" />
            <motion.circle
              cx="50"
              cy="50"
              r={R}
              fill="none"
              stroke={complete ? "#64b57f" : "url(#calibGrad)"}
              strokeWidth="5"
              strokeLinecap="round"
              strokeDasharray={C}
              initial={{ strokeDashoffset: C }}
              animate={{ strokeDashoffset: C - (C * accrued) / 100 }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            />
            <defs>
              <linearGradient id="calibGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f4cdab" />
                <stop offset="100%" stopColor="#b65f33" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.span className="font-display text-4xl leading-none text-paper">{rounded}</motion.span>
            <span className="mt-1 font-mono text-[8.5px] uppercase tracking-[0.28em] text-paper-dim">
              of 100
            </span>
          </div>
        </div>

        {/* weight stack */}
        <div className="flex min-w-0 flex-1 items-stretch gap-5">
          <div className="flex h-40 w-2.5 shrink-0 flex-col gap-[3px]">
            {DIMS.map((d, i) => (
              <div
                key={d.key}
                style={{ flexGrow: d.weight }}
                className={`min-h-[4px] rounded-full transition-all duration-400 ${
                  active === i
                    ? "bg-copper-300 shadow-[0_0_16px_rgba(214,129,79,0.65)]"
                    : "bg-copper-400/25"
                }`}
              />
            ))}
          </div>
          <div className="flex min-w-0 flex-col justify-between py-0.5">
            <div>
              <div className="font-mono text-[9.5px] uppercase tracking-[0.24em] text-paper-dim/70">
                Weight stack
              </div>
              <div className="mt-2 font-display text-xl leading-tight text-paper">
                {active != null ? (
                  <>
                    {DIMS[active].label}{" "}
                    <span className="text-copper-300">×{DIMS[active].weight}%</span>
                  </>
                ) : complete ? (
                  <>Fully calibrated.</>
                ) : (
                  <>Hover a dimension.</>
                )}
              </div>
            </div>
            <div
              className={`inline-flex w-fit items-center gap-2 rounded-full border px-3 py-1.5 font-mono text-[9.5px] uppercase tracking-[0.2em] transition-colors duration-500 ${
                complete
                  ? "border-moss-400/40 bg-moss-400/[0.08] text-moss-300"
                  : "border-paper/10 bg-paper/[0.03] text-paper-dim"
              }`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${complete ? "bg-moss-400" : "bg-copper-400 animate-pulse-dot"}`} />
              {complete ? "Σ 100 — calibrated" : "scroll to calibrate"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------- section ------------------------------- */

export default function RubricSection() {
  const [active, setActive] = useState<number | null>(null);
  const [accrued, setAccrued] = useState(0);
  const seen = useRef<Set<number>>(new Set());

  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const ghostY = useTransform(scrollYProgress, [0, 1], [-70, 90]);
  const ghostRotate = useTransform(scrollYProgress, [0, 1], [8, 14]);

  const onSeen = (i: number, w: number) => {
    if (seen.current.has(i)) return;
    seen.current.add(i);
    setAccrued((a) => a + w);
  };

  return (
    <section
      id="rubric"
      ref={sectionRef}
      className="relative mx-auto max-w-7xl scroll-mt-24 overflow-x-clip px-6 pb-28 pt-10 md:px-10 md:pb-40"
    >
      {/* parallax Σ watermark */}
      <motion.div
        aria-hidden="true"
        style={{ y: ghostY, rotate: ghostRotate }}
        className="pointer-events-none absolute -right-16 top-24 select-none font-display text-[16rem] leading-none text-paper/[0.028] md:text-[24rem]"
      >
        Σ
      </motion.div>

      <LampDivider className="mb-20 md:mb-28" />

      <div className="grid gap-16 lg:grid-cols-12 lg:gap-10">
        {/* sticky column */}
        <div className="lg:col-span-5">
          <div className="space-y-9 lg:sticky lg:top-28">
            <div>
              <div className="mb-5 font-mono text-[10.5px] uppercase tracking-[0.28em] text-copper-300">
                01 — The Rubric
              </div>
              <h2 className="font-display text-5xl leading-[0.95] tracking-tight text-paper md:text-7xl">
                Nine
                <br />
                dimensions.
                <br />
                <em className="copper-shimmer">One number.</em>
              </h2>
              <p className="mt-7 max-w-md text-lg font-light leading-relaxed text-paper-dim">
                No vibes. No “great energy.” Each dimension is weighted the way
                partners actually weigh it — and every score quotes your own text
                back at you.
              </p>
            </div>

            <CalibrationPanel accrued={accrued} active={active} />

            <p className="inline-flex items-center gap-2 rounded-full border border-paper/10 bg-paper/[0.03] px-4 py-2 font-mono text-[10.5px] uppercase tracking-[0.2em] text-paper-dim">
              Weights sum to 100 · Tuned on 1,200+ real decks
            </p>
          </div>
        </div>

        {/* interactive rows */}
        <div className="relative lg:col-span-7">
          <div className="hairline-row absolute inset-x-0 top-0 h-px" />
          {DIMS.map((d, i) => (
            <Row key={d.key} d={d} i={i} onActive={setActive} onSeen={onSeen} />
          ))}

          {/* closing line */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex items-center justify-between pt-8 font-mono text-[10px] uppercase tracking-[0.24em] text-paper-dim/60"
          >
            <span>Σ weights = 100</span>
            <span className="text-copper-300/80">scored per deck · quoted per slide</span>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
