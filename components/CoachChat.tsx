"use client";

import { useEffect, useRef, useState } from "react";
import type { SectionScore } from "@/lib/types";

const FIX_ADVICE: Record<string, string> = {
  market:
    "Rebuild the slide in three lines: TAM bottom-up (reachable customers × annual spend), SAM (the slice your GTM touches in 24 months), SOM (a defensible 3-year capture). Put a citation next to every number.",
  traction:
    "Show one honest metric moving up: MRR, waitlist, retention, or signed LOIs. Format it as 'X today — up Y% month-over-month since Z.' Small and specific beats big and vague.",
  team:
    "Give each founder one credibility line: relevant exits, years in the domain, or distribution they own. Then close with a single sentence: 'We are the team that wins this because…'",
  problem:
    "Name the persona, the weekly moment of pain, and its dollar cost. One real customer quote outweighs three adjectives.",
  solution:
    "Write one sentence an investor can repeat back: 'We help X do Y without Z.' Then show the before/after workflow — old way vs. your way.",
  competition:
    "Name 3–5 rivals including the status quo (spreadsheets count). A table with one sharp 'wedge' row beats a magic quadrant nobody believes.",
  financials:
    "Add an 18–24 month projection tied to hiring and CAC assumptions, plus burn and post-round runway. 'Projections on request' reads as 'we don't have any.'",
  ask:
    "State the amount, the instrument, the use-of-funds split, and the milestone it buys — e.g. '$1.5M seed, 60/25/15, to 10k customers and 18 months runway.'",
  model:
    "Say who pays, the price point, and the gross margin. If pricing is untested, show the willingness-to-pay evidence you'd bet the round on.",
};

const KEY_ALIASES: Record<string, string[]> = {
  market: ["market", "tam", "sam", "som", "sizing"],
  traction: ["traction", "users", "growth", "mrr", "retention", "metric"],
  team: ["team", "founder", "hire", "why us", "why me"],
  problem: ["problem", "pain", "customer need"],
  solution: ["solution", "product", "demo", "feature"],
  competition: ["compet", "rival", "moat", "incumbent", "different"],
  financials: ["financial", "projection", "forecast", "burn", "runway"],
  ask: ["ask", "raising", "round", "use of funds", "valuation"],
  model: ["pricing", "business model", "revenue model", "margin"],
};

interface Msg {
  role: "user" | "coach";
  text: string;
}

function findKey(q: string): string | null {
  for (const [key, aliases] of Object.entries(KEY_ALIASES)) {
    if (aliases.some((a) => q.includes(a))) return key;
  }
  return null;
}

function buildAnswer(q: string, sections: SectionScore[], redFlags: string[], summary: string): string {
  const byKey = new Map(sections.map((s) => [s.key, s]));

  if (/(weak|worst|first|priorit|start with|biggest issue)/.test(q)) {
    const worst = [...sections].sort((a, b) => a.score - b.score)[0];
    return `Your weakest dimension is ${worst.label} at ${worst.score}/10 (weight ×${worst.weight}%) — ${worst.note.toLowerCase()} ${
      FIX_ADVICE[worst.key] ?? ""
    }`;
  }
  if (/(strong|best|good at|working)/.test(q)) {
    const best = [...sections].sort((a, b) => b.score - a.score)[0];
    return `${best.label} is carrying you at ${best.score}/10 — ${best.note.toLowerCase()} Lean into it: move that evidence earlier in the deck and echo it in your one-liner.`;
  }
  if (/(flag|red|reject|kill)/.test(q)) {
    return redFlags.length > 0
      ? `I counted ${redFlags.length} red flag${redFlags.length > 1 ? "s" : ""}: ${redFlags.join(" · ")}`
      : "No hard red flags. What remains is polish — tighten the narrative and the numbers.";
  }
  if (/(score|overall|verdict|how did|summary)/.test(q)) {
    return summary;
  }

  const key = findKey(q);
  if (key && byKey.has(key)) {
    const s = byKey.get(key)!;
    const flag =
      s.score <= 3 && redFlags.length > 0
        ? ` This is one of your ${redFlags.length} recorded red flags — fix it before anything else.`
        : "";
    return `${s.label} scored ${s.score}/10 (weight ×${s.weight}%). ${s.note} ${FIX_ADVICE[key] ?? ""}${flag}`;
  }

  return `${summary} Ask me about a specific dimension — market, traction, team, the ask — and I'll answer with your deck's own numbers.`;
}

const SUGGESTIONS = [
  "What's my weakest section?",
  "How do I fix my market slide?",
  "What would an investor attack first?",
  "Summarize my verdict",
];

export default function CoachChat({
  sections,
  redFlags,
  summary,
}: {
  sections: SectionScore[];
  redFlags: string[];
  summary: string;
}) {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, thinking]);

  const ask = (raw: string) => {
    const q = raw.trim();
    if (!q || thinking) return;
    setMessages((m) => [...m, { role: "user", text: q }]);
    setInput("");
    setThinking(true);
    window.setTimeout(() => {
      setMessages((m) => [...m, { role: "coach", text: buildAnswer(q.toLowerCase(), sections, redFlags, summary) }]);
      setThinking(false);
    }, 650);
  };

  return (
    <div className="overflow-hidden rounded-[1.6rem] border border-paper/[0.09] bg-ink-800/60">
      <div className="flex items-center justify-between border-b border-paper/[0.07] px-6 py-4">
        <div className="flex items-center gap-2.5">
          <span className="h-2 w-2 animate-pulse-dot rounded-full bg-copper-400" />
          <span className="font-mono text-[10.5px] uppercase tracking-[0.24em] text-copper-300">
            Coach · grounded in your deck
          </span>
        </div>
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-paper-dim/60">
          {redFlags.length} flags on file
        </span>
      </div>

      <div ref={scrollRef} className="max-h-[420px] min-h-[220px] space-y-4 overflow-y-auto p-6">
        {messages.length === 0 && (
          <p className="text-sm leading-relaxed text-paper-dim/80">
            I read every word of your deck. Ask me what to fix, what an investor would attack, or
            how to rewrite a slide — I answer with your numbers, not templates.
          </p>
        )}
        {messages.map((m, i) => (
          <div key={i} className={m.role === "user" ? "flex justify-end" : "flex justify-start"}>
            <div
              className={`max-w-[88%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                m.role === "user"
                  ? "rounded-br-md bg-paper/[0.09] text-paper"
                  : "rounded-bl-md border border-copper-400/15 bg-copper-400/[0.05] text-paper/90"
              }`}
            >
              {m.text}
            </div>
          </div>
        ))}
        {thinking && (
          <div className="flex items-center gap-2 pl-1 font-mono text-[10.5px] uppercase tracking-[0.2em] text-paper-dim/70">
            <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-copper-400" />
            Reading your deck…
          </div>
        )}
      </div>

      <div className="border-t border-paper/[0.07] p-4">
        <div className="mb-3 flex flex-wrap gap-2">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              onClick={() => ask(s)}
              disabled={thinking}
              className="rounded-full border border-paper/12 bg-paper/[0.03] px-3.5 py-1.5 text-xs font-semibold text-paper-dim transition hover:border-copper-400/40 hover:text-copper-300 disabled:opacity-50"
            >
              {s}
            </button>
          ))}
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            ask(input);
          }}
          className="flex gap-3"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about your deck…"
            aria-label="Ask the coach about your deck"
            className="flex-1 rounded-full border border-paper/12 bg-ink-950/70 px-5 py-3 text-sm text-paper placeholder:text-paper-dim/50 focus:border-copper-400/50 focus:outline-none"
          />
          <button
            type="submit"
            disabled={thinking || !input.trim()}
            className="rounded-full bg-copper-400 px-6 py-3 text-sm font-bold text-ink-950 transition hover:bg-copper-300 disabled:pointer-events-none disabled:opacity-40"
          >
            Ask
          </button>
        </form>
      </div>
    </div>
  );
}
