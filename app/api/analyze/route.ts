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

  // Cache hit — don't re-run
  if (deck.status === "analyzed" && deck.analysis_result) {
    return NextResponse.json({ result: deck.analysis_result, cached: true });
  }

  try {
    const buffer = await downloadPdfBuffer(deck.file_path);
    const parsed = await parsePdf(buffer);
    const rawText = parsed.text.substring(0, 12000);

    // MOCK SCORE — put real OpenAI back after adding billing at platform.openai.com
    const result = {
      overall_score: 72,
      summary: "Strong problem statement. Critical market and competition gaps will kill investor interest.",
      sections: {
        problem_statement: { score: 9, critique: "Clear, urgent, well-framed.", status: "strong" },
        solution: { score: 7, critique: "Differentiated but technical details thin.", status: "good" },
        market_size: { score: 2, critique: "Mentions 'large market' but zero TAM/SAM/SOM. Investors will reject immediately.", status: "critical" },
        business_model: { score: 5, critique: "Revenue path unclear; needs pricing model.", status: "weak" },
        traction: { score: 3, critique: "No metrics, pilots, or revenue shown.", status: "missing" },
        team: { score: 8, critique: "Experienced and relevant.", status: "strong" },
        competition: { score: 2, critique: "Only one competitor named; missing key direct alternatives.", status: "critical" },
        financials: { score: 4, critique: "Projections incomplete; missing 3-year forecast.", status: "weak" },
        ask: { score: 6, critique: "Clear funding ask and milestone.", status: "good" }
      },
      red_flags: [
        "Market size has no numbers — critical for investor trust.",
        "Competition slide missing key players.",
        "No traction metrics shown — investors will ask 'why now?'"
      ],
      recommendations: [
        "Add TAM ($10B+), SAM ($500M+), and SOM (1% capture = $5M) to slide 4.",
        "Name 3 direct competitors on slide 7 and show differentiation in one sentence.",
        "Add 2-3 traction metrics (users, revenue, pilots) to slide 6."
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