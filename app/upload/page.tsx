"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Shell from "@/components/Shell";
import { Reveal } from "@/components/fx";
import { ShineBorder } from "@/components/premium";
import { IconArrow, IconLock } from "@/components/icons";
import { CRITERIA_META } from "@/lib/analyzer";

const MAX_BYTES = 10 * 1024 * 1024;

const STAGES = [
  "Uploading deck…",
  "Parsing pages…",
  "Extracting slide text…",
  "Scoring nine dimensions…",
  "Compiling red flags…",
  "Writing your verdict…",
];

export default function UploadPage() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [busy, setBusy] = useState(false);
  const [stage, setStage] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!busy) return;
    const id = window.setInterval(() => setStage((s) => Math.min(s + 1, STAGES.length - 1)), 900);
    return () => window.clearInterval(id);
  }, [busy]);

  const accept = (f: File | undefined) => {
    setError(null);
    if (!f) return;
    if (!/\.pdf$/i.test(f.name) && f.type !== "application/pdf") {
      setError("Only PDF decks are supported.");
      return;
    }
    if (f.size > MAX_BYTES) {
      setError("That deck is over 10 MB. Trim it and retry.");
      return;
    }
    setFile(f);
  };

  const run = async () => {
    if (!file || busy) return;
    setBusy(true);
    setStage(0);
    setError(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/analyze", { method: "POST", body: fd });
      const data = (await res.json()) as { id?: number; error?: string };
      if (!res.ok || !data.id) {
        throw new Error(data.error ?? "Analysis failed.");
      }
      router.push(`/report/${data.id}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Analysis failed unexpectedly.");
      setBusy(false);
    }
  };

  return (
    <Shell>
      <div className="mx-auto max-w-6xl px-6 py-16 md:px-10 md:py-24">
        <div className="grid gap-14 lg:grid-cols-5">
          {/* left — copy */}
          <div className="lg:col-span-2">
            <Reveal>
              <div className="mb-5 font-mono text-[10.5px] uppercase tracking-[0.28em] text-copper-300">
                New analysis
              </div>
              <h1 className="font-display text-5xl leading-[0.92] tracking-tighter text-paper md:text-6xl">
                Submit your
                <br />
                deck<span className="text-copper-400">.</span>
              </h1>
              <p className="mt-6 max-w-sm text-lg font-light leading-relaxed text-paper-dim">
                A text-based PDF, one-pager to 40 slides. You&apos;ll have a scored verdict in
                under a minute.
              </p>

              <div className="mt-9 flex flex-wrap gap-2">
                {CRITERIA_META.map((c) => (
                  <span
                    key={c.key}
                    className="rounded-full border border-paper/10 bg-paper/[0.03] px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-paper-dim"
                  >
                    {c.label} ×{c.weight}
                  </span>
                ))}
              </div>

              <p className="mt-9 flex items-start gap-2.5 text-[13px] leading-relaxed text-paper-dim/80">
                <IconLock size={15} className="mt-0.5 shrink-0 text-copper-400" />
                Parsed in an isolated server environment. Never used for training, never visible
                to anyone but you.
              </p>
            </Reveal>
          </div>

          {/* right — dropzone */}
          <div className="lg:col-span-3">
            <Reveal delay={120}>
              <ShineBorder radius="2rem" duration={6}>
              <div
                role="button"
                tabIndex={0}
                aria-label="Upload your pitch deck PDF"
                onClick={() => !busy && inputRef.current?.click()}
                onKeyDown={(e) => {
                  if ((e.key === "Enter" || e.key === " ") && !busy) inputRef.current?.click();
                }}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragOver(false);
                  if (!busy) accept(e.dataTransfer.files?.[0]);
                }}
                className={`relative cursor-pointer overflow-hidden rounded-[2rem] border-2 border-dashed p-10 text-center transition-all duration-300 md:p-16 ${
                  dragOver
                    ? "border-copper-400 bg-copper-400/[0.07] scale-[1.01]"
                    : "border-paper/15 bg-ink-800/50 hover:border-copper-400/40 hover:bg-ink-800/80"
                } ${busy ? "pointer-events-none opacity-80" : ""}`}
              >
                <input
                  ref={inputRef}
                  type="file"
                  accept="application/pdf,.pdf"
                  className="hidden"
                  onClick={(e) => e.stopPropagation()}
                  onChange={(e) => accept(e.target.files?.[0] ?? undefined)}
                />

                {!busy ? (
                  <>
                    <div className="mx-auto mb-7 flex h-20 w-20 items-center justify-center rounded-3xl border border-copper-400/25 bg-copper-400/[0.07] text-copper-300 shadow-[inset_0_0_30px_rgba(232,168,124,0.12)]">
                      <svg width="34" height="34" viewBox="0 0 32 32" fill="none" aria-hidden="true">
                        <path d="M16 21V6.5M16 6.5 10.5 12M16 6.5 21.5 12" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M6 20v4.5A1.5 1.5 0 0 0 7.5 26h17a1.5 1.5 0 0 0 1.5-1.5V20" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
                      </svg>
                    </div>
                    {file ? (
                      <>
                        <p className="font-display text-2xl text-paper">{file.name}</p>
                        <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.2em] text-paper-dim">
                          {(file.size / 1024 / 1024).toFixed(2)} MB · ready to score
                        </p>
                      </>
                    ) : (
                      <>
                        <p className="font-display text-2xl text-paper md:text-3xl">
                          Drag your deck here
                        </p>
                        <p className="mt-2 text-paper-dim">
                          or <span className="font-semibold text-copper-300 underline decoration-copper-400/40 underline-offset-4">browse files</span>
                        </p>
                        <p className="mt-5 font-mono text-[10.5px] uppercase tracking-[0.2em] text-paper-dim/70">
                          PDF only · up to 10 MB
                        </p>
                      </>
                    )}
                  </>
                ) : (
                  <div className="py-6">
                    <div className="mx-auto mb-6 h-10 w-10 animate-spin rounded-full border-2 border-copper-400/20 border-t-copper-400" />
                    <p className="font-display text-2xl text-paper">{STAGES[stage]}</p>
                    <div className="mx-auto mt-6 h-1 w-56 overflow-hidden rounded-full bg-paper/[0.08]">
                      <div
                        className="h-full bg-copper-400 transition-all duration-700"
                        style={{ width: `${((stage + 1) / STAGES.length) * 100}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
              </ShineBorder>

              {error && (
                <div className="mt-4 rounded-2xl border border-flame-400/30 bg-flame-400/[0.08] px-5 py-4 text-sm leading-relaxed text-flame-300">
                  {error}
                </div>
              )}

              <div className="mt-6 flex flex-wrap items-center gap-4">
                <button
                  onClick={run}
                  disabled={!file || busy}
                  className="group inline-flex items-center gap-3 rounded-full bg-copper-400 px-8 py-4 text-base font-bold text-ink-950 shadow-[0_0_50px_-14px_rgba(232,168,124,0.55)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-copper-300 disabled:pointer-events-none disabled:opacity-40"
                >
                  {busy ? "Scoring…" : "Run the analysis"}
                  {!busy && <IconArrow size={17} className="transition-transform group-hover:translate-x-1" />}
                </button>
                <span className="text-sm text-paper-dim">
                  No deck handy?{" "}
                  <Link href="/" className="font-semibold text-copper-300 underline decoration-copper-400/40 underline-offset-4 hover:text-copper-200">
                    Read the sample report
                  </Link>
                </span>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </Shell>
  );
}
