"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Reveal } from "@/components/fx";
import { TextGenerateEffect } from "@/components/premium";
import { IconArrow } from "@/components/icons";

const FAQS = [
  {
    topic: "privacy",
    q: "Is my deck used to train anything?",
    a: "No. Your PDF is parsed in an isolated server environment, scored, and kept private to your reports. It is never used for model training and never visible to other users.",
  },
  {
    topic: "scoring",
    q: "How is the score calculated?",
    a: "Nine weighted dimensions — problem, solution, market, model, traction, team, competition, financials, ask. Each is scored zero to ten against signals in your actual text, then weighted into one verdict out of a hundred.",
  },
  {
    topic: "product",
    q: "What counts as a deck?",
    a: "Any text-based PDF — a one-pager to a forty-slide Series A memo. Scanned, image-only PDFs can't be read; we tell you immediately instead of charging you for a guess.",
  },
  {
    topic: "scoring",
    q: "Can it really replace VC feedback?",
    a: "It replaces the first brutal pass — the one where most decks die silently. It won't take the meeting for you, but you'll walk in with the obvious kills already fixed.",
  },
  {
    topic: "billing",
    q: "What happens after the free analysis?",
    a: "Nineteen dollars a month unlocks unlimited analyses, the coach, and executive summaries. Cancel in two clicks — your reports stay readable forever.",
  },
  {
    topic: "product",
    q: "My deck lives in Canva or Notion. Will this work?",
    a: "Export or print it to a PDF with selectable text and you're in. Canva's PDF Standard and Notion's PDF export both produce readable text; a scanned screenshot does not.",
  },
  {
    topic: "privacy",
    q: "Who can see my reports?",
    a: "Only your account. Reports are private by default, exportable, and deletable. When team spaces ship, sharing will be opt-in per report — never silent.",
  },
];

export default function FaqSection() {
  const router = useRouter();
  const [open, setOpen] = useState(0);
  const [sampleLoading, setSampleLoading] = useState(false);

  const openSample = async () => {
    if (sampleLoading) return;
    setSampleLoading(true);
    try {
      const res = await fetch("/api/sample", { method: "POST" });
      const data = (await res.json()) as { id?: number };
      if (data.id) router.push(`/report/${data.id}`);
    } catch {
      setSampleLoading(false);
    }
  };

  return (
    <section id="faq" className="relative mx-auto max-w-7xl scroll-mt-24 px-6 pb-32 md:px-10 md:pb-44">
      <div className="grid gap-16 lg:grid-cols-12 lg:gap-10">
        {/* sticky intro + office hours card */}
        <div className="lg:col-span-4">
          <div className="space-y-9 lg:sticky lg:top-28">
            <Reveal>
              <div className="mb-5 font-mono text-[10.5px] uppercase tracking-[0.28em] text-copper-300">
                07 — Straight answers
              </div>
              <h2 className="font-display text-5xl leading-[0.95] tracking-tight text-paper md:text-7xl">
                Asked,
                <br />
                <em className="copper-shimmer">answered.</em>
              </h2>
              <p className="mt-6 max-w-sm text-lg font-light leading-relaxed text-paper-dim">
                Seven questions, zero sales calls. If yours isn&apos;t here, the coach reads decks —
                and it answers faster than we do.
              </p>
            </Reveal>

            <Reveal delay={140}>
              <div className="relative overflow-hidden rounded-[1.6rem] border border-paper/[0.09] bg-ink-800/60 p-7">
                <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(214,129,79,0.1),transparent_60%)]" />
                <div className="relative">
                  <div className="flex items-center gap-2.5">
                    <span className="h-2 w-2 animate-pulse-dot rounded-full bg-moss-400" />
                    <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-moss-300">
                      coach online · ~48s answers
                    </span>
                  </div>
                  <p className="mt-4 font-display text-2xl leading-snug tracking-tight text-paper">
                    Office hours are always open.
                  </p>
                  <p className="mt-2 text-[13.5px] leading-relaxed text-paper-dim">
                    Ask it anything about your deck — it answers with your numbers, not these FAQs.
                  </p>
                  <div className="mt-6 flex flex-col gap-3">
                    <button
                      onClick={openSample}
                      disabled={sampleLoading}
                      className="btn-shine group inline-flex items-center justify-center gap-2.5 rounded-full bg-copper-400 px-6 py-3 text-sm font-bold text-ink-950 transition-colors hover:bg-copper-300 disabled:pointer-events-none disabled:opacity-60"
                    >
                      {sampleLoading ? "Opening the sample…" : "Interrogate the sample report"}
                      {!sampleLoading && <IconArrow size={14} className="transition-transform group-hover:translate-x-0.5" />}
                    </button>
                    <Link
                      href="/upload"
                      className="inline-flex items-center justify-center gap-2.5 rounded-full border border-paper/15 bg-paper/[0.04] px-6 py-3 text-sm font-semibold text-paper transition hover:border-copper-400/40"
                    >
                      Or bring your own deck
                    </Link>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>

        {/* the ledger */}
        <div className="lg:col-span-8">
          <div className="border-t border-paper/[0.08]">
            {FAQS.map((f, i) => {
              const isOpen = open === i;
              return (
                <Reveal key={f.q} delay={Math.min(i * 50, 200)}>
                  <div className="border-b border-paper/[0.08]">
                    <button
                      onClick={() => setOpen(isOpen ? -1 : i)}
                      aria-expanded={isOpen}
                      className="group grid w-full grid-cols-[auto_1fr_auto] items-baseline gap-5 py-7 text-left md:gap-8"
                    >
                      <span
                        className={`font-mono text-xs tabular-nums tracking-[0.2em] transition-colors duration-400 ${
                          isOpen ? "text-copper-300" : "text-paper-dim/60 group-hover:text-copper-300/80"
                        }`}
                      >
                        Q.{String(i + 1).padStart(2, "0")}
                      </span>
                      <span
                        className={`font-display text-2xl leading-tight tracking-tight transition-all duration-400 group-hover:translate-x-1.5 md:text-3xl ${
                          isOpen ? "text-copper-200" : "text-paper"
                        }`}
                      >
                        {f.q}
                      </span>
                      <span
                        className={`self-center rounded-full border p-2 transition-all duration-400 ${
                          isOpen
                            ? "rotate-45 border-copper-400/60 text-copper-300"
                            : "border-paper/15 text-paper-dim group-hover:border-copper-400/40"
                        }`}
                      >
                        <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                          <path d="M8 2.5v11M2.5 8h11" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                        </svg>
                      </span>
                    </button>

                    {/* animated hairline under the active question */}
                    <div className="relative -mt-px h-px w-full bg-paper/[0.05]">
                      <motion.div
                        className="absolute inset-0 origin-left bg-gradient-to-r from-copper-400 to-copper-400/20"
                        initial={false}
                        animate={{ scaleX: isOpen ? 1 : 0 }}
                        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                      />
                    </div>

                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          key="a"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                          className="overflow-hidden"
                        >
                          <div className="grid gap-5 py-7 pl-0 md:grid-cols-[auto_1fr] md:gap-8 md:pl-[3.25rem]">
                            <span className="hidden w-fit rounded-full border border-paper/10 bg-paper/[0.03] px-3 py-1 font-mono text-[9px] uppercase tracking-[0.22em] text-paper-dim md:block">
                              {f.topic}
                            </span>
                            <div>
                              <TextGenerateEffect
                                text={f.a}
                                className="max-w-2xl text-[15.5px] leading-relaxed text-paper-dim"
                                stagger={0.016}
                              />
                              <p className="mt-4 font-mono text-[9.5px] uppercase tracking-[0.22em] text-paper-dim/50">
                                — the machine, tuned on 1,200+ real decks
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </Reveal>
              );
            })}
          </div>

          <Reveal delay={150}>
            <p className="mt-8 font-mono text-[10px] uppercase tracking-[0.22em] text-paper-dim/50">
              still curious? read the{" "}
              <Link href="/report/1" className="text-copper-300 underline decoration-copper-400/40 underline-offset-4 transition hover:text-copper-200">
                sample verdict
              </Link>{" "}
              — it answers most of it
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
