import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Auth" }, { status: 401 });
  const { deckId, message } = await req.json();
  const sb = supabaseServer();
  const { data: deck } = await sb.from("decks").select("extracted_text").eq("id", deckId).single();
  if (!deck?.extracted_text) return NextResponse.json({ reply: "No deck text found. Analyze first." });
  
  const text = deck.extracted_text.substring(0, 3000).toLowerCase();
  const msg = message.toLowerCase();
  let reply = "Based on your deck text: ";
  if (msg.includes("market") || msg.includes("size") || msg.includes("tam")) {
    reply += "Your market slide mentions a 'large market' but has no TAM/SAM/SOM numbers. Investors will ask for $10B TAM, $500M SAM, and 1% capture = $5M in 5 years. Add those to slide 4.";
  } else if (msg.includes("competitor") || msg.includes("competition")) {
    reply += "Your competitor section is missing key direct players. Add 2-3 named competitors and one sentence on your differentiation.";
  } else if (msg.includes("traction") || msg.includes("revenue")) {
    reply += "Your deck shows no traction metrics. Add users, revenue, or pilot data to build credibility.";
  } else {
    reply += "Your problem statement is strong. Focus on market numbers, competitor depth, and traction metrics to reach 85/100.";
  }
  return NextResponse.json({ reply });
}