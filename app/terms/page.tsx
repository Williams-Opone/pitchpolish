import Link from "next/link";
import Shell from "@/components/Shell";
import { Reveal } from "@/components/fx";
import { IconArrow } from "@/components/icons";

export const metadata = {
  title: "Terms & Conditions — PitchPolish",
  description: "Terms governing use of the PitchPolish pitch deck scoring and intelligence platform.",
};

const SECTIONS = [
  {
    num: "01",
    title: "Acceptance & Service Scope",
    content: (
      <>
        <p>
          By accessing PitchPolish, uploading materials, or interacting with our automated diagnostic 
          infrastructure, you agree to be bound by these Terms and Conditions. PitchPolish provides 
          automated venture-grade presentation diagnostics, benchmark rubric evaluations, and AI-assisted 
          coaching based on submitted deck transcripts.
        </p>
        <p className="mt-3">
          Our service acts as an informational evaluation tool. It does not constitute broker-dealer 
          activity, formal underwriting, guaranteed investment commitments, or legal financial advice.
        </p>
      </>
    ),
  },
  {
    num: "02",
    title: "Intellectual Property & Proprietary Decks",
    content: (
      <>
        <p>
          <strong>You retain 100% ownership</strong> of all presentations, trademarks, cap table figures, 
          and strategic intellectual property submitted through our ingestion pipeline.
        </p>
        <p className="mt-3">
          By submitting a deck, you grant PitchPolish a strictly limited, non-exclusive, revocable license 
          to parse, OCR-extract, and process the textual content exclusively for generating your diagnostics, 
          scoring metrics, and interactive session responses. We do not sell your proprietary deck data to third parties.
        </p>
      </>
    ),
  },
  {
    num: "03",
    title: "AI Synthesis & Benchmark Accuracy",
    content: (
      <>
        <p>
          The evaluation scores, red flags, and coach responses are derived from automated heuristics and 
          large language model inference engines. While our rubrics are tuned against institutional venture capital 
          norms (e.g., TAM derivation, team signaling, and narrative cadence), PitchPolish does not guarantee 
          that achieving a score of 80+ will secure capital or term sheets from investors.
        </p>
      </>
    ),
  },
  {
    num: "04",
    title: "Account Integrity & Fair Usage",
    content: (
      <>
        <p>
          You agree not to reverse-engineer our proprietary scoring weights, abuse rate limits on interactive 
          teardown chat endpoints, or submit files containing malware, harmful scripts, or unauthorized confidential 
          data belonging to non-consenting third parties. We reserve the right to restrict access to accounts 
          exhibiting anomalous query bursts.
        </p>
      </>
    ),
  },
  {
    num: "05",
    title: "Limitation of Liability",
    content: (
      <>
        <p>
          PitchPolish, its developers, and affiliates shall not be held liable for any lost capital, 
          unsuccessful fundraising rounds, investor rejections, or indirect damages resulting from reliance 
          on the platform&apos;s scores, suggestions, or editorial feedback.
        </p>
      </>
    ),
  },
  {
    num: "06",
    title: "Amendments & Modifications",
    content: (
      <>
        <p>
          We reserve the right to refine these terms as our scoring rubrics and legal requirements expand. 
          Continued utilization of the platform following published adjustments constitutes binding 
          acceptance of the updated protocol.
        </p>
      </>
    ),
  },
];

export default function TermsPage() {
  return (
    <Shell>
      <div className="relative isolate min-h-[calc(100vh-5rem)] overflow-hidden">
        {/* Subtle Ambient Glow */}
        <div className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-copper-500/[0.03] blur-[140px]" />

        <div className="mx-auto max-w-4xl px-6 py-14 md:px-10 md:py-24">
          <Reveal>
            <Link
              href="/"
              className="group inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.22em] text-paper-dim transition hover:text-copper-300"
            >
              <IconArrow size={13} className="rotate-180 transition-transform group-hover:-translate-x-1" />
              Return Home
            </Link>
          </Reveal>

          <Reveal delay={80}>
            <div className="mt-8 flex items-center gap-2.5">
              <span className="h-1.5 w-1.5 rounded-full bg-copper-400" />
              <span className="font-mono text-[10.5px] uppercase tracking-[0.28em] text-copper-300">
                Legal Protocol
              </span>
            </div>
            <h1 className="mt-4 font-display text-4xl leading-[0.95] tracking-tight text-paper sm:text-6xl">
              Terms & Conditions<span className="text-copper-400">.</span>
            </h1>
            <p className="mt-4 font-mono text-xs uppercase tracking-widest text-paper-dim/70">
              Effective Date: September 2026 · Protocol Version 1.4
            </p>
          </Reveal>

          <div className="mt-14 space-y-12 border-t border-paper/[0.08] pt-12">
            {SECTIONS.map((sec, i) => (
              <Reveal key={sec.num} delay={Math.min(i * 60, 300)}>
                <div className="grid gap-6 md:grid-cols-12">
                  <div className="md:col-span-4">
                    <span className="font-mono text-xs font-semibold text-copper-400">{sec.num}</span>
                    <h2 className="mt-1 font-display text-2xl tracking-tight text-paper">{sec.title}</h2>
                  </div>
                  <div className="text-sm leading-relaxed text-paper-dim/90 md:col-span-8">
                    {sec.content}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={150}>
            <div className="mt-16 rounded-2xl border border-paper/[0.07] bg-ink-850/40 p-6 text-center font-mono text-xs text-paper-dim">
              Questions regarding these protocols? Inquire at{" "}
              <a href="mailto:legal@pitchpolish.com" className="text-copper-300 underline underline-offset-4 hover:text-copper-200">
                legal@pitchpolish.com
              </a>
            </div>
          </Reveal>
        </div>
      </div>
    </Shell>
  );
}