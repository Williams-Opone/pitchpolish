"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { IconArrow } from "@/components/icons";

export default function GenerateSampleButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const go = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const res = await fetch("/api/sample", { method: "POST" });
      const data = (await res.json()) as { id?: number };
      if (data.id) router.push(`/report/${data.id}`);
    } catch {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={go}
      disabled={loading}
      className="group inline-flex items-center gap-3 rounded-full border border-copper-400/40 bg-copper-400/[0.08] px-7 py-3.5 text-base font-bold text-copper-300 transition-all duration-300 hover:-translate-y-0.5 hover:bg-copper-400/[0.14] disabled:pointer-events-none disabled:opacity-60"
    >
      {loading ? "Opening sample…" : "Open the sample report"}
      <IconArrow size={16} className="transition-transform group-hover:translate-x-1" />
    </button>
  );
}
