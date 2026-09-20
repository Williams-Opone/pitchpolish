import Link from "next/link";
import { desc, eq, isNull, or } from "drizzle-orm";
import { db } from "@/db";
import { reports } from "@/db/schema";
import { getCurrentOwner } from "@/lib/owner";
import Shell from "@/components/Shell";
import GenerateSampleButton from "@/components/GenerateSampleButton";
import { Reveal } from "@/components/fx";
import { SpotlightCard } from "@/components/premium";
import { IconArrow, IconFlag } from "@/components/icons";

export const dynamic = "force-dynamic";

type ReportRow = typeof reports.$inferSelect;

interface BandConfig {
  label: string;
  badge: string;
  dot: string;
  border: string;
  bgGlow: string;
}

const getTierMeta = (score: number): BandConfig => {
  if (score >= 85) {
    return {
      label: "Institutional Grade",
      badge: "border-moss-400/40 bg-moss-400/10 text-moss-300 shadow-[0_0_12px_rgba(100,181,127,0.15)]",
      dot: "bg-moss-400 shadow-[0_0_8px_#64b57f]",
      border: "hover:border-moss-400/30",
      bgGlow: "from-moss-400/[0.04] to-transparent",
    };
  }
  if (score >= 70) {
    return {
      label: "Accredited Ready",
      badge: "border-copper-400/40 bg-copper-400/10 text-copper-300 shadow-[0_0_12px_rgba(214,129,79,0.15)]",
      dot: "bg-copper-400 shadow-[0_0_8px_#d6814f]",
      border: "hover:border-copper-400/30",
      bgGlow: "from-copper-400/[0.04] to-transparent",
    };
  }
  return {
    label: "High Friction",
    badge: "border-flame-400/40 bg-flame-400/10 text-flame-300 shadow-[0_0_12px_rgba(224,92,84,0.15)]",
    dot: "bg-flame-400 shadow-[0_0_8px_#e05c54]",
    border: "hover:border-flame-400/30",
    bgGlow: "from-flame-400/[0.04] to-transparent",
  };
};

export default async function DashboardPage() {
  const owner = await getCurrentOwner();

  let rows: ReportRow[] = [];
  let dbError: string | null = null;

  try {
    rows = await db
      .select()
      .from(reports)
      .where(owner ? or(isNull(reports.owner), eq(reports.owner, owner)) : isNull(reports.owner))
      .orderBy(desc(reports.createdAt))
      .limit(50);
  } catch (e) {
    console.error("Dashboard query failed:", e);
    dbError = e instanceof Error ? e.message : "Unknown database connection failure";
  }

  // Analytics Computation
  const totalReports = rows.length;
  const avgScore = totalReports ? Math.round(rows.reduce((acc, r) => acc + (r.score ?? 0), 0) / totalReports) : 0;
  const topScore = totalReports ? Math.max(...rows.map((r) => r.score ?? 0)) : 0;
  const totalFlags = rows.reduce((acc, r) => acc + (r.redFlags?.length ?? 0), 0);
  const investmentReadyCount = rows.filter((r) => (r.score ?? 0) >= 80).length;
  const passRate = totalReports ? Math.round((investmentReadyCount / totalReports) * 100) : 0;

  return (
    <Shell>
      <div className="relative isolate min-h-[calc(100vh-5rem)] overflow-hidden">
        {/* Subtle Ambient Background Gradients */}
        <div className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-[520px] w-[850px] -translate-x-1/2 rounded-full bg-copper-500/[0.035] blur-[140px]" />
        <div className="pointer-events-none absolute top-1/3 -right-60 -z-10 h-[400px] w-[500px] rounded-full bg-ink-700/20 blur-[120px]" />

        <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8 md:py-20 lg:px-10">
          
          {/* Header Section */}
          <div className="flex flex-col justify-between gap-8 border-b border-paper/[0.07] pb-10 md:flex-row md:items-end">
            <Reveal>
              <div className="flex items-center gap-2.5">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-copper-400 opacity-60" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-copper-400" />
                </span>
                <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-copper-300">
                  Investor Audit Terminal
                </span>
              </div>
              <h1 className="mt-4 font-display text-4xl leading-[0.95] tracking-tight text-paper sm:text-6xl md:text-7xl">
                The Ledger<span className="copper-shimmer italic font-normal">.</span>
              </h1>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-paper-dim md:text-base">
                Quantified diagnostic registry. Benchmarked against tier-one angel and venture consensus across nine core mechanics.
              </p>
            </Reveal>

            {!dbError && (
              <Reveal delay={120}>
                <div className="flex items-center gap-3">
                  <Link
                    href="/upload"
                    className="btn-shine group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-copper-400 px-6 py-3 font-mono text-xs font-semibold uppercase tracking-widest text-ink-950 shadow-[0_10px_25px_rgba(214,129,79,0.25)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-copper-300 active:translate-y-0"
                  >
                    <span>Analyze Deck</span>
                    <IconArrow size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>
                </div>
              </Reveal>
            )}
          </div>

          {/* Database Failure State */}
          {dbError ? (
            <Reveal delay={100}>
              <div className="mt-12 overflow-hidden rounded-3xl border border-flame-400/30 bg-ink-850/80 p-8 shadow-2xl backdrop-blur-xl md:p-12">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-flame-400/30 bg-flame-400/10 text-flame-300">
                    <IconFlag size={20} />
                  </div>
                  <div>
                    <h2 className="font-display text-2xl tracking-tight text-paper md:text-3xl">
                      Telemetry sync interrupted
                    </h2>
                    <p className="mt-2 text-sm text-paper-dim">
                      Authenticated session verified, but the persistence layer is unserviceable. Inspect parameters in sequence:
                    </p>
                  </div>
                </div>

                <div className="mt-8 grid grid-cols-1 gap-3 font-mono text-xs md:grid-cols-2">
                  <div className="rounded-xl border border-paper/[0.06] bg-ink-900/90 p-4 text-paper/80">
                    <span className="text-copper-400">01</span> Check <code className="text-paper">DATABASE_URL</code> in <code className="text-paper">.env.local</code>
                  </div>
                  <div className="rounded-xl border border-paper/[0.06] bg-ink-900/90 p-4 text-paper/80">
                    <span className="text-copper-400">02</span> Verify target database entity exists
                  </div>
                  <div className="rounded-xl border border-paper/[0.06] bg-ink-900/90 p-4 text-paper/80">
                    <span className="text-copper-400">03</span> Execute <code className="text-copper-300">npx drizzle-kit push</code>
                  </div>
                  <div className="rounded-xl border border-paper/[0.06] bg-ink-900/90 p-4 text-paper/80">
                    <span className="text-copper-400">04</span> Bounce dev container / server
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-between overflow-x-auto rounded-xl border border-flame-400/20 bg-ink-950/80 px-4 py-3 font-mono text-[11px] text-flame-300/80">
                  <code>{dbError}</code>
                  <span className="text-[10px] text-paper-dim/40 uppercase">Postgres E_DIAG</span>
                </div>
              </div>
            </Reveal>
          ) : rows.length > 0 ? (
            <>
              {/* Macro Metric HUD */}
              <Reveal delay={80}>
                <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:gap-4">
                  <div className="relative overflow-hidden rounded-2xl border border-paper/[0.06] bg-ink-850/40 p-5 backdrop-blur-sm">
                    <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-paper-dim/70">Registry Total</span>
                    <div className="mt-2 flex items-baseline gap-2">
                      <span className="font-display text-3xl text-paper md:text-4xl">{totalReports}</span>
                      <span className="font-mono text-[10px] text-paper-dim">DECKS</span>
                    </div>
                  </div>

                  <div className="relative overflow-hidden rounded-2xl border border-paper/[0.06] bg-ink-850/40 p-5 backdrop-blur-sm">
                    <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-paper-dim/70">Normative Score</span>
                    <div className="mt-2 flex items-baseline gap-2">
                      <span className="font-display text-3xl text-copper-300 md:text-4xl">{avgScore}</span>
                      <span className="font-mono text-[10px] text-paper-dim">AVG / 100</span>
                    </div>
                  </div>

                  <div className="relative overflow-hidden rounded-2xl border border-paper/[0.06] bg-ink-850/40 p-5 backdrop-blur-sm">
                    <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-paper-dim/70">Peak Benchmark</span>
                    <div className="mt-2 flex items-baseline gap-2">
                      <span className="font-display text-3xl text-moss-300 md:text-4xl">{topScore}</span>
                      <span className="font-mono text-[10px] text-moss-400/80">HISTORIC MAX</span>
                    </div>
                  </div>

                  <div className="relative overflow-hidden rounded-2xl border border-paper/[0.06] bg-ink-850/40 p-5 backdrop-blur-sm">
                    <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-paper-dim/70">Identified Traps</span>
                    <div className="mt-2 flex items-baseline gap-2">
                      <span className="font-display text-3xl text-flame-300 md:text-4xl">{totalFlags}</span>
                      <span className="font-mono text-[10px] text-paper-dim">RED FLAGS</span>
                    </div>
                  </div>
                </div>
              </Reveal>

              {/* Institutional Readiness Strip */}
              <Reveal delay={120}>
                <div className="mt-4 flex flex-col justify-between gap-4 rounded-xl border border-paper/[0.05] bg-ink-950/40 px-5 py-3 sm:flex-row sm:items-center">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-[11px] uppercase tracking-wider text-paper-dim">
                      Portfolio Clearance:
                    </span>
                    <span className="font-mono text-xs text-paper">
                      <strong className="text-copper-300 font-semibold">{passRate}%</strong> met partner-meeting thresholds (80+)
                    </span>
                  </div>
                  <div className="h-1.5 w-full max-w-xs overflow-hidden rounded-full bg-ink-700">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-copper-400 to-moss-300 transition-all duration-700"
                      style={{ width: `${passRate}%` }}
                    />
                  </div>
                </div>
              </Reveal>

              {/* Audit Ledger List */}
              <div className="mt-10 space-y-3">
                <div className="hidden px-6 font-mono text-[10px] uppercase tracking-[0.22em] text-paper-dim/50 md:grid md:grid-cols-12 md:gap-6">
                  <div className="col-span-1">Rating</div>
                  <div className="col-span-5">Instrument & Diagnostics</div>
                  <div className="col-span-3 text-center">Benchmark Band</div>
                  <div className="col-span-3 text-right">Audit Date</div>
                </div>

                {rows.map((r, i) => {
                  const score = r.score ?? 0;
                  const tier = getTierMeta(score);
                  const flagsCount = r.redFlags?.length ?? 0;
                  const formattedDate = new Date(r.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "2-digit",
                    year: "numeric",
                  });

                  return (
                    <Reveal key={r.id} delay={Math.min(i * 40, 280)}>
                      <Link href={`/report/${r.id}`} className="group block outline-none">
                        <SpotlightCard
                          radius="1.25rem"
                          className={`relative border border-paper/[0.07] bg-gradient-to-r ${tier.bgGlow} bg-ink-850/50 backdrop-blur-md transition-all duration-300 group-hover:-translate-y-0.5 group-hover:border-paper/20 group-hover:bg-ink-800/80 group-focus-visible:ring-1 group-focus-visible:ring-copper-400`}
                        >
                          <div className="flex flex-col gap-5 p-5 md:grid md:grid-cols-12 md:items-center md:gap-6 md:p-6">
                            
                            {/* Score Dial */}
                            <div className="col-span-1 flex items-center gap-4 md:flex-col md:justify-center">
                              <div
                                className={`flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-xl border transition-transform duration-300 group-hover:scale-105 ${tier.badge}`}
                              >
                                <span className="font-display text-2xl leading-none">{score}</span>
                                <span className="mt-0.5 font-mono text-[8px] uppercase tracking-wider opacity-60">
                                  /100
                                </span>
                              </div>
                            </div>

                            {/* Deck Meta */}
                            <div className="col-span-5 min-w-0">
                              <div className="flex flex-wrap items-center gap-2.5">
                                <h2 className="truncate font-display text-xl tracking-tight text-paper transition-colors duration-200 group-hover:text-copper-200 md:text-2xl">
                                  {r.deckName}
                                </h2>
                                {r.isSample && (
                                  <span className="rounded border border-copper-400/30 bg-copper-400/[0.08] px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.15em] text-copper-300">
                                    Sample Baseline
                                  </span>
                                )}
                              </div>
                              <div className="mt-1.5 flex flex-wrap items-center gap-2 font-mono text-[11px] text-paper-dim/80">
                                <span>{r.fileName ?? "raw_presentation.pdf"}</span>
                                <span className="text-paper-dim/40">•</span>
                                <span>{r.slideCount ?? 0} Slides</span>
                                <span className="text-paper-dim/40">•</span>
                                <span className="text-paper-dim/60">{r.wordCount ?? 0} Words</span>
                              </div>
                            </div>

                            {/* Status & Flag Pills */}
                            <div className="col-span-3 flex flex-col items-start gap-1.5 md:items-center">
                              <div className="inline-flex items-center gap-2 rounded-full border border-paper/[0.08] bg-ink-950/70 px-3 py-1 font-mono text-[11px] text-paper/90">
                                <span className={`h-1.5 w-1.5 rounded-full ${tier.dot}`} />
                                <span>{r.band || tier.label}</span>
                              </div>
                              
                              <div className="font-mono text-[10px] tracking-wide">
                                {flagsCount > 0 ? (
                                  <span className="text-flame-300/90 font-medium">
                                    {flagsCount} friction point{flagsCount > 1 ? "s" : ""} detected
                                  </span>
                                ) : (
                                  <span className="text-moss-400/90 font-medium">Zero friction flags</span>
                                )}
                              </div>
                            </div>

                            {/* Audit Stamp & Navigation */}
                            <div className="col-span-3 flex items-center justify-between md:justify-end md:gap-5">
                              <div className="text-left md:text-right">
                                <span className="block font-mono text-[11px] text-paper-dim/80">
                                  {formattedDate}
                                </span>
                                <span className="block font-mono text-[9px] uppercase tracking-widest text-paper-dim/40">
                                  Verified
                                </span>
                              </div>
                              <div className="flex h-9 w-9 items-center justify-center rounded-full border border-paper/[0.08] bg-ink-900/60 text-paper-dim transition-all duration-300 group-hover:border-copper-400/40 group-hover:bg-copper-400 group-hover:text-ink-950">
                                <IconArrow size={14} className="transition-transform duration-300 group-hover:translate-x-0.5" />
                              </div>
                            </div>

                          </div>
                        </SpotlightCard>
                      </Link>
                    </Reveal>
                  );
                })}
              </div>

              {/* Bottom Quick-Action Panel */}
              <Reveal delay={150}>
                <div className="mt-14 flex flex-col items-center justify-between gap-6 rounded-2xl border border-paper/[0.06] bg-ink-850/30 p-6 md:flex-row md:px-8">
                  <div>
                    <h3 className="font-display text-lg text-paper">Iterating on a revised version?</h3>
                    <p className="text-xs text-paper-dim mt-0.5">
                      Upload your patched deck to benchmark delta improvements across slide clarity and narrative flow.
                    </p>
                  </div>
                  <Link
                    href="/upload"
                    className="group inline-flex shrink-0 items-center gap-2.5 rounded-full border border-paper/20 bg-paper/[0.04] px-6 py-3 font-mono text-xs uppercase tracking-wider text-paper transition-all duration-300 hover:border-copper-400 hover:bg-copper-400/10 hover:text-copper-200"
                  >
                    <span>Run Differential Score</span>
                    <IconArrow size={14} className="transition-transform duration-200 group-hover:translate-x-1" />
                  </Link>
                </div>
              </Reveal>
            </>
          ) : (
            /* Pristine Zero-State */
            <Reveal delay={100}>
              <div className="relative mt-12 overflow-hidden rounded-[2.5rem] border border-paper/[0.08] bg-gradient-to-b from-ink-850/80 to-ink-900/80 p-10 text-center backdrop-blur-xl md:p-20">
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl border border-copper-400/30 bg-copper-400/[0.06] text-copper-300 shadow-[0_0_40px_rgba(214,129,79,0.12)]">
                  <IconFlag size={28} />
                </div>
                
                <span className="font-mono text-xs uppercase tracking-[0.28em] text-copper-300">
                  Ready for Intake
                </span>
                
                <h2 className="mt-3 font-display text-4xl tracking-tight text-paper sm:text-5xl">
                  No evaluations recorded yet<span className="text-copper-400">.</span>
                </h2>
                
                <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-paper-dim sm:text-base">
                  PitchPolish acts as your pre-deal investment committee. Submit your slide deck to generate 
                  a diagnostic tear sheet with every structural flaw highlighted.
                </p>

                <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
                  <Link
                    href="/upload"
                    className="btn-shine group inline-flex items-center gap-3 rounded-full bg-copper-400 px-8 py-4 font-mono text-xs font-semibold uppercase tracking-widest text-ink-950 shadow-[0_12px_28px_rgba(214,129,79,0.28)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-copper-300"
                  >
                    Analyze First Deck
                    <IconArrow size={15} className="transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>
                  <GenerateSampleButton />
                </div>
              </div>
            </Reveal>
          )}

        </div>
      </div>
    </Shell>
  );
}