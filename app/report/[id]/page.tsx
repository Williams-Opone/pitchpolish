import Link from "next/link";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { reports } from "@/db/schema";
import Shell from "@/components/Shell";
import CoachChat from "@/components/CoachChat";
import { Reveal, ScoreRing } from "@/components/fx";
import { LegendBar, RadarChart, SpotlightCard } from "@/components/premium";
import { IconArrow, IconFlag, IconLock } from "@/components/icons";

export const dynamic = "force-dynamic";

const toneFor = (s: number) =>
  s >= 8
    ? { bar: "bg-moss-400", chip: "text-moss-300 bg-moss-400/10", word: "Strong" }
    : s <= 3
      ? { bar: "bg-flame-400", chip: "text-flame-300 bg-flame-400/10", word: "Critical" }
      : s <= 5
        ? { bar: "bg-copper-500", chip: "text-copper-300 bg-copper-400/10", word: "Weak" }
        : { bar: "bg-copper-400", chip: "text-copper-300 bg-copper-400/10", word: "Developing" };

export default async function ReportPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const num = Number(id);
  if (!Number.isInteger(num) || num <= 0) notFound();

  const rows = await db.select().from(reports).where(eq(reports.id, num)).limit(1);
  const r = rows[0];
  if (!r) notFound();

  const sorted = [...r.sections].sort((a, b) => a.score - b.score);

  return (
    <Shell>
      <div className="mx-auto max-w-6xl px-6 py-14 md:px-10 md:py-20">
        <Reveal>
          <Link
            href="/dashboard"
            className="group inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.22em] text-paper-dim transition hover:text-copper-300"
          >
            <IconArrow size={13} className="rotate-180 transition-transform group-hover:-translate-x-1" />
            All reports
          </Link>
        </Reveal>

        {/* header */}
        <div className="mt-8 grid items-center gap-10 lg:grid-cols-[1fr_auto]">
          <Reveal>
            <div className="flex flex-wrap items-center gap-3">
              <span className="font-mono text-[10.5px] uppercase tracking-[0.26em] text-copper-300">
                Verdict · {new Date(r.createdAt).toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" })}
              </span>
              {r.isSample && (
                <span className="rounded-full border border-copper-400/30 bg-copper-400/[0.08] px-3 py-1 font-mono text-[9.5px] uppercase tracking-[0.18em] text-copper-300">
                  Sample deck
                </span>
              )}
            </div>
            <h1 className="mt-4 font-display text-4xl leading-[0.95] tracking-tighter text-paper md:text-6xl">
              {r.deckName}
            </h1>
            <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.2em] text-paper-dim/80">
              {r.fileName} · {r.slideCount} pages · {r.wordCount.toLocaleString()} words parsed
            </p>
          </Reveal>

          <Reveal delay={120}>
            <div className="flex flex-col items-center gap-3">
              <ScoreRing value={r.score} size={188} stroke={7} />
              <div className="rounded-full border border-paper/12 bg-paper/[0.04] px-4 py-1.5 font-mono text-[10.5px] uppercase tracking-[0.2em] text-paper">
                {r.band}
              </div>
            </div>
          </Reveal>
        </div>

        {/* summary */}
        <Reveal delay={80}>
          <blockquote className="mt-12 border-l-2 border-copper-400/60 pl-6 font-display text-2xl italic leading-snug text-paper/90 md:text-[1.7rem]">
            “{r.summary}”
          </blockquote>
        </Reveal>

        {/* sections */}
        <div className="mt-16">
          <Reveal>
            <h2 className="mb-8 font-display text-3xl tracking-tight text-paper md:text-4xl">
              Section breakdown<span className="text-copper-400">.</span>
            </h2>
          </Reveal>

          <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,400px)_1fr]">
            {/* radar panel */}
            <Reveal>
              <SpotlightCard className="border border-paper/[0.08] bg-ink-800/50 lg:sticky lg:top-28" radius="1.6rem">
                <div className="p-7">
                  <h3 className="font-display text-2xl tracking-tight text-paper">
                    The shape of the deck<span className="text-copper-400">.</span>
                  </h3>
                  <p className="mt-2 text-[13px] leading-relaxed text-paper-dim">
                    Nine axes scaled 0–10 against investor benchmarks. Round shapes raise rounds.
                  </p>
                  <RadarChart
                    data={r.sections.map((s) => ({ label: s.label, value: s.score }))}
                    size={308}
                    className="mx-auto mt-4"
                  />
                  <div className="mt-7 space-y-3.5 border-t border-paper/[0.08] pt-6">
                    {r.sections.map((s, i) => (
                      <LegendBar key={s.key} label={s.label} value={s.score} delay={i * 0.05} />
                    ))}
                  </div>
                </div>
              </SpotlightCard>
            </Reveal>

            {/* detail cards */}
            <div className="grid gap-4 md:grid-cols-2">
            {r.sections.map((s, i) => {
              const t = toneFor(s.score);
              return (
                <Reveal key={s.key} delay={Math.min(i * 50, 250)}>
                  <div className="h-full rounded-2xl border border-paper/[0.08] bg-ink-800/50 p-6 transition-colors duration-300 hover:border-copper-400/25">
                    <div className="mb-3 flex items-center justify-between">
                      <h3 className="font-display text-xl tracking-tight text-paper">{s.label}</h3>
                      <span className={`rounded-md px-2 py-1 font-mono text-[11px] font-bold ${t.chip}`}>
                        {s.score}/10
                      </span>
                    </div>
                    <div className="mb-4 h-1 rounded-full bg-paper/[0.07]">
                      <div className={`h-1 rounded-full ${t.bar}`} style={{ width: `${s.score * 10}%` }} />
                    </div>
                    <p className="text-[13px] leading-relaxed text-paper-dim">{s.note}</p>
                    <p className="mt-3 font-mono text-[9.5px] uppercase tracking-[0.2em] text-paper-dim/55">
                      {t.word} · weight ×{s.weight}%
                    </p>
                  </div>
                </Reveal>
              );
            })}
            </div>
          </div>
        </div>

        {/* flags + excerpt */}
        <div className="mt-14 grid gap-6 lg:grid-cols-2">
          <Reveal>
            <div
              className={`h-full rounded-[1.6rem] border p-8 ${
                r.redFlags.length > 0
                  ? "border-flame-400/25 bg-flame-400/[0.05]"
                  : "border-moss-400/25 bg-moss-400/[0.05]"
              }`}
            >
              <h3
                className={`mb-5 flex items-center gap-2.5 font-display text-2xl tracking-tight ${
                  r.redFlags.length > 0 ? "text-flame-300" : "text-moss-300"
                }`}
              >
                {r.redFlags.length > 0 ? (
                  <>
                    <IconFlag size={18} />
                    {r.redFlags.length} red flag{r.redFlags.length > 1 ? "s" : ""} on record
                  </>
                ) : (
                  "No hard red flags"
                )}
              </h3>
              {r.redFlags.length > 0 ? (
                <ul className="space-y-3">
                  {r.redFlags.map((f) => (
                    <li key={f} className="flex gap-3 text-sm leading-relaxed text-paper/85">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 animate-pulse-dot rounded-full bg-flame-400" />
                      {f}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm leading-relaxed text-paper/85">
                  Every dimension cleared the critical bar. Remaining work is polish: tighten the
                  narrative arc and make each number easier to find.
                </p>
              )}
            </div>
          </Reveal>

          <Reveal delay={90}>
            <div className="h-full rounded-[1.6rem] border border-paper/[0.08] bg-ink-800/50 p-8">
              <h3 className="mb-5 flex items-center gap-2.5 font-display text-2xl tracking-tight text-paper">
                <IconLock size={17} className="text-copper-400" />
                From your deck
              </h3>
              <p className="font-mono text-[12px] leading-relaxed text-paper-dim">
                “{r.excerpt.slice(0, 520)}
                {r.excerpt.length > 520 ? "…" : ""}”
              </p>
              <p className="mt-5 font-mono text-[9.5px] uppercase tracking-[0.2em] text-paper-dim/55">
                Extracted text · scored exactly as written
              </p>
            </div>
          </Reveal>
        </div>

        {/* coach */}
        <div className="mt-20">
          <Reveal>
            <h2 className="mb-3 font-display text-3xl tracking-tight text-paper md:text-4xl">
              Ask the coach<span className="text-copper-400">.</span>
            </h2>
            <p className="mb-8 max-w-2xl leading-relaxed text-paper-dim">
              Every answer is grounded in the {r.wordCount.toLocaleString()} words of this deck —
              weakest first: <span className="text-flame-300">{sorted[0]?.label}</span>, strongest:{" "}
              <span className="text-moss-300">{sorted[sorted.length - 1]?.label}</span>.
            </p>
          </Reveal>
          <Reveal delay={100}>
            <CoachChat sections={r.sections} redFlags={r.redFlags} summary={r.summary} />
          </Reveal>
        </div>

        {/* next */}
        <Reveal delay={120}>
          <div className="mt-16 flex flex-wrap items-center gap-4 border-t border-paper/[0.08] pt-10">
            <Link
              href="/upload"
              className="group inline-flex items-center gap-3 rounded-full bg-copper-400 px-8 py-4 text-base font-bold text-ink-950 transition-all duration-300 hover:-translate-y-0.5 hover:bg-copper-300"
            >
              Score another deck
              <IconArrow size={17} className="transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-3 rounded-full border border-paper/15 bg-paper/[0.04] px-8 py-4 text-base font-semibold text-paper transition-all duration-300 hover:-translate-y-0.5 hover:border-copper-400/40"
            >
              All reports
            </Link>
          </div>
        </Reveal>
      </div>
    </Shell>
  );
}
