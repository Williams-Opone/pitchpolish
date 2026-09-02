import { auth } from "@clerk/nextjs/server";
import { redirect, notFound } from "next/navigation";
import { supabaseServer } from "@/lib/supabase-server";
import ReportCard from "@/components/ReportCard";
import AnalyzeButton from "@/components/AnalyzeButton";
import GenerateSummary from "@/components/GenerateSummary";
import ChatPanel from "@/components/ChatPanel";

export default async function ReportPage({ params }: { params: Promise<{ id: string }> }) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const { id } = await params;
  const sb = supabaseServer();
  const { data: deck } = await sb.from("decks").select("*").eq("id", id).single();

  if (!deck || deck.user_id !== userId) return notFound();

  return (
    <main className="min-h-screen bg-[#080c16] text-[#e8e8f0] font-[family-name:var(--font-sans)] selection:bg-amber-500/20">
      {/* Subtle top glow */}
      <div className="fixed top-0 left-0 w-full h-[50vh] bg-gradient-to-b from-amber-400/[0.06] to-transparent pointer-events-none z-0" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10 py-10 md:py-14">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 md:mb-14">
          <div>
            <h1 className="font-[family-name:var(--font-serif)] text-4xl md:text-6xl text-white tracking-tighter leading-none mb-2">{deck.file_name}</h1>
            <p className="text-sm text-slate-400 font-medium">PitchPolish • {deck.status}</p>
          </div>
          <a href="/dashboard" className="text-amber-300 hover:text-amber-100 font-medium text-sm transition">← Dashboard</a>
        </div>

        {/* Main Layout: Report Left / Chat Right (Desktop) */}
        <div className="grid lg:grid-cols-[1fr_380px] gap-8 lg:gap-10 items-start">
          {/* LEFT: Report / Analyze / Summary */}
          <div className="order-2 lg:order-1 space-y-8">
            {deck.status === "analyzed" && deck.analysis_result ? (
              <>
                <ReportCard result={deck.analysis_result} />
                <GenerateSummary deckId={deck.id} />
              </>
            ) : (
              <div className="bg-gradient-to-b from-white/[0.04] to-transparent border border-white/[0.08] rounded-[2.5rem] p-16 text-center">
                <h2 className="font-[family-name:var(--font-serif)] text-4xl text-white mb-4">Ready to Analyze</h2>
                <p className="text-slate-400 mb-10 max-w-xl mx-auto">Your deck is extracted. Click to generate the score card, red flags, and specific fixes.</p>
                <div className="flex justify-center">
                  <AnalyzeButton deckId={deck.id} />
                </div>
              </div>
            )}
          </div>

          {/* RIGHT: Chat Sidebar (Sticky on desktop) */}
          <div className="order-1 lg:order-2 lg:sticky lg:top-8 lg:self-start">
            <ChatPanel deckId={id} />
          </div>
        </div>
      </div>
    </main>
  );
}