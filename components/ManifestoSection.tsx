"use client";

import { Reveal } from "@/components/fx";
import { TextGenerateEffect } from "@/components/premium";

export default function ManifestoSection() {
  return (
    <section className="relative overflow-hidden border-y border-paper/[0.06] bg-ink-950/60 py-32 md:py-44">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 select-none font-display text-[22rem] leading-none text-paper/[0.025] md:text-[34rem]"
      >
        §
      </div>

      <div className="relative mx-auto max-w-5xl px-6 text-center md:px-10">
        <Reveal>
          <div className="mb-10 font-mono text-[10.5px] uppercase tracking-[0.3em] text-copper-300">
            The thesis
          </div>
        </Reveal>

        <TextGenerateEffect
          text="Most decks don't die in the meeting. They die in the six silent seconds before it — while a partner scans slide three and feels nothing."
          className="font-display text-4xl leading-[1.05] tracking-tight text-paper md:text-6xl"
          stagger={0.02}
        />

        <Reveal delay={600}>
          <p className="mx-auto mt-10 max-w-xl font-display text-2xl italic leading-snug text-copper-300 md:text-3xl">
            We built the machine that makes those seconds work for you.
          </p>
        </Reveal>

        <Reveal delay={800}>
          <div className="mx-auto mt-12 h-px w-40 bg-gradient-to-r from-transparent via-copper-400/60 to-transparent" />
        </Reveal>
      </div>
    </section>
  );
}
