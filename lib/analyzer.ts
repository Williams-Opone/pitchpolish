// src/lib/analyzer.ts
import { GoogleGenAI, Type } from "@google/genai";
import type { AnalysisResult, SectionScore } from "./types";

interface Criterion {
  key: string;
  label: string;
  weight: number;
  signals: RegExp[];
  flag: string;
  strongNote: string;
  weakNote: string;
}

const CRITERIA: Criterion[] = [
  {
    key: "problem",
    label: "Problem",
    weight: 12,
    signals: [/\bproblem[s]?\b/gi, /\bpain[ -]?points?\b/gi, /\bbroken\b/gi, /\bmanual(ly)?\b/gi],
    flag: "The problem is asserted but never felt — no pain, no cost, no frequency.",
    strongNote: "Pain is specific and quantified.",
    weakNote: "Pain is vague — name who hurts and how much it costs.",
  },
  {
    key: "solution",
    label: "Solution",
    weight: 12,
    signals: [/\bsolution\b/gi, /\bour (product|platform|app|engine)\b/gi, /\bwe (built|automate)\b/gi],
    flag: "Solution slide reads like a feature list, not an outcome.",
    strongNote: "Outcome-first framing, clear mechanism.",
    weakNote: "Describe the outcome before the features.",
  },
  {
    key: "market",
    label: "Market Size",
    weight: 14,
    signals: [/\btam\b/gi, /\bsam\b/gi, /\bsom\b/gi, /\bmarket size\b/gi, /\bbillion\b/gi],
    flag: "No TAM / SAM / SOM — the first thing investors check, and it's missing.",
    strongNote: "TAM/SAM/SOM present with numbers.",
    weakNote: "Add TAM/SAM/SOM with real dollar figures.",
  },
  {
    key: "model",
    label: "Business Model",
    weight: 12,
    signals: [/\bpricing\b/gi, /\bsubscri\w+/gi, /\brevenue\b/gi, /\bmargin[s]?\b/gi, /\barr\b/gi],
    flag: "How you make money is never stated — investors will not ask, they'll pass.",
    strongNote: "Pricing mechanics are explicit.",
    weakNote: "State pricing, unit price, and who pays.",
  },
  {
    key: "traction",
    label: "Traction",
    weight: 14,
    signals: [/\btraction\b/gi, /\bgrowth\b/gi, /\bwaitlist\b/gi, /\bretention\b/gi, /\bpilot[s]?\b/gi],
    flag: "No traction metrics shown — even early decks need signal (waitlist, pilots, LOIs).",
    strongNote: "Momentum is quantified.",
    weakNote: "Show a number moving up — any honest number.",
  },
  {
    key: "team",
    label: "Team",
    weight: 10,
    signals: [/\bteam\b/gi, /\b(founder|co-?founder)[s]?\b/gi, /\b(ceo|cto)\b/gi, /\bex[- ]/gi],
    flag: "Team slide lacks credibility markers — why is THIS team the one to win?",
    strongNote: "Founder-market fit is argued, not assumed.",
    weakNote: "Add 'why us' — exits, domain years, unfair advantage.",
  },
  {
    key: "competition",
    label: "Competition",
    weight: 8,
    signals: [/\bcompet\w+/gi, /\bincumbent[s]?\b/gi, /\bmoat\b/gi, /\bdifferentiat\w+/gi],
    flag: "Competition slide missing key players — 'we have no competitors' reads as naive.",
    strongNote: "Positioning vs. named rivals is clear.",
    weakNote: "Name 3–5 rivals and your wedge against each.",
  },
  {
    key: "financials",
    label: "Financials",
    weight: 8,
    signals: [/\bprojection[s]?\b/gi, /\bforecast[s]?\b/gi, /\bburn\b/gi, /\brunway\b/gi],
    flag: "No financial model — not even a bottoms-up 18-month projection.",
    strongNote: "Projections tie back to assumptions.",
    weakNote: "Add 18–24 month projections with assumptions.",
  },
  {
    key: "ask",
    label: "The Ask",
    weight: 10,
    signals: [/\braising\b/gi, /\bseed\b/gi, /\buse of funds\b/gi, /\bvaluation\b/gi],
    flag: "No ask slide — amount, round type, and use of funds are all missing.",
    strongNote: "Ask is specific: amount, use, runway unlocked.",
    weakNote: "State the amount, the split, and the milestone it buys.",
  },
];

export function bandFor(score: number): string {
  if (score >= 85) return "Fundable polish";
  if (score >= 70) return "Promising — fix the gaps";
  if (score >= 50) return "Needs surgery";
  return "Back to the whiteboard";
}

/**
 * AI-POWERED ANALYZER (Gemini 3.6 Flash with JSON Schema)
 */
export async function analyzeDeckWithAI(text: string): Promise<AnalysisResult> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.includes("YourGeneratedKeyHere")) {
    console.warn("GEMINI_API_KEY not configured. Falling back to heuristic analyzer.");
    return analyzeTextHeuristically(text);
  }

  const ai = new GoogleGenAI({ apiKey });
  const cleaned = text.replace(/\s+/g, " ").trim();
  const wordCount = cleaned ? cleaned.split(" ").length : 0;

  const prompt = `
You are PitchPolish's Senior Venture Partner evaluating a pitch deck transcript.
Score the following deck across the 9 core institutional dimensions (0-10 integer score).
For each dimension, provide a 1-sentence analytical critique referencing specifics from their deck text.
Also list 0 to 4 specific, acute Red Flags (partner-meeting dealbreakers) and a concise executive summary.

=== DECK TRANSCRIPT ===
${cleaned.slice(0, 30000)}
=======================
`.trim();

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: {
              type: Type.STRING,
              description: "A 2-sentence candid assessment of whether this deck clears partner-meeting bar.",
            },
            redFlags: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Up to 4 specific dealbreaker risks identified in their materials.",
            },
            sections: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  key: {
                    type: Type.STRING,
                    description: "One of: problem, solution, market, model, traction, team, competition, financials, ask",
                  },
                  score: {
                    type: Type.INTEGER,
                    description: "Score from 0 to 10 based on institutional rigor.",
                  },
                  note: {
                    type: Type.STRING,
                    description: "One specific critique sentence referencing their actual deck numbers or phrasing.",
                  },
                },
                required: ["key", "score", "note"],
              },
            },
          },
          required: ["summary", "redFlags", "sections"],
        },
      },
    });

    const parsed = JSON.parse(response.text || "{}");

    // Map AI sections against predefined weights and labels
    const sectionMap = new Map((parsed.sections || []).map((s: any) => [s.key, s]));
    
    const finalizedSections: SectionScore[] = CRITERIA.map((c) => {
      const found = sectionMap.get(c.key) as { score?: number; note?: string } | undefined;
      const score = Math.max(0, Math.min(10, Number(found?.score ?? 5)));
      return {
        key: c.key,
        label: c.label,
        weight: c.weight,
        score,
        note: found?.note || (score >= 7 ? c.strongNote : c.weakNote),
      };
    });

    // Compute composite weighted score 0-100
    const compositeScore = Math.round(
      finalizedSections.reduce((acc, s) => acc + s.score * s.weight, 0) / 10
    );

    return {
      score: compositeScore,
      band: bandFor(compositeScore),
      sections: finalizedSections,
      redFlags: parsed.redFlags || [],
      summary: parsed.summary || `Executive composite score ${compositeScore}/100.`,
      wordCount,
    };
  } catch (err) {
    console.error("Gemini analysis failed, falling back to heuristic:", err);
    return analyzeTextHeuristically(text);
  }
}

/**
 * HEURISTIC REGEX FALLBACK (Runs if AI is offline/unreachable)
 */
export function analyzeTextHeuristically(text: string): AnalysisResult {
  const cleaned = text.replace(/\s+/g, " ").trim();
  const wordCount = cleaned ? cleaned.split(" ").length : 0;
  const hasNumbers = /\d/.test(cleaned);

  const sections: SectionScore[] = CRITERIA.map((c) => {
    let hits = 0;
    for (const re of c.signals) {
      const m = cleaned.match(re);
      if (m) hits += m.length;
    }

    let s = 1;
    if (hits > 10) s = 9;
    else if (hits > 6) s = 8;
    else if (hits > 3) s = 7;
    else if (hits > 1) s = 5;
    else if (hits === 1) s = 3;

    if (hasNumbers && s < 10) s += 1;

    return {
      key: c.key,
      label: c.label,
      score: Math.min(10, s),
      weight: c.weight,
      note: s >= 7 ? c.strongNote : c.weakNote,
    };
  });

  const overall = Math.round(
    sections.reduce((acc, s) => acc + s.score * s.weight, 0) / 10
  );

  const redFlags = sections
    .map((s, i) => ({ s, c: CRITERIA[i] }))
    .filter(({ s }) => s.score <= 3)
    .map(({ c }) => c.flag);

  return {
    score: overall,
    band: bandFor(overall),
    sections,
    redFlags,
    summary: `Heuristic score: ${overall}/100 — ${bandFor(overall)}.`,
    wordCount,
  };
}

export const CRITERIA_META = CRITERIA.map((c) => ({
  key: c.key,
  label: c.label,
  weight: c.weight,
}));