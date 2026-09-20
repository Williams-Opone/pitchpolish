// src/components/CoachChat.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import type { SectionScore } from "@/lib/types";

interface Msg {
  role: "user" | "coach";
  text: string;
}

interface CoachChatProps {
  deckId?: string | number;
  deckName: string;
  score: number;
  band: string;
  sections: SectionScore[];
  redFlags: string[];
  summary: string;
  excerpt: string;
}

const SUGGESTIONS = [
  "What's my weakest section?",
  "How do I fix my market sizing slide?",
  "What will an investor attack first?",
  "Give me an improved one-liner for my solution",
];

export default function CoachChat({
  deckName,
  score,
  band,
  sections,
  redFlags,
  summary,
  excerpt,
}: CoachChatProps) {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, thinking]);

  const ask = async (raw: string) => {
    const q = raw.trim();
    if (!q || thinking) return;

    const userMessage: Msg = { role: "user", text: q };
    const updatedMessages = [...messages, userMessage];

    setMessages(updatedMessages);
    setInput("");
    setThinking(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: q,
          history: messages,
          context: {
            deckName,
            score,
            band,
            summary,
            excerpt,
            redFlags,
            sections,
          },
        }),
      });

      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }

      const data = await res.json();
      const reply = data.reply || "No feedback generated.";

      setMessages((prev) => [...prev, { role: "coach", text: reply }]);
    } catch (err) {
      console.error("Coach request failed:", err);
      setMessages((prev) => [
        ...prev,
        {
          role: "coach",
          text: "I couldn't reach the coaching engine right now. Please ensure your API key and server connection are active.",
        },
      ]);
    } finally {
      setThinking(false);
    }
  };

  return (
    <div className="overflow-hidden rounded-[1.6rem] border border-paper/[0.09] bg-ink-800/60 shadow-xl backdrop-blur-md">
      {/* Header bar */}
      <div className="flex items-center justify-between border-b border-paper/[0.07] px-6 py-4">
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-copper-400 opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-copper-400" />
          </span>
          <span className="font-mono text-[10.5px] uppercase tracking-[0.24em] text-copper-300">
            Partner AI · Live Deck Teardown
          </span>
        </div>
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-paper-dim/60">
          {redFlags.length} flags registered
        </span>
      </div>

      {/* Message Feed */}
      <div
        ref={scrollRef}
        className="max-h-[460px] min-h-[260px] space-y-4 overflow-y-auto p-6"
      >
        {messages.length === 0 && (
          <div className="rounded-2xl border border-paper/[0.05] bg-ink-950/40 p-5 text-sm leading-relaxed text-paper-dim/80">
            <p className="text-paper">
              I have ingested the full transcript and score sheet for{" "}
              <strong className="text-copper-300 font-semibold">{deckName}</strong> ({score}/100).
            </p>
            <p className="mt-2">
              Ask how an institutional LP or lead investor will dissect your valuation, how to rewrite your go-to-market slide, or how to eliminate your identified red flags.
            </p>
          </div>
        )}

        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-5 py-3.5 text-sm leading-relaxed ${
                m.role === "user"
                  ? "rounded-br-md bg-paper/[0.09] text-paper shadow-sm"
                  : "rounded-bl-md border border-copper-400/20 bg-copper-400/[0.06] text-paper/95 shadow-md"
              }`}
            >
              {m.text}
            </div>
          </div>
        ))}

        {thinking && (
          <div className="flex items-center gap-2 pl-2 font-mono text-[11px] uppercase tracking-[0.2em] text-copper-300">
            <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-copper-400" />
            Auditing deck transcript & metrics…
          </div>
        )}
      </div>

      {/* Suggested prompts & Chat input */}
      <div className="border-t border-paper/[0.07] bg-ink-900/40 p-4">
        <div className="mb-3 flex flex-wrap gap-2">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => ask(s)}
              disabled={thinking}
              className="rounded-full border border-paper/12 bg-paper/[0.03] px-3.5 py-1.5 font-mono text-[11px] text-paper-dim transition hover:border-copper-400/50 hover:bg-copper-400/10 hover:text-copper-200 disabled:opacity-40"
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
          className="flex gap-2"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask anything about your deck, slides, or investor defense…"
            aria-label="Ask the coach about your deck"
            disabled={thinking}
            className="flex-1 rounded-full border border-paper/12 bg-ink-950/80 px-5 py-3 text-sm text-paper placeholder:text-paper-dim/40 focus:border-copper-400/50 focus:outline-none focus:ring-1 focus:ring-copper-400/30 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={thinking || !input.trim()}
            className="rounded-full bg-copper-400 px-6 py-3 font-mono text-xs font-bold uppercase tracking-wider text-ink-950 transition-all hover:bg-copper-300 active:scale-95 disabled:pointer-events-none disabled:opacity-30"
          >
            Ask
          </button>
        </form>
      </div>
    </div>
  );
}