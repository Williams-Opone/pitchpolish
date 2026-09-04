"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { AnimatePresence, motion, useScroll, useSpring } from "motion/react";
import Background3D from "@/components/Background3D";
import TiltCard from "@/components/TiltCard";
import { CountUp, Marquee, Reveal, Scramble, ScoreRing } from "@/components/fx";
import {
  LampDivider,
  Magnetic,
  ShineBorder,
  SpotlightCard,
  TextGenerateEffect,
} from "@/components/premium";
import {
  IconArrow,
  IconCheck,
  IconCoach,
  IconExtract,
  IconFlag,
  IconGauge,
  IconLock,
  IconPlus,
} from "@/components/icons";

/* ---------------------------------- data ---------------------------------- */

const HERO_SECTIONS = [
  { label: "Problem", score: 9 },
  { label: "Market Size", score: 2 },
  { label: "Competition", score: 2 },
  { label: "Solution", score: 7 },
  { label: "Team", score: 8 },
  { label: "Financials", score: 4 },
];

const RUBRIC = [
  { label: "Problem", weight: 12, desc: "Who is in pain, how badly, how often — and what it costs them." },
  { label: "Solution", weight: 12, desc: "The mechanism, in one sentence an investor can repeat back." },
  { label: "Market Size", weight: 14, desc: "TAM / SAM / SOM with real dollar figures, not vibes." },
  { label: "Business Model", weight: 12, desc: "Who pays, how much, and what margin you keep." },
  { label: "Traction", weight: 14, desc: "Evidence of momentum — any honest number moving up." },
  { label: "Team", weight: 10, desc: "Founder–market fit argued with receipts, not assumed." },
  { label: "Competition", weight: 8, desc: "Named rivals and the wedge you drive into each." },
  { label: "Financials", weight: 8, desc: "An assumptions-driven 18–24 month model." },
  { label: "The Ask", weight: 10, desc: "Amount, use of funds, and the runway it unlocks." },
];

const STEPS = [
  {
    n: "01",
    label: "Upload",
    desc: "Drop your PDF deck. Every slide is extracted server-side — nothing is copy-pasted, nothing is skimmed.",
    detail: "Parsing runs in an isolated environment. Your file is read for analysis and never resold, reused, or shown around.",
  },
  {
    n: "02",
    label: "Score",
    desc: "Nine dimensions, weighted the way partners actually weigh them. Section scores from 0–10, one verdict out of 100.",
    detail: "Problem, solution, market, model, traction, team, competition, financials, ask — each quoted against your own text.",
  },
  {
    n: "03",
    label: "Fix",
    desc: "Coach with the machine. Ask anything — the answers are grounded in your deck's actual words, not template advice.",
    detail: "“How do I fix market size?” returns your missing TAM figures and the exact slide to rebuild.",
  },
];

const QUOTES = [
  {
    q: "It flagged the missing TAM before my lead investor did. Two weeks of back-and-forth, saved. We closed the round at the number we asked for.",
    name: "Sara Lindqvist",
    role: "Founder, Havn — closed $2.1M pre-seed",
  },
  {
    q: "The score hurt. That's the point. We rewrote four slides against the red flags and went from cold replies to three partner meetings in a week.",
    name: "Marcus Chen",
    role: "CEO, Parcelo — Series A in motion",
  },
  {
    q: "I've paid consultants $15k for less. The chat remembers my deck word-for-word and answers like someone who actually read it.",
    name: "Adaeze Obi",
    role: "Co-founder, Brightline Health",
  },
];

const FAQS = [
  {
    q: "Is my deck used to train anything?",
    a: "No. Your PDF is parsed in an isolated server environment, scored, and kept private to your reports. It is never used for model training and never visible to other users.",
  },
  {
    q: "What counts as a 'deck'?",
    a: "Any text-based PDF from a one-pager to a 40-slide Series A memo. Scanned image-only PDFs can't be read — we'll tell you immediately instead of charging you for a guess.",
  },
  {
    q: "How is the score calculated?",
    a: "Nine weighted dimensions — problem, solution, market, model, traction, team, competition, financials, ask. Each is scored 0–10 against signals in your actual text, then weighted into a 0–100 verdict.",
  },
  {
    q: "Can it really replace VC feedback?",
    a: "It replaces the first, brutal pass — the one where most decks die silently. It won't take the meeting for you, but you'll walk into it with the obvious kills already fixed.",
  },
  {
    q: "What happens after the free analysis?",
    a: "$19/month unlocks unlimited analyses, the context-aware coach, and executive summaries. Cancel in two clicks — your reports stay readable forever.",
  },
];

const chipTone = (score: number) =>
  score >= 8
    ? { text: "text-moss-300", bg: "bg-moss-400/10", label: "Strong" }
    : score <= 3
      ? { text: "text-flame-300", bg: "bg-flame-400/10", label: "Missing data" }
      : { text: "text-copper-300", bg: "bg-copper-400/10", label: "Needs depth" };

/* ---------------------------------- page ---------------------------------- */

export default function Home() {
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [progress, setProgress] = useState(0);
  const [sampleLoading, setSampleLoading] = useState(false);
  const [faqOpen, setFaqOpen] = useState<number>(0);

  const timelineRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ["start 0.8", "end 0.55"],
  });
  const lineScale = useSpring(scrollYProgress, { stiffness: 90, damping: 22 });

  useEffect(() => {
    setLoaded(true);
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? (window.scrollY / max) * 100 : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const openSample = async () => {
    if (sampleLoading) return;
    setSampleLoading(true);
    try {
      const res = await fetch("/api/sample", { method: "POST" });
      const data = (await res.json()) as { id?: number };
      if (data.id) router.push(`/report/${data.id}`);
    } catch {
      /* network hiccup — button simply re-enables */
    } finally {
      setSampleLoading(false);
    }
  };

  return (
    <>
      <Background3D />
      <div className="grain pointer-events-none fixed inset-0 z-[9999] opacity-[0.045]" aria-hidden="true" />

      <main className={`relative z-10 min-h-screen overflow-x-hidden ${loaded ? "is-loaded" : ""}`}>
        {/* ================================ NAV ================================ */}
        <nav className="sticky top-0 z-50 border-b border-paper/[0.07] bg-ink-900/75 backdrop-blur-xl">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 md:px-10">
            <Link href="/" className="font-display text-[1.65rem] tracking-tight text-paper md:text-3xl">
              Pitch<span className="italic text-copper-300">Polish</span>
              <span className="text-copper-400">.</span>
            </Link>

            <div className="hidden items-center gap-9 text-[13px] font-semibold tracking-wide text-paper-dim lg:flex">
              <a href="#rubric" className="navlink transition-colors hover:text-paper">The Rubric</a>
              <a href="#method" className="navlink transition-colors hover:text-paper">Method</a>
              <a href="#pricing" className="navlink transition-colors hover:text-paper">Pricing</a>
              <Link href="/dashboard" className="navlink transition-colors hover:text-paper">Reports</Link>
            </div>

            <div className="flex items-center gap-3">
              <Magnetic strength={0.2} className="hidden md:inline-block">
                <Link
                  href="/upload"
                  className="btn-shine group inline-flex items-center gap-2 rounded-full bg-copper-400 px-5 py-2.5 text-sm font-bold text-ink-950 shadow-[0_0_36px_-10px_rgba(214,129,79,0.6)] transition-colors duration-300 hover:bg-copper-300"
                >
                  Start free analysis
                  <IconArrow size={15} className="transition-transform group-hover:translate-x-0.5" />
                </Link>
              </Magnetic>
              <button
                onClick={() => setMobileOpen((v) => !v)}
                className="rounded-full border border-paper/15 p-2.5 text-paper transition hover:border-copper-400/50 lg:hidden"
                aria-label={mobileOpen ? "Close menu" : "Open menu"}
                aria-expanded={mobileOpen}
              >
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                  {mobileOpen ? (
                    <path d="M3 3l12 12M15 3L3 15" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
                  ) : (
                    <path d="M2 5h14M2 9h14M2 13h9" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
                  )}
                </svg>
              </button>
            </div>
          </div>

          <div className="h-px w-full bg-paper/[0.04]">
            <div className="h-px bg-copper-400/80 transition-[width] duration-150" style={{ width: `${progress}%` }} />
          </div>

          {mobileOpen && (
            <div className="border-b border-paper/10 bg-ink-900/95 px-6 py-8 backdrop-blur-2xl lg:hidden">
              <div className="flex flex-col gap-6 font-display text-2xl">
                <a href="#rubric" onClick={() => setMobileOpen(false)} className="text-paper transition hover:text-copper-300">The Rubric</a>
                <a href="#method" onClick={() => setMobileOpen(false)} className="text-paper transition hover:text-copper-300">Method</a>
                <a href="#pricing" onClick={() => setMobileOpen(false)} className="text-paper transition hover:text-copper-300">Pricing</a>
                <Link href="/dashboard" onClick={() => setMobileOpen(false)} className="text-paper transition hover:text-copper-300">Reports</Link>
                <Link
                  href="/upload"
                  onClick={() => setMobileOpen(false)}
                  className="mt-2 rounded-full bg-copper-400 px-6 py-3.5 text-center text-lg font-bold text-ink-950"
                >
                  Start free analysis
                </Link>
              </div>
            </div>
          )}
        </nav>

        {/* ================================ HERO ================================ */}
        <section className="relative mx-auto max-w-7xl px-6 pb-20 pt-16 md:px-10 md:pb-28 md:pt-24">
          <div className="grid items-start gap-16 lg:grid-cols-2 lg:gap-20">
            {/* left — words */}
            <div className="order-2 lg:order-1">
              <Reveal>
                <div className="mb-9 inline-flex items-center gap-2.5 rounded-full border border-copper-400/25 bg-copper-400/[0.06] px-4 py-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-copper-400 animate-pulse-dot" />
                  <span className="font-mono text-[10.5px] font-semibold uppercase tracking-[0.24em] text-copper-300">
                    <Scramble text="AI VC Consulting — For Founders" />
                  </span>
                </div>
              </Reveal>

              <h1 className="mb-9 font-display text-[3.6rem] leading-[0.92] tracking-tight text-paper sm:text-7xl lg:text-[5.4rem] xl:text-[6.2rem]">
                <span className="mask-line">
                  <span style={{ "--d": "0.05s" } as CSSProperties}>Not a pitch.</span>
                </span>
                <span className="mask-line">
                  <span style={{ "--d": "0.18s" } as CSSProperties}>
                    <em className="copper-shimmer">A score.</em>
                  </span>
                </span>
              </h1>

              <TextGenerateEffect
                text="Upload your deck. The machine reads every slide, scores it against investor benchmarks across nine dimensions, and tells you exactly what to fix — quoting your own deck back at you."
                delay={0.25}
                className="mb-10 max-w-xl text-lg font-light leading-relaxed text-paper-dim md:text-xl"
              />

              <Reveal delay={320}>
                <div className="flex flex-wrap items-center gap-4">
                  <Magnetic strength={0.18}>
                    <Link
                      href="/upload"
                      className="btn-shine group inline-flex items-center gap-3 rounded-full bg-copper-400 px-8 py-4 text-base font-bold text-ink-950 shadow-[0_0_60px_-14px_rgba(214,129,79,0.65)] transition-colors duration-300 hover:bg-copper-300 md:text-lg"
                    >
                      Analyze your deck
                      <IconArrow size={19} className="transition-transform duration-300 group-hover:translate-x-1.5" />
                    </Link>
                  </Magnetic>
                  <button
                    onClick={openSample}
                    disabled={sampleLoading}
                    className="inline-flex items-center gap-3 rounded-full border border-paper/15 bg-paper/[0.04] px-8 py-4 text-base font-semibold text-paper backdrop-blur-sm transition-all duration-300 hover:border-copper-400/40 hover:bg-paper/[0.07] md:text-lg disabled:pointer-events-none disabled:opacity-60"
                  >
                    {sampleLoading ? "Preparing sample…" : "Read a sample report"}
                  </button>
                </div>
              </Reveal>

              <Reveal delay={440}>
                <dl className="mt-14 flex flex-wrap items-center gap-x-10 gap-y-5 border-t border-paper/[0.08] pt-8">
                  <div>
                    <dt className="font-mono text-[10px] uppercase tracking-[0.25em] text-paper-dim/70">Decks scored</dt>
                    <dd className="mt-1 font-display text-3xl text-paper">
                      <CountUp to={1284} />
                      <span className="text-copper-400">+</span>
                    </dd>
                  </div>
                  <div>
                    <dt className="font-mono text-[10px] uppercase tracking-[0.25em] text-paper-dim/70">Dimensions</dt>
                    <dd className="mt-1 font-display text-3xl text-paper">9</dd>
                  </div>
                  <div>
                    <dt className="font-mono text-[10px] uppercase tracking-[0.25em] text-paper-dim/70">Average run</dt>
                    <dd className="mt-1 font-display text-3xl text-paper">
                      <CountUp to={48} suffix="s" />
                    </dd>
                  </div>
                </dl>
              </Reveal>
            </div>

            {/* right — the artifact */}
            <div className="order-1 lg:order-2">
              <Reveal delay={150}>
                <div className="relative">
                  {/* floating verdict chips */}
                  <div className="absolute -left-4 top-10 z-20 hidden animate-float-slow xl:block" style={{ animationDelay: "0.8s" }}>
                    <div className="rounded-2xl border border-moss-400/25 bg-ink-800/90 px-4 py-3 shadow-2xl backdrop-blur">
                      <div className="font-mono text-[9px] uppercase tracking-[0.22em] text-moss-300">After fixes</div>
                      <div className="mt-0.5 font-display text-xl text-paper">72 → 91</div>
                    </div>
                  </div>
                  <div className="absolute -right-3 bottom-16 z-20 hidden animate-float-slow xl:block" style={{ animationDelay: "1.7s" }}>
                    <div className="flex items-center gap-2 rounded-2xl border border-flame-400/25 bg-ink-800/90 px-4 py-3 shadow-2xl backdrop-blur">
                      <IconFlag size={13} className="text-flame-300" />
                      <div>
                        <div className="font-mono text-[9px] uppercase tracking-[0.22em] text-flame-300">Red flag</div>
                        <div className="mt-0.5 text-xs font-semibold text-paper">No TAM/SAM/SOM</div>
                      </div>
                    </div>
                  </div>

                  <TiltCard className="rounded-[2rem]">
                    <ShineBorder radius="2rem" duration={6}>
                      <div className="relative overflow-hidden rounded-[2rem] border border-paper/10 bg-gradient-to-br from-ink-700 to-ink-850 p-7 shadow-2xl md:p-9">
                        {/* blueprint grid */}
                        <div
                          aria-hidden="true"
                          className="absolute inset-0 opacity-[0.035]"
                          style={{
                            backgroundImage:
                              "linear-gradient(#f2ede3 1px, transparent 1px), linear-gradient(90deg, #f2ede3 1px, transparent 1px)",
                            backgroundSize: "30px 30px",
                          }}
                        />
                        {/* scan beam */}
                        <div
                          aria-hidden="true"
                          className="absolute left-0 h-14 w-full animate-scan bg-gradient-to-b from-transparent via-copper-400/[0.08] to-transparent"
                        />

                        <div className="relative z-10">
                          <div className="mb-7 flex items-start justify-between gap-4">
                            <div>
                              <div className="mb-2 font-mono text-[9.5px] uppercase tracking-[0.26em] text-paper-dim/80">
                                Ledgerline — Seed v4 · 14 slides
                              </div>
                              <h3 className="font-display text-3xl tracking-tight text-paper md:text-4xl">Report card</h3>
                            </div>
                            <ScoreRing value={72} size={116} stroke={5} />
                          </div>

                          <div className="grid grid-cols-2 gap-2.5 md:grid-cols-3">
                            {HERO_SECTIONS.map((s) => {
                              const t = chipTone(s.score);
                              return (
                                <div
                                  key={s.label}
                                  className="rounded-xl border border-paper/[0.07] bg-ink-950/70 p-3 transition-colors duration-300 hover:border-copper-400/30"
                                >
                                  <div className="mb-1.5 flex items-center justify-between">
                                    <span className="text-[11px] font-semibold text-paper/85">{s.label}</span>
                                    <span className={`rounded-md px-1.5 py-0.5 font-mono text-[10px] font-bold ${t.text} ${t.bg}`}>
                                      {s.score}/10
                                    </span>
                                  </div>
                                  <p className="text-[10px] leading-snug text-paper-dim/80">{t.label}</p>
                                </div>
                              );
                            })}
                          </div>

                          <div className="mt-6 border-t border-paper/[0.09] pt-5">
                            <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold text-flame-300">
                              <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-flame-400" />
                              Critical red flags
                            </h4>
                            <ul className="space-y-1.5 font-mono text-[11px] leading-relaxed text-flame-300/75">
                              <li>· Market size has no TAM/SAM/SOM — partners pass on sight</li>
                              <li>· Competition slide names no incumbents</li>
                              <li>· Financial projections say “on request” — never say that</li>
                            </ul>
                          </div>

                          <div className="mt-5 flex items-center justify-between border-t border-paper/[0.09] pt-4 font-mono text-[10px] uppercase tracking-[0.2em] text-paper-dim/60">
                            <span>Generated in 47s</span>
                            <span className="flex items-center gap-1.5">
                              <IconLock size={11} className="text-copper-400/70" /> Private by default
                            </span>
                          </div>
                        </div>
                      </div>
                    </ShineBorder>
                  </TiltCard>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ================================ MARQUEE ================================ */}
        <section className="border-y border-paper/[0.06] bg-ink-950/50 py-6">
          <Marquee
            items={[
              "Benchmarked against seed decks",
              "YC application patterns",
              "Series A memos",
              "Angel syndicate criteria",
              "Accelerator demo days",
              "Pre-seed one-pagers",
              "Bridge round narratives",
            ]}
          />
        </section>

        {/* ================================ RUBRIC ================================ */}
        <section id="rubric" className="relative mx-auto max-w-7xl scroll-mt-24 px-6 pb-24 pt-10 md:px-10 md:pb-36">
          <LampDivider className="mb-24 md:mb-36" />
          <div className="grid gap-14 lg:grid-cols-12 lg:gap-10">
            <div className="lg:col-span-5">
              <div className="lg:sticky lg:top-32">
                <Reveal>
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
                    No vibes. No “great energy.” Each dimension is weighted the way partners
                    actually weigh it — and every score quotes your own text back at you.
                  </p>
                  <p className="mt-6 inline-flex items-center gap-2 rounded-full border border-paper/10 bg-paper/[0.03] px-4 py-2 font-mono text-[10.5px] uppercase tracking-[0.2em] text-paper-dim">
                    Weights sum to 100 · Tuned on 1,200+ real decks
                  </p>
                </Reveal>
              </div>
            </div>

            <div className="lg:col-span-7">
              {RUBRIC.map((r, i) => (
                <Reveal key={r.label} delay={Math.min(i * 60, 240)}>
                  <div className="hairline-row group flex items-baseline gap-5 py-6 md:gap-8">
                    <span className="font-mono text-xs text-copper-400/80 tabular-nums">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                        <h3 className="font-display text-2xl tracking-tight text-paper transition-colors duration-300 group-hover:text-copper-300 md:text-[1.7rem]">
                          {r.label}
                        </h3>
                        <span className="font-mono text-[11px] tabular-nums tracking-[0.15em] text-paper-dim">
                          ×{r.weight}%
                        </span>
                      </div>
                      <p className="mt-1.5 max-w-lg text-sm leading-relaxed text-paper-dim">{r.desc}</p>
                      <div className="mt-3 h-px w-full bg-paper/[0.06]">
                        <div
                          className="h-px bg-gradient-to-r from-copper-400 to-copper-500/30 transition-all duration-700 group-hover:from-copper-300"
                          style={{ width: `${(r.weight / 14) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ================================ BENTO / METHOD ================================ */}
        <section id="method" className="relative mx-auto max-w-7xl scroll-mt-24 px-6 pb-24 md:px-10 md:pb-36">
          <Reveal>
            <div className="mb-5 font-mono text-[10.5px] uppercase tracking-[0.28em] text-copper-300">02 — The Machine</div>
            <h2 className="mb-14 max-w-3xl font-display text-5xl leading-[0.98] tracking-tight text-paper md:text-6xl">
              From PDF to verdict, <em className="text-copper-300">in three acts.</em>
            </h2>
          </Reveal>

          <div className="grid gap-5 md:grid-cols-6">
            {/* Extract */}
            <Reveal className="md:col-span-4">
              <SpotlightCard className="h-full border border-paper/[0.08] bg-gradient-to-b from-ink-800 to-ink-900 transition-transform duration-500 hover:-translate-y-1.5">
                <div className="h-full p-8 md:p-10">
                  <div className="mb-7 flex items-center justify-between">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-copper-400/20 bg-copper-400/[0.07] text-copper-300 shadow-[inset_0_0_24px_rgba(214,129,79,0.14)]">
                      <IconExtract size={28} />
                    </div>
                    <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-copper-300/80">
                      Server-side parsing
                    </span>
                  </div>
                  <h3 className="mb-3 font-display text-3xl tracking-tight text-paper md:text-4xl">Extract</h3>
                  <p className="mb-7 max-w-md leading-relaxed text-paper-dim">
                    Your PDF becomes structured slide text — every page preserved, every number kept.
                    No manual copying, no screenshots, no loss.
                  </p>
                  <div className="relative overflow-hidden rounded-xl border border-paper/[0.08] bg-ink-950/80 p-5 font-mono text-[11.5px] leading-relaxed">
                    <div className="mb-3 flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-flame-400/70" />
                      <span className="h-2 w-2 rounded-full bg-copper-400/70" />
                      <span className="h-2 w-2 rounded-full bg-moss-400/70" />
                    </div>
                    <p className="text-copper-300">$ pitchpolish extract seed-deck-v4.pdf</p>
                    <p className="mt-2 text-paper-dim">✓ 14 pages parsed · 2,381 words · 9 tables kept</p>
                    <p className="text-paper-dim/70">→ slide 06 “Market” — flagged: no dollar sizing</p>
                    <p className="text-paper-dim/70">→ slide 08 “Traction” — 6 metrics detected</p>
                    <p className="text-moss-300">✓ extraction complete in 3.2s</p>
                  </div>
                </div>
              </SpotlightCard>
            </Reveal>

            {/* Analyze */}
            <Reveal delay={100} className="md:col-span-2">
              <SpotlightCard className="h-full border border-paper/[0.08] bg-gradient-to-b from-ink-800 to-ink-900 transition-transform duration-500 hover:-translate-y-1.5">
                <div className="h-full p-8">
                  <div className="mb-7 flex h-14 w-14 items-center justify-center rounded-2xl border border-copper-400/20 bg-copper-400/[0.07] text-copper-300 shadow-[inset_0_0_24px_rgba(214,129,79,0.14)]">
                    <IconGauge size={28} />
                  </div>
                  <div className="mb-4 font-mono text-[10px] uppercase tracking-[0.24em] text-copper-300/80">
                    Brutal specificity
                  </div>
                  <h3 className="mb-3 font-display text-3xl tracking-tight text-paper md:text-4xl">Analyze</h3>
                  <p className="mb-7 leading-relaxed text-paper-dim">
                    Scores with receipts. Red flags in crimson, quoted from your own slides.
                  </p>
                  <div className="space-y-3">
                    {[
                      { l: "Traction", w: "92%", tone: "bg-moss-400" },
                      { l: "Problem", w: "84%", tone: "bg-moss-400" },
                      { l: "Market", w: "21%", tone: "bg-flame-400" },
                    ].map((b) => (
                      <div key={b.l}>
                        <div className="mb-1 flex justify-between font-mono text-[10px] uppercase tracking-[0.18em] text-paper-dim">
                          <span>{b.l}</span>
                        </div>
                        <div className="h-1 rounded-full bg-paper/[0.07]">
                          <div className={`h-1 rounded-full ${b.tone}`} style={{ width: b.w }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </SpotlightCard>
            </Reveal>

            {/* Coach */}
            <Reveal delay={160} className="md:col-span-6">
              <SpotlightCard className="border border-paper/[0.08] bg-gradient-to-b from-ink-800 to-ink-900 transition-transform duration-500 hover:-translate-y-1.5">
                <div className="grid items-center gap-10 p-8 md:p-10 lg:grid-cols-5">
                  <div className="lg:col-span-2">
                    <div className="mb-7 flex items-center justify-between">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-copper-400/20 bg-copper-400/[0.07] text-copper-300 shadow-[inset_0_0_24px_rgba(214,129,79,0.14)]">
                        <IconCoach size={28} />
                      </div>
                      <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-copper-300/80">
                        Context-aware
                      </span>
                    </div>
                    <h3 className="mb-3 font-display text-3xl tracking-tight text-paper md:text-4xl">Coach</h3>
                    <p className="leading-relaxed text-paper-dim">
                      Ask anything after the score. The coach answers from your deck&apos;s actual
                      text — never from generic templates. It knows which slide failed, and why.
                    </p>
                  </div>
                  <div className="lg:col-span-3">
                    <div className="space-y-3 rounded-2xl border border-paper/[0.08] bg-ink-950/70 p-5">
                      <div className="ml-auto max-w-[85%] rounded-2xl rounded-br-md bg-paper/[0.08] px-4 py-3 text-sm text-paper">
                        How do I fix my market slide?
                      </div>
                      <div className="max-w-[92%] rounded-2xl rounded-bl-md border border-copper-400/15 bg-copper-400/[0.05] px-4 py-3 text-sm leading-relaxed text-paper/90">
                        Your slide 6 says “33 million US SMBs” but never prices it. Rebuild it in three
                        lines: <span className="text-copper-300">TAM</span> $52B (33M SMBs × $1,580 avg spend),{" "}
                        <span className="text-copper-300">SAM</span> $8.3B (digitized bookkeeping stack),{" "}
                        <span className="text-copper-300">SOM</span> $410M over 3 years at your GTM velocity.
                        Cite the SBA census and your own pilot data.
                      </div>
                      <div className="flex items-center gap-2 pl-1 font-mono text-[10px] uppercase tracking-[0.2em] text-paper-dim/60">
                        <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-copper-400" />
                        Grounded in 2,381 words of your deck
                      </div>
                    </div>
                  </div>
                </div>
              </SpotlightCard>
            </Reveal>
          </div>
        </section>

        {/* ================================ HOW IT WORKS ================================ */}
        <section className="relative mx-auto max-w-6xl px-6 pb-28 md:px-10 md:pb-40">
          <div className="grid items-start gap-12 lg:grid-cols-12 lg:gap-8">
            <div className="lg:col-span-4">
              <Reveal>
                <div className="mb-5 font-mono text-[10.5px] uppercase tracking-[0.28em] text-copper-300">
                  03 — The Path
                </div>
                <h2 className="font-display text-6xl leading-[0.9] tracking-tight text-paper md:text-8xl">
                  How it
                  <br />
                  works<span className="italic text-copper-400">.</span>
                </h2>
                <p className="mt-6 max-w-sm text-xl font-light leading-relaxed text-paper-dim">
                  No forms. No consultants. No calendar invites. Just upload, score, fix.
                </p>
              </Reveal>
            </div>

            <div ref={timelineRef} className="relative lg:col-span-7 lg:col-start-6">
              {/* scroll-driven timeline line */}
              <motion.div
                aria-hidden="true"
                style={{ scaleY: lineScale }}
                className="absolute bottom-2 left-[23px] top-2 w-px origin-top bg-gradient-to-b from-copper-300 via-copper-400/50 to-transparent md:left-[31px]"
              />
              {STEPS.map((step, i) => (
                <Reveal key={step.n} delay={i * 90}>
                  <div className="group relative pb-14 pl-14 last:pb-0 md:pl-20">
                    <div className="absolute left-0 top-0 flex h-12 w-12 items-center justify-center rounded-2xl border border-copper-400/25 bg-gradient-to-br from-copper-400/15 to-copper-400/[0.03] backdrop-blur-sm transition-transform duration-300 group-hover:scale-105 md:h-16 md:w-16">
                      <span className="font-display text-xl text-copper-300 md:text-2xl">{step.n}</span>
                    </div>
                    <h3 className="font-display text-3xl tracking-tight text-paper transition-colors duration-300 group-hover:text-copper-300 md:text-4xl">
                      {step.label}
                    </h3>
                    <p className="mt-3 text-lg leading-relaxed text-paper/80">{step.desc}</p>
                    <p className="mt-2 max-w-xl text-sm leading-relaxed text-paper-dim/85">{step.detail}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ================================ TESTIMONIALS ================================ */}
        <section id="stories" className="relative border-y border-paper/[0.06] bg-ink-950/40 py-24 md:py-32">
          <div className="mx-auto max-w-7xl px-6 md:px-10">
            <Reveal>
              <div className="mb-5 font-mono text-[10.5px] uppercase tracking-[0.28em] text-copper-300">
                04 — After the score
              </div>
              <h2 className="mb-16 max-w-2xl font-display text-5xl leading-[0.98] tracking-tight text-paper md:text-6xl">
                Founders who heard it from the machine <em className="text-copper-300">first.</em>
              </h2>
            </Reveal>

            <div className="grid gap-6 md:grid-cols-3">
              {QUOTES.map((t, i) => (
                <Reveal key={t.name} delay={i * 110} className={i === 1 ? "md:translate-y-10" : i === 2 ? "md:translate-y-4" : ""}>
                  <SpotlightCard className="h-full border border-paper/[0.08] bg-ink-800/60" radius="1.6rem">
                    <figure className="flex h-full flex-col p-8">
                      <span aria-hidden="true" className="mb-5 font-display text-6xl leading-none text-copper-400/60">
                        “
                      </span>
                      <blockquote className="flex-1 text-[15px] leading-relaxed text-paper/90">{t.q}</blockquote>
                      <figcaption className="mt-7 border-t border-paper/[0.08] pt-5">
                        <div className="font-display text-lg text-paper">{t.name}</div>
                        <div className="mt-0.5 font-mono text-[10.5px] uppercase tracking-[0.18em] text-copper-300/80">
                          {t.role}
                        </div>
                      </figcaption>
                    </figure>
                  </SpotlightCard>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ================================ PRICING ================================ */}
        <section id="pricing" className="relative mx-auto max-w-5xl scroll-mt-24 px-6 py-28 md:px-10 md:py-36">
          <Reveal>
            <ShineBorder radius="2.4rem" duration={5.5}>
              <div className="relative overflow-hidden rounded-[2.4rem] border border-paper/[0.07] bg-gradient-to-b from-ink-800/95 to-ink-850 p-10 text-center md:p-16">
                <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(214,129,79,0.14),transparent_60%)]" />
                <div aria-hidden="true" className="grain absolute inset-0 opacity-[0.05]" />

                <div className="relative">
                  <div className="mb-5 font-mono text-[11px] font-semibold uppercase tracking-[0.3em] text-copper-300/90">
                    Founding price — locked for early founders
                  </div>
                  <div className="font-display text-7xl tracking-tight md:text-8xl">
                    <span className="gradient-text-animated">$19</span>
                    <span className="text-3xl text-paper/50 md:text-4xl">/mo</span>
                  </div>
                  <p className="mx-auto mt-6 max-w-xl text-lg font-light leading-relaxed text-paper-dim md:text-xl">
                    Unlimited analyses. The full coach. Executive summaries you&apos;d pay a consultant for.
                    Cancel anytime — your reports stay yours.
                  </p>

                  <div className="mt-9 flex flex-wrap justify-center gap-2.5">
                    {["1 free analysis", "Unlimited decks", "Context-aware coach", "Executive summaries"].map((t) => (
                      <span
                        key={t}
                        className="flex items-center gap-1.5 rounded-full border border-paper/10 bg-paper/[0.04] px-4 py-2 text-[13px] font-semibold text-paper/85"
                      >
                        <IconCheck size={12} className="text-copper-300" />
                        {t}
                      </span>
                    ))}
                  </div>

                  <Magnetic strength={0.18} className="mt-10">
                    <Link
                      href="/upload"
                      className="btn-shine group inline-flex items-center gap-3 rounded-full bg-copper-400 px-10 py-4 text-lg font-bold text-ink-950 shadow-[0_0_60px_-12px_rgba(214,129,79,0.6)] transition-colors duration-300 hover:bg-copper-300"
                    >
                      Start free analysis
                      <IconArrow size={19} className="transition-transform duration-300 group-hover:translate-x-1.5" />
                    </Link>
                  </Magnetic>
                </div>
              </div>
            </ShineBorder>
          </Reveal>
        </section>

        {/* ================================ FAQ ================================ */}
        <section id="faq" className="mx-auto max-w-3xl scroll-mt-24 px-6 pb-28 md:px-10 md:pb-36">
          <Reveal>
            <div className="mb-5 text-center font-mono text-[10.5px] uppercase tracking-[0.28em] text-copper-300">
              05 — Straight answers
            </div>
            <h2 className="mb-12 text-center font-display text-5xl tracking-tight text-paper md:text-6xl">
              Asked, <em className="text-copper-300">answered.</em>
            </h2>
          </Reveal>

          <div className="divide-y divide-paper/[0.08] border-y border-paper/[0.08]">
            {FAQS.map((f, i) => {
              const open = faqOpen === i;
              return (
                <div key={f.q}>
                  <button
                    onClick={() => setFaqOpen(open ? -1 : i)}
                    aria-expanded={open}
                    className="flex w-full items-center justify-between gap-6 py-6 text-left"
                  >
                    <span className={`font-display text-xl tracking-tight transition-colors md:text-2xl ${open ? "text-copper-300" : "text-paper hover:text-copper-200"}`}>
                      {f.q}
                    </span>
                    <span
                      className={`shrink-0 rounded-full border p-2 transition-all duration-300 ${
                        open ? "rotate-45 border-copper-400/60 text-copper-300" : "border-paper/20 text-paper-dim"
                      }`}
                    >
                      <IconPlus size={14} />
                    </span>
                  </button>
                  <AnimatePresence initial={false}>
                    {open && (
                      <motion.div
                        key="content"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        <p className="pb-7 pr-10 leading-relaxed text-paper-dim">{f.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </section>

        {/* ================================ FINAL CTA ================================ */}
        <section className="relative mx-auto max-w-7xl px-6 pb-32 md:px-10 md:pb-40">
          <LampDivider className="mb-24" />
          <Reveal>
            <div className="text-center">
              <h2 className="mx-auto max-w-4xl font-display text-5xl leading-[0.98] tracking-tight text-paper md:text-7xl">
                Your deck is already
                <br />
                being judged. <em className="copper-shimmer">Score it first.</em>
              </h2>
              <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
                <Magnetic strength={0.18}>
                  <Link
                    href="/upload"
                    className="btn-shine group inline-flex items-center gap-3 rounded-full bg-copper-400 px-9 py-4 text-lg font-bold text-ink-950 shadow-[0_0_60px_-14px_rgba(214,129,79,0.65)] transition-colors duration-300 hover:bg-copper-300"
                  >
                    Analyze your deck
                    <IconArrow size={19} className="transition-transform duration-300 group-hover:translate-x-1.5" />
                  </Link>
                </Magnetic>
                <button
                  onClick={openSample}
                  disabled={sampleLoading}
                  className="inline-flex items-center gap-3 rounded-full border border-paper/15 bg-paper/[0.04] px-9 py-4 text-lg font-semibold text-paper transition-all duration-300 hover:border-copper-400/40 disabled:pointer-events-none disabled:opacity-60"
                >
                  {sampleLoading ? "Preparing sample…" : "Or read the sample report"}
                </button>
              </div>
              <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.22em] text-paper-dim/60">
                Free first analysis · No card · 48 seconds on average
              </p>
            </div>
          </Reveal>
        </section>

        {/* ================================ FOOTER ================================ */}
        <footer className="relative border-t border-paper/[0.07]">
          <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 px-6 py-12 md:flex-row md:items-end md:px-10">
            <div>
              <Link href="/" className="font-display text-2xl tracking-tight text-paper">
                Pitch<span className="italic text-copper-300">Polish</span>
                <span className="text-copper-400">.</span>
              </Link>
              <p className="mt-2 text-xs tracking-wide text-paper-dim/70">
                AI pitch review for startup founders — built for the ones who&apos;d rather hear it from the machine.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-x-8 gap-y-3 text-sm font-semibold text-paper-dim">
              <Link href="/upload" className="transition hover:text-copper-300">Upload</Link>
              <Link href="/dashboard" className="transition hover:text-copper-300">Reports</Link>
              <a href="#pricing" className="transition hover:text-copper-300">Pricing</a>
              <a href="#faq" className="transition hover:text-copper-300">FAQ</a>
            </div>
          </div>
          <div className="border-t border-paper/[0.05] py-5 text-center font-mono text-[10px] uppercase tracking-[0.24em] text-paper-dim/50">
            © {new Date().getFullYear()} PitchPolish — Not a pitch. A score.
          </div>
        </footer>
      </main>
    </>
  );
}
