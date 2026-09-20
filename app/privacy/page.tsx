import Link from "next/link";
import Shell from "@/components/Shell";
import { Reveal } from "@/components/fx";
import { IconArrow, IconLock } from "@/components/icons";

export const metadata = {
  title: "Privacy Policy — PitchPolish",
  description: "Understand how PitchPolish protects, isolates, and parses your proprietary pitch deck materials.",
};

const PRIVACY_ITEMS = [
  {
    tag: "Ingestion",
    title: "Information We Collect",
    body: (
      <>
        <p>
          We collect minimal telemetry necessary to authenticate your sessions and parse your pitch materials:
        </p>
        <ul className="mt-3 space-y-2 list-disc pl-5">
          <li><strong>Authentication Telemetry:</strong> Account identity and credentials managed securely via Clerk.</li>
          <li><strong>Document Payload:</strong> Uploaded presentation files (PDF/PPTX) and their extracted transcript text.</li>
          <li><strong>Diagnostic Artifacts:</strong> Generated numeric evaluations, dimension scores, identified friction points, and coaching transcript history.</li>
        </ul>
      </>
    ),
  },
  {
    tag: "Protection",
    title: "How We Treat Your Deck Data",
    body: (
      <>
        <p>
          Your strategic roadmap, financial models, cap table allocations, and proprietary IP remain strictly confidential:
        </p>
        <ul className="mt-3 space-y-2 list-disc pl-5">
          <li><strong>Zero Model Training:</strong> Your uploaded decks and transcripts are <em>never</em> used to train public foundation models.</li>
          <li><strong>Secure Isolated Queries:</strong> LLM interactions are executed via enterprise endpoints governed by zero-data retention policies.</li>
          <li><strong>Owner Scoping:</strong> Reports and verdicts are strictly bound to your authenticated user account in PostgreSQL.</li>
        </ul>
      </>
    ),
  },
  {
    tag: "Retention",
    title: "Data Lifecycle & Deletion",
    body: (
      <>
        <p>
          Verdicts persist in your account ledger until you choose to prune or delete them. If you evaluate a 
          deck in an ephemeral or demo state, parsed transcripts reside strictly in temporary server memory and 
          expire automatically within 60 minutes.
        </p>
        <p className="mt-3">
          You may request total purging of your account, audit history, and parsed excerpts at any time by contacting our engineering desk.
        </p>
      </>
    ),
  },
  {
    tag: "Subprocessors",
    title: "Infrastructure & Subprocessors",
    body: (
      <>
        <p>
          To maintain microsecond latency and high-integrity parsing, we leverage tier-one cloud providers:
        </p>
        <ul className="mt-3 space-y-2 list-disc pl-5">
          <li><strong>Clerk:</strong> Zero-trust identity authentication.</li>
          <li><strong>PostgreSQL:</strong> Managed relational storage for report telemetry.</li>
          <li><strong>Anthropic / OpenAI / Google AI:</strong> Real-time heuristic evaluation and coach reasoning models.</li>
        </ul>
      </>
    ),
  },
];

export default function PrivacyPage() {
  return (
    <Shell>
      <div className="relative isolate min-h-[calc(100vh-5rem)] overflow-hidden">
        {/* Subtle Ambient Background */}
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
              <span className="h-1.5 w-1.5 rounded-full bg-moss-400" />
              <span className="font-mono text-[10.5px] uppercase tracking-[0.28em] text-moss-300">
                Institutional Security & Privacy
              </span>
            </div>
            <h1 className="mt-4 font-display text-4xl leading-[0.95] tracking-tight text-paper sm:text-6xl">
              Privacy Architecture<span className="text-copper-400">.</span>
            </h1>
            <p className="mt-4 font-mono text-xs uppercase tracking-widest text-paper-dim/70">
              Last Audited: September 2026 · Zero-Training Guarantee
            </p>
          </Reveal>

          {/* Privacy Trust Banner */}
          <Reveal delay={100}>
            <div className="mt-10 flex items-start gap-4 rounded-2xl border border-moss-400/25 bg-moss-400/[0.05] p-6 backdrop-blur-md">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-moss-400/30 bg-moss-400/10 text-moss-300">
                <IconLock size={18} />
              </div>
              <div className="text-sm leading-relaxed text-paper/90">
                <strong className="text-moss-300">Zero Retention & Isolation Commitment:</strong> We recognize 
                that pre-raise pitch decks contain highly sensitive alpha. We do not index your documents into public 
                search registries, nor do we permit frontier models to train on your metrics.
              </div>
            </div>
          </Reveal>

          <div className="mt-14 space-y-12 border-t border-paper/[0.08] pt-12">
            {PRIVACY_ITEMS.map((item, i) => (
              <Reveal key={item.title} delay={Math.min(i * 60, 300)}>
                <div className="grid gap-6 md:grid-cols-12">
                  <div className="md:col-span-4">
                    <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-copper-400">
                      {item.tag}
                    </span>
                    <h2 className="mt-1 font-display text-2xl tracking-tight text-paper">{item.title}</h2>
                  </div>
                  <div className="text-sm leading-relaxed text-paper-dim/90 md:col-span-8">
                    {item.body}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={150}>
            <div className="mt-16 rounded-2xl border border-paper/[0.07] bg-ink-850/40 p-6 text-center font-mono text-xs text-paper-dim">
              Request transcript expulsion or data export:{" "}
              <a href="mailto:privacy@pitchpolish.com" className="text-copper-300 underline underline-offset-4 hover:text-copper-200">
                privacy@pitchpolish.com
              </a>
            </div>
          </Reveal>
        </div>
      </div>
    </Shell>
  );
}