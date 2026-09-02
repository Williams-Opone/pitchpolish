"use client";
import { useState } from "react";

export default function GenerateSummary({ deckId }: { deckId: string }) {
  const [text, setText] = useState("");
  const [load, setLoad] = useState(false);

  return (
    <div className="bg-gradient-to-br from-amber-900/20 to-white/[0.03] border border-amber-400/20 rounded-2xl p-8 my-8">
      <h3 className="font-serif text-2xl text-amber-300 mb-3">Executive Summary</h3>
      <p className="text-slate-300 text-sm mb-4">One-click polished summary to email investors.</p>
      <button onClick={async () => {
        setLoad(true);
        const r = await fetch("/api/summary", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ deckId }),
        });
        const d = await r.json();
        setText(d.summary || d.error || "No response.");
        setLoad(false);
      }} className="bg-amber-400 text-[#0B1120] font-bold px-6 py-3 rounded-full hover:bg-amber-300">
        {load ? "Writing..." : "Generate Summary"}
      </button>
      {text && <div className="mt-4 bg-white/[0.05] border border-white/10 rounded-xl p-5 text-sm text-slate-200 leading-relaxed whitespace-pre-wrap">{text}</div>}
    </div>
  );
}