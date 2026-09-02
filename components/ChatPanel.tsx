"use client";
import { useState, useRef, useEffect } from "react";
import { Send, Sparkles } from "lucide-react";

export default function ChatPanel({ deckId }: { deckId: string }) {
  const [messages, setMessages] = useState<{ role: "user" | "ai"; text: string }[]>([
    { role: "ai", text: "Hi — I'm PitchPolish AI. I can see your deck. Ask me about any slide, and I'll answer using your actual content." },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  const send = async () => {
    if (!input.trim()) return;
    const userMsg = input.trim();
    setMessages((prev) => [...prev, { role: "user", text: userMsg }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ deckId, message: userMsg }),
      });
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { role: "ai", text: data.reply || "I couldn't retrieve a specific answer from your deck." },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "ai", text: "Connection issue. Try asking again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-b from-[#11131a] to-[#0a0e18] border border-white/[0.08] rounded-[2.5rem] p-7 md:p-9 shadow-2xl h-full flex flex-col">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-amber-400/10 rounded-xl flex items-center justify-center text-amber-300">
          <Sparkles size={20} strokeWidth={1.5} />
        </div>
        <div>
          <h3 className="font-[family-name:var(--font-serif)] text-xl text-white leading-none">AI Coach</h3>
          <p className="text-[11px] text-slate-500 uppercase tracking-widest mt-1">Reading your deck</p>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto space-y-4 mb-6 pr-1 min-h-[300px] max-h-[480px] scroll-smooth"
      >
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[88%] rounded-2xl px-4 py-3 text-sm leading-relaxed backdrop-blur-sm ${
                m.role === "user"
                  ? "bg-amber-400/12 border border-amber-400/20 text-amber-50 rounded-br-md"
                  : "bg-white/[0.05] border border-white/[0.08] text-slate-200 rounded-bl-md"
              }`}
            >
              <div className="text-[10px] font-bold uppercase tracking-wider mb-0.5 opacity-60">
                {m.role === "user" ? "You" : "PitchPolish AI"}
              </div>
              <p className="whitespace-pre-wrap">{m.text}</p>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white/[0.05] border border-white/[0.08] rounded-2xl px-4 py-3 text-sm text-slate-300">
              <div className="flex gap-1.5">
                <span className="w-1.5 h-1.5 bg-amber-300 rounded-full animate-bounce" />
                <span className="w-1.5 h-1.5 bg-amber-300 rounded-full animate-bounce" style={{ animationDelay: "0.15s" }} />
                <span className="w-1.5 h-1.5 bg-amber-300 rounded-full animate-bounce" style={{ animationDelay: "0.3s" }} />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="How do I fix market size?"
          className="flex-1 bg-[#0a0f1a] border border-white/10 rounded-full px-5 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400/50 transition"
        />
        <button
          onClick={send}
          disabled={loading || !input.trim()}
          className="bg-amber-400 text-[#080c16] rounded-full px-4 py-3 hover:bg-amber-300 transition disabled:opacity-40"
          aria-label="Send"
        >
          <Send size={18} strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
}