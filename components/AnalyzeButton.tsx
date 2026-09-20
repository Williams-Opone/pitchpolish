"use client";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AnalyzeButton({ deckId }: { deckId: string }) {
  const { isSignedIn } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    if (!isSignedIn) {
      router.push("/sign-in"); // takes them to sign-in page instead of error
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ deckId }),
      });
      const data = await res.json();
      if (res.ok) {
        router.refresh();
      } else if (data.redirect) {
        // If API sends redirect (future proof)
        window.location.href = data.redirect;
      } else {
        alert("Error: " + (data.error || "Analyze failed"));
      }
    } catch {
      alert("Network error — please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="bg-amber-400 text-[#080c16] font-bold px-8 py-3 rounded-full hover:bg-amber-300 transition disabled:opacity-50 shadow-[0_0_30px_-10px_rgba(240,199,94,0.3)] text-lg"
    >
      {loading ? "Analyzing..." : "Analyze Deck"}
    </button>
  );
}