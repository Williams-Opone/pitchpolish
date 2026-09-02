import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { openai } from "@/lib/ai/openai";
import { supabaseServer } from "@/lib/supabase-server";

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Auth" }, { status: 401 });
  const { deckId } = await req.json();
  const sb = supabaseServer();
  const { data: deck } = await sb.from("decks").select("extracted_text").eq("id", deckId).single();
  if (!deck?.extracted_text) return NextResponse.json({ error: "No text" }, { status: 400 });

  try {
    const res = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "Write a polished 1-page investor executive summary. Specific, not hype." },
        { role: "user", content: `Deck text:\n${deck.extracted_text.substring(0,12000)}` }
      ],
      max_tokens: 1500,
    });
    return NextResponse.json({ summary: res.choices[0].message.content });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}