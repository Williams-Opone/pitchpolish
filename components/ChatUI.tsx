"use client";
import { useState } from "react";

export default function ChatUI({ deckId }: { deckId: string }) {
  const [messages, setMessages] = useState<{role:"user"|"ai"; text:string}[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const send = async () => {
    if (!input.trim()) return;
    setMessages(m => [...m, { role: "user", text: input }]);
    setLoading(true);
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ deckId, message: input }),
    });
    const data = await res.json();
    setMessages(m => [...m, { role: "ai", text: data.reply || data.error || "No response." }]);
    setInput("");
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-[#0B1120] text-slate-200 font-sans">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="font-serif text-5xl text-white mb-2">AI Coach</h1>
        <p className="text-slate-400 mb-8">Asking about <span className="text-amber-400">{deckId.slice(0,8)}...</span></p>
        <div className="h-[50vh] overflow-y-auto border border-white/10 rounded-2xl p-6 bg-white/[0.02] mb-6 space-y-4">
          {messages.map((m,i) => (
            <div key={i} className={`p-4 rounded-xl max-w-[90%] ${m.role==="user"? "bg-amber-400/10 ml-auto" : "bg-white/5"}`}>
              <div className="text-xs font-bold text-amber-400 mb-1">{m.role==="user"?"You":"PitchPolish AI"}</div>
              <p className="text-sm text-slate-200 leading-relaxed">{m.text}</p>
            </div>
          ))}
          {loading && <div className="text-slate-400 text-sm animate-pulse">AI is searching your deck...</div>}
        </div>
        <div className="flex gap-3">
          <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()} placeholder="How do I fix market size?" className="flex-1 bg-white/5 border border-white/20 rounded-full px-6 py-3 text-white focus:outline-none focus:border-amber-400" />
          <button onClick={send} className="bg-amber-400 text-[#0B1120] font-bold px-6 py-3 rounded-full hover:bg-amber-300">Send</button>
        </div>
      </div>
    </main>
  );
}