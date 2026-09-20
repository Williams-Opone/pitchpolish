"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, type CSSProperties } from "react";
import Background3D from "@/components/Background3D";
import TiltCard from "@/components/TiltCard";
import { CountUp, Marquee, Reveal, Scramble, ScoreRing } from "@/components/fx";
import {
  LampDivider,
  Magnetic,
  ShineBorder,
  TextGenerateEffect,
} from "@/components/premium";
import RubricSection from "@/components/RubricSection";
import MethodSection from "@/components/MethodSection";
import ProofSection from "@/components/ProofSection";
import PricingSection from "@/components/PricingSection";
import FaqSection from "@/components/FaqSection";
import AnatomySection from "@/components/AnatomySection";
import BenchmarksSection from "@/components/BenchmarksSection";
import PlaybookSection from "@/components/PlaybookSection";
import ManifestoSection from "@/components/ManifestoSection";
import SessionSlot from "@/components/SessionSlot";
import {
  IconArrow,
  IconFlag,
  IconLock,
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

      <main className={`relative z-10 min-h-screen overflow-x-clip ${loaded ? "is-loaded" : ""}`}>
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

            <div className="flex items-center gap-4">
              <SessionSlot variant="compact" />
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
                <span onClick={() => setMobileOpen(false)}>
                  <SessionSlot variant="menu" />
                </span>
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
                  <TiltCard className="relative z-10 rounded-[2rem]">
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

                          {/* after-fixes chip — inside the card, under the heading */}
                          <div className="mb-6 inline-flex max-w-full items-center gap-3 rounded-xl border border-moss-400/30 bg-moss-400/[0.08] px-3.5 py-2">
                            <span className="whitespace-nowrap font-mono text-[9px] font-semibold uppercase tracking-[0.22em] text-moss-300">
                              After fixes
                            </span>
                            <span className="font-display text-lg leading-none text-paper">72 → 91</span>
                            <svg
                              width="46"
                              height="16"
                              viewBox="0 0 46 16"
                              fill="none"
                              aria-hidden="true"
                              className="hidden text-moss-300 sm:block"
                            >
                              <path
                                d="M1 13 12 9 22 11 33 5 44 2"
                                stroke="currentColor"
                                strokeWidth="1.6"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <circle cx="44" cy="2" r="1.8" fill="currentColor" />
                            </svg>
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
                            <h4 className="mb-3 flex flex-wrap items-center gap-2 text-sm font-semibold text-flame-300">
                              <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-flame-400" />
                              Critical red flags
                              <span className="ml-auto hidden items-center gap-1.5 rounded-lg border border-flame-400/25 bg-flame-400/[0.08] px-2.5 py-1 font-mono text-[9px] font-semibold uppercase tracking-[0.16em] text-flame-300 sm:inline-flex">
                                <IconFlag size={10} />
                                No TAM/SAM/SOM
                              </span>
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
        <RubricSection />

        {/* ================================ HOW IT WORKS ================================ */}
        <MethodSection />

        {/* ================================ REPORT ANATOMY ================================ */}
        <AnatomySection />

        {/* ================================ BENCHMARKS ================================ */}
        <BenchmarksSection />

        {/* ================================ TESTIMONIALS ================================ */}
        <ProofSection />

        {/* ================================ PRICING ================================ */}
        <PricingSection />

        {/* ================================ FIELD NOTES ================================ */}
        <PlaybookSection />

        {/* ================================ FAQ ================================ */}
        <FaqSection />

        {/* ================================ MANIFESTO ================================ */}
        <ManifestoSection />

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
          <div className="mx-auto grid max-w-7xl gap-12 px-6 py-16 md:grid-cols-12 md:px-10">
            <div className="md:col-span-5">
              <Link href="/" className="font-display text-3xl tracking-tight text-paper">
                Pitch<span className="italic text-copper-300">Polish</span>
                <span className="text-copper-400">.</span>
              </Link>
              <p className="mt-3 max-w-sm text-sm leading-relaxed text-paper-dim/80">
                AI pitch review for startup founders — built for the ones who&apos;d rather hear it
                from the machine. Scores are opinions; the math behind them is not.
              </p>
              <div className="mt-6 flex gap-8 font-mono text-[10px] uppercase tracking-[0.2em] text-paper-dim/60">
                <span>1,284 decks</span>
                <span>61 funded</span>
                <span>48s avg run</span>
              </div>
            </div>
            
            <div className="md:col-span-2">
              <div className="mb-4 font-mono text-[10px] uppercase tracking-[0.26em] text-copper-300">Product</div>
              <ul className="space-y-2.5 text-sm font-semibold text-paper-dim">
                <li><Link href="/upload" className="transition hover:text-copper-300">Upload a deck</Link></li>
                <li><Link href="/dashboard" className="transition hover:text-copper-300">Your reports</Link></li>
                <li><a href="#pricing" className="transition hover:text-copper-300">Pricing</a></li>
                <li><Link href="/report/1" className="transition hover:text-copper-300">Sample verdict</Link></li>
              </ul>
            </div>

            <div className="md:col-span-3">
              <div className="mb-4 font-mono text-[10px] uppercase tracking-[0.26em] text-copper-300">Explore</div>
              <ul className="space-y-2.5 text-sm font-semibold text-paper-dim">
                <li><a href="#rubric" className="transition hover:text-copper-300">The rubric</a></li>
                <li><a href="#method" className="transition hover:text-copper-300">The machine</a></li>
                <li><a href="#anatomy" className="transition hover:text-copper-300">Inside a verdict</a></li>
                <li><a href="#benchmarks" className="transition hover:text-copper-300">Benchmarks</a></li>
                <li><a href="#playbook" className="transition hover:text-copper-300">Field notes</a></li>
              </ul>
            </div>

            <div className="md:col-span-2">
              <div className="mb-4 font-mono text-[10px] uppercase tracking-[0.26em] text-copper-300">Company</div>
              <ul className="space-y-2.5 text-sm font-semibold text-paper-dim">
                <li><a href="#faq" className="transition hover:text-copper-300">FAQ</a></li>
                <li><Link href="/terms" className="transition hover:text-copper-300">Terms of Service</Link></li>
                <li><Link href="/privacy" className="transition hover:text-copper-300">Privacy Policy</Link></li>
                <li><Link href="/sign-in" className="transition hover:text-copper-300">Sign in</Link></li>
                <li><Link href="/sign-up" className="transition hover:text-copper-300">Create account</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-paper/[0.05] py-6 px-6 md:px-10">
            <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 font-mono text-[10.5px] uppercase tracking-[0.22em] text-paper-dim/60 sm:flex-row">
              <div>
                © {new Date().getFullYear()} PitchPolish — Not a pitch. A score.
              </div>
              <div className="flex items-center gap-6">
                <Link href="/terms" className="transition hover:text-copper-300">Terms</Link>
                <span className="text-paper-dim/30">·</span>
                <Link href="/privacy" className="transition hover:text-copper-300">Privacy</Link>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}
