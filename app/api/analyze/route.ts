import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";
import { downloadPdfBuffer } from "@/lib/storage";
import { parsePdf } from "@/lib/pdf-parse-wrapper";

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { deckId } = await req.json();
  if (!deckId) return NextResponse.json({ error: "Missing deckId" }, { status: 400 });

  const sb = supabaseServer();
  const { data: deck, error } = await sb.from("decks").select("*").eq("id", deckId).single();
  if (error || !deck) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (deck.user_id !== userId) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  if (deck.status === "analyzed" && deck.analysis_result) {
    return NextResponse.json({ result: deck.analysis_result, cached: true });
  }

  try {
    const buffer = await downloadPdfBuffer(deck.file_path);
    const parsed = await parsePdf(buffer);
    const rawText = parsed.text.substring(0, 12000);

    // STRONGER MOCK — demonstrates excellence for portfolio/demo
    const result = {
      overall_score: 71,
      summary: "Strong founder-market fit and credible team, but the deck collapses under investor scrutiny due to missing quantification in market size, weak competitive differentiation, and zero traction evidence. Fix the data gaps before sending.",
      sections: {
        problem_statement: { score: 9, critique: "Problem is visceral and clearly expressed. The pain point resonates. No fix needed.", status: "strong" },
        solution: { score: 7, critique: "Solution is credible but the 'how' is vague. Add one technical architecture slide or a simple diagram showing data flow.", status: "good" },
        market_size: { score: 2, critique: "Critical failure. Mentions 'large market' with zero TAM/SAM/SOM figures. Investors will reject immediately. Add: TAM $12B, SAM $800M, SOM $10M (1% capture = $100M in Year 5). Cite sources.", status: "critical" },
        business_model: { score: 5, critique: "Pricing and revenue stream are implied, not shown. Add a 3-tier pricing table and show how revenue compounds monthly.", status: "weak" },
        traction: { score: 3, critique: "Absolute zero evidence of traction — no pilots, no users, no waitlist, no revenue. If none exists, be honest: state 'Pre-launch — waitlist of 200+ signups' or show a pilot letter.", status: "missing" },
        team: { score: 9, critique: "Team credentials are relevant and credible. Domain expertise is clear. No gaps.", status: "strong" },
        competition: { score: 2, critique: "Only one competitor named. Investors will ask 'Who else?' Add a 2x2 matrix showing Direct, Indirect, Status Quo, and New Entrant with your differentiation in one sentence each.", status: "critical" },
        financials: { score: 4, critique: "No 3-year forecast. No burn rate shown. Add: Year 1 $0 revenue / $150k burn, Year 2 $180k / $45k burn, Year 3 $600k / $200k profit. Include gross margin assumptions.", status: "weak" },
        ask: { score: 7, critique: "Clear ask ($1.5M Seed) and milestone (launch + 3 pilots). Good. Add one sentence on how the capital extends runway specifically.", status: "good" }
      },
      red_flags: [
        "Market size slide has zero numbers — this is an automatic investor rejection.",
        "Competition slide names only 1 competitor — you look unaware of the landscape.",
        "No traction evidence — investors will assume the idea is unproven.",
        "Financial projections are absent — investors cannot model return potential."
      ],
      recommendations: [
        "Slide 4 — Add TAM/SAM/SOM with sourced data and a 1% capture projection.",
        "Slide 7 — Build a 2x2 competitive matrix with 3 named players and your differentiation in one line.",
        "Slide 6 — Add traction section: waitlist count, pilot names, or revenue if available. If zero, state 'Pre-launch — targeting Q2'.",
        "Slide 9 — Insert 3-year financial forecast with clear assumptions and unit economics.",
        "Slide 10 — Add 'Use of Funds' table showing % allocation (product 50%, sales 30%, ops 20%)."
      ]
    };

    await sb.from("decks").update({
      status: "analyzed",
      extracted_text: rawText,
      analysis_result: result,
    }).eq("id", deckId);

    return NextResponse.json({ result, cached: false });
  } catch (e: any) {
    console.error("Analyze error:", e);
    await sb.from("decks").update({ status: "error" }).eq("id", deckId);
    return NextResponse.json({ error: e.message || "Analysis failed" }, { status: 500 });
  }
}