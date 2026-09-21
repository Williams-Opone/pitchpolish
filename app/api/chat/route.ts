import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import type { SectionScore } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface ChatRequestPayload {
  message: string;
  history?: { role: "user" | "coach"; text: string }[];
  context: {
    deckName: string;
    score: number;
    band: string;
    summary: string;
    excerpt: string;
    redFlags: string[];
    sections: SectionScore[];
  };
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId && process.env.NODE_ENV === "production") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body: ChatRequestPayload = await req.json();
    const { message, history = [], context } = body;

    if (!message?.trim()) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { reply: "GEMINI_API_KEY is not configured in your environment." },
        { status: 200 }
      );
    }

    const ai = new GoogleGenAI({ apiKey });

    const sectionsSummary = (context.sections || [])
      .map((s) => `- ${s.label}: ${s.score}/10 (Weight: ${s.weight}%). Note: ${s.note}`)
      .join("\n");

    const redFlagsList = (context.redFlags || []).length
      ? (context.redFlags || []).map((f) => `• ${f}`).join("\n")
      : "No hard red flags detected.";

    const systemPrompt = `
You are PitchPolish's Senior Venture Partner & Pitch Deck Coach.
You are in a 1-on-1 strategy teardown session with a founder who just had their pitch deck analyzed.

=== DECK TELEMETRY ===
Deck Name: ${context.deckName || "Untitled"}
Overall Score: ${context.score}/100 (${context.band})
Executive Assessment: "${context.summary}"

Identified Red Flags:
${redFlagsList}

Dimension Scores & Notes:
${sectionsSummary}

Raw Extracted Deck Text / Excerpt:
"""
${context.excerpt?.slice(0, 7000) || "No raw text available"}
"""
======================

COACHING RULES:
1. Ground every claim directly in their deck text, numbers, and evaluation rubric above. Never speak in generic advice if their deck has details.
2. If they ask how to rewrite or fix a slide, provide concrete, ready-to-use copy or metrics frameworks (e.g., specific TAM bottom-up equations, traction formats, or positioning lines).
3. Tone: Direct, high-signal, rigorous like a Sequoia or Benchmark partner in a partner meeting. Do not use corporate fluff.
4. Keep answers concise, actionable, and formatted with clean paragraphs or bullet points where appropriate. Maximum 2-3 short paragraphs.
`.trim();

    const conversationHistory = history
      .slice(-6)
      .map((m) => `${m.role === "user" ? "Founder" : "Coach"}: ${m.text}`)
      .join("\n");

    const userPrompt = conversationHistory
      ? `${conversationHistory}\nFounder: ${message}\nCoach:`
      : `Founder: ${message}\nCoach:`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: [
        {
          role: "user",
          parts: [{ text: `${systemPrompt}\n\n${userPrompt}` }],
        },
      ],
      config: {
        temperature: 0.3,
        maxOutputTokens: 800,
      },
    });

    const reply = response.text || "I was unable to synthesize feedback on that section.";

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("Coach chat API failure:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        reply: "My connection to the reasoning engine failed. Please try again.",
      },
      { status: 500 }
    );
  }
}