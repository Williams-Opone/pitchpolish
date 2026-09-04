import Link from "next/link";
import { desc } from "drizzle-orm";
import { db } from "@/db";
import { reports } from "@/db/schema";
import Shell from "@/components/Shell";
import GenerateSampleButton from "@/components/GenerateSampleButton";
import { Reveal } from "@/components/fx";
import { SpotlightCard } from "@/components/premium";
import { IconArrow, IconFlag } from "@/components/icons";

export const dynamic = "force-dynamic";

const scoreTone = (s: number) =>
  s >= 80
    ? "text-moss-300 border-moss-400/30 bg-moss-400/[0.08]"
    : s >= 55
      ? "text-copper-300 border-copper-400/30 bg-copper-400/[0.08]"
      : "text-flame-300 border-flame-400/30 bg-flame-400/[0.08]";

export default async function DashboardPage() {
  const rows = await db.select().from(reports).orderBy(desc(reports.createdAt)).limit(50);

  const avg = rows.length ? Math.round(rows.reduce((a, r) => a + r.score, 0) / rows.length) : 0;
  const best = rows.length ? Math.max(...rows.map((r) => r.score)) : 0;

  return (
    <Shell>
      <div className="mx-auto max-w-6xl px-6 py-16 md:px-10 md:py-24">
        <Reveal>
          <div className="mb-5 font-mono text-[10.5px] uppercase tracking-[0.28em] text-copper-300">
            The ledger
          </div>
          <h1 className="font-display text-5xl leading-[0.92] tracking-tighter text-paper md:text-7xl">
            Your verdicts<span className="text-copper-400">.</span>
          </h1>
        </Reveal>

        {rows.length > 0 ? (
          <>
            <Reveal delay={100}>
              <dl className="mt-10 flex flex-wrap gap-x-14 gap-y-6 border-y border-paper/[0.08] py-7">
                <div>
                  <dt className="font-mono text-[10px] uppercase tracking-[0.25em] text-paper-dim/70">Decks scored</dt>
                  <dd className="mt-1 font-display text-4xl text-paper">{rows.length}</dd>
                </div>
                <div>
                  <dt className="font-mono text-[10px] uppercase tracking-[0.25em] text-paper-dim/70">Average score</dt>
                  <dd className="mt-1 font-display text-4xl text-copper-300">{avg}</dd>
                </div>
                <div>
                  <dt className="font-mono text-[10px] uppercase tracking-[0.25em] text-paper-dim/70">Best score</dt>
                  <dd className="mt-1 font-display text-4xl text-moss-300">{best}</dd>
                </div>
              </dl>
            </Reveal>

            <div className="mt-10 space-y-3">
              {rows.map((r, i) => (
                <Reveal key={r.id} delay={Math.min(i * 60, 300)}>
                  <Link href={`/report/${r.id}`} className="group block">
                    <SpotlightCard
                      radius="1.25rem"
                      className="border border-paper/[0.08] bg-ink-800/50 transition-transform duration-300 group-hover:-translate-y-0.5"
                    >
                      <div className="flex flex-col gap-4 p-6 md:flex-row md:items-center md:gap-8">
                    <div className={`flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-2xl border font-display ${scoreTone(r.score)}`}>
                      <span className="text-2xl leading-none">{r.score}</span>
                      <span className="mt-0.5 font-mono text-[8px] uppercase tracking-[0.15em] opacity-70">/100</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                        <h2 className="font-display text-xl tracking-tight text-paper transition-colors group-hover:text-copper-300 md:text-2xl">
                          {r.deckName}
                        </h2>
                        {r.isSample && (
                          <span className="rounded-full border border-copper-400/30 bg-copper-400/[0.08] px-2.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.18em] text-copper-300">
                            Sample
                          </span>
                        )}
                      </div>
                      <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.18em] text-paper-dim/80">
                        {r.band} · {r.slideCount} pages ·{" "}
                        {r.redFlags.length > 0 ? `${r.redFlags.length} red flag${r.redFlags.length > 1 ? "s" : ""}` : "no red flags"}
                      </p>
                    </div>
                    <div className="flex items-center gap-5">
                      <span className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-paper-dim/60">
                        {new Date(r.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
                      </span>
                      <IconArrow size={17} className="text-paper-dim transition-all duration-300 group-hover:translate-x-1 group-hover:text-copper-300" />
                      </div>
                      </div>
                    </SpotlightCard>
                  </Link>
                </Reveal>
              ))}
            </div>

            <Reveal delay={200}>
              <div className="mt-12">
                <Link
                  href="/upload"
                  className="group inline-flex items-center gap-3 rounded-full bg-copper-400 px-8 py-4 text-base font-bold text-ink-950 transition-all duration-300 hover:-translate-y-0.5 hover:bg-copper-300"
                >
                  Score another deck
                  <IconArrow size={17} className="transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </Reveal>
          </>
        ) : (
          <Reveal delay={100}>
            <div className="mt-12 rounded-[2rem] border border-paper/[0.08] bg-ink-800/50 p-10 text-center md:p-16">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-copper-400/25 bg-copper-400/[0.07] text-copper-300">
                <IconFlag size={22} />
              </div>
              <h2 className="font-display text-3xl tracking-tight text-paper md:text-4xl">No verdicts yet.</h2>
              <p className="mx-auto mt-3 max-w-md leading-relaxed text-paper-dim">
                Upload your first deck and get a nine-dimension score with every red flag named —
                or open the sample to see what a full report looks like.
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                <Link
                  href="/upload"
                  className="group inline-flex items-center gap-3 rounded-full bg-copper-400 px-7 py-3.5 text-base font-bold text-ink-950 transition-all duration-300 hover:-translate-y-0.5 hover:bg-copper-300"
                >
                  Analyze your deck
                  <IconArrow size={16} className="transition-transform group-hover:translate-x-1" />
                </Link>
                <GenerateSampleButton />
              </div>
            </div>
          </Reveal>
        )}
      </div>
    </Shell>
  );
}
