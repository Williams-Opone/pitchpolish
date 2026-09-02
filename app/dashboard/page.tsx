import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { supabaseServer } from "@/lib/supabase-server";
import Link from "next/link";
import { ArrowUpRight, Upload } from "lucide-react";
import UpgradeButton from "@/components/UpgradeButton";

export default async function Dashboard() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const sb = supabaseServer();
  const { data: decks } = await sb
    .from("decks")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  return (
    <main className="min-h-screen bg-[#080c16] text-[#e8e8f0] font-[family-name:var(--font-sans)] selection:bg-amber-500/20">
      <div className="fixed top-0 left-0 w-full h-[50vh] bg-gradient-to-b from-amber-400/[0.04] to-transparent pointer-events-none z-0" />

      <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-10 py-16 md:py-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <div>
            <h1 className="font-[family-name:var(--font-serif)] text-6xl md:text-8xl text-white tracking-tighter leading-[0.9] mb-3">
              Your Decks.
            </h1>
            <p className="text-slate-400 text-lg font-light">Every analysis. Every fix.</p>
          </div>
          <div className="flex gap-3">
            <Link href="/upload" className="inline-flex items-center gap-2.5 bg-amber-400 text-[#080c16] px-6 py-3.5 rounded-full font-bold text-base hover:bg-amber-300 transition shadow-[0_0_40px_-12px_rgba(240,199,94,0.3)] hover:-translate-y-0.5">
              <Upload size={18} /> New Deck
            </Link>
            <UpgradeButton />
          </div>
        </div>

        {(!decks || decks.length === 0) && (
          <div className="border border-white/[0.08] rounded-[2.5rem] bg-gradient-to-b from-white/[0.04] to-transparent p-16 md:p-24 text-center">
            <h2 className="font-[family-name:var(--font-serif)] text-5xl md:text-7xl text-white mb-6 tracking-tighter">No decks.</h2>
            <p className="text-slate-400 text-xl mb-10 max-w-md mx-auto">Upload your first pitch deck to get a score card, red flags, and specific fixes.</p>
            <Link href="/upload" className="inline-block bg-amber-400 text-[#080c16] px-10 py-4 rounded-full font-bold text-xl hover:bg-amber-300 transition shadow-[0_0_50px_-12px_rgba(240,199,94,0.3)]">
              Upload Now
            </Link>
          </div>
        )}

        <div className="grid gap-5">
          {decks?.map((d: any) => {
            const score = d.analysis_result?.overall_score ?? null;
            const isAnalyzed = d.status === "analyzed";

            return (
              <Link
                key={d.id}
                href={`/report/${d.id}`}
                className="group relative bg-gradient-to-r from-[#0f1120]/90 to-[#0c0f16] border border-white/[0.07] hover:border-amber-400/30 rounded-[2rem] p-8 md:p-10 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_60px_-15px_rgba(240,199,94,0.12)]"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-[family-name:var(--font-serif)] text-2xl md:text-3xl text-white truncate group-hover:text-amber-300 transition-colors max-w-xs md:max-w-2xl">
                        {d.file_name}
                      </h3>
                      <ArrowUpRight size={20} className="text-amber-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                    </div>
                    <div className="flex items-center gap-3 text-sm text-slate-400">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${isAnalyzed ? "bg-emerald-500/15 text-emerald-300" : "bg-slate-700 text-slate-300"}`}>
                        {isAnalyzed ? "Analyzed" : "Pending"}
                      </span>
                      <span>{new Date(d.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 md:pl-6 md:border-l md:border-white/[0.08]">
                    <div className="text-right">
                      {score !== null ? (
                        <div className="text-5xl md:text-6xl font-[family-name:var(--font-serif)] text-amber-300 leading-none tracking-tighter">{score}</div>
                      ) : (
                        <div className="text-4xl font-[family-name:var(--font-serif)] text-slate-600 leading-none">—</div>
                      )}
                      <div className="text-[10px] uppercase tracking-[0.2em] text-slate-500 mt-1">Score</div>
                    </div>
                    <div className="hidden md:block w-px h-10 bg-white/[0.1]" />
                    <div className="text-sm text-slate-400 leading-snug max-w-[220px] hidden md:block">
                      {isAnalyzed ? (d.analysis_result?.summary || "Open for full report and fixes.") : "Click to analyze and generate score card."}
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </main>
  );
}