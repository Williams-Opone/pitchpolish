"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AnalyzeButton({ deckId }: { deckId: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleAnalyze = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ deckId }),
      });
      const data = await res.json();
      if (!res.ok) {
        alert("Error: " + (data.error || "Analysis failed"));
      } else {
        router.refresh(); // smooth refresh — page updates with score
      }
    } catch (e: any) {
      alert("Network error. Check console.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleAnalyze}
      disabled={loading}
      className="bg-amber-400 text-[#080c16] font-bold px-8 py-3 rounded-full hover:bg-amber-300 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_30px_-10px_rgba(240,199,94,0.3)] text-lg"
    >
      {loading ? "Analyzing..." : "Analyze Deck"}
    </button>
  );
}