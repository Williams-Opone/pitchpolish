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
    signals: [
      /\bproblem[s]?\b/gi,
      /\bpain[ -]?points?\b/gi,
      /\bstruggl\w+/gi,
      /\bfrustrat\w+/gi,
      /\bbroken\b/gi,
      /\bspreadsheets?\b/gi,
      /\bmanual(ly)?\b/gi,
      /\bwast\w+ (of )?time\b/gi,
      /\bcost(ly|s) (them|you|companies|businesses)\b/gi,
    ],
    flag: "The problem is asserted but never felt — no pain, no cost, no frequency.",
    strongNote: "Pain is specific and quantified.",
    weakNote: "Pain is vague — name who hurts and how much it costs.",
  },
  {
    key: "solution",
    label: "Solution",
    weight: 12,
    signals: [
      /\bsolution\b/gi,
      /\bour (product|platform|app|engine)\b/gi,
      /\bwe (built|automate|replace|eliminate)\b/gi,
      /\bautomat\w+/gi,
      /\bworkflow\b/gi,
      /\bin one (click|place|dashboard)\b/gi,
      /\breplac\w+ (manual|the|your)\b/gi,
    ],
    flag: "Solution slide reads like a feature list, not an outcome.",
    strongNote: "Outcome-first framing, clear mechanism.",
    weakNote: "Describe the outcome before the features.",
  },
  {
    key: "market",
    label: "Market Size",
    weight: 14,
    signals: [
      /\btam\b/gi,
      /\bsam\b/gi,
      /\bsom\b/gi,
      /\bmarket size\b/gi,
      /\bbillion\b/gi,
      /\bmillion (users|customers|businesses|people)\b/gi,
      /\bcagr\b/gi,
      /\bgrowing (at|market)\b/gi,
      /\$[\d.,]+\s?(b|bn|billion|m|mm)\b/gi,
    ],
    flag: "No TAM / SAM / SOM — the first thing investors check, and it's missing.",
    strongNote: "TAM/SAM/SOM present with numbers.",
    weakNote: "Add TAM/SAM/SOM with real dollar figures.",
  },
  {
    key: "model",
    label: "Business Model",
    weight: 12,
    signals: [
      /\bpricing\b/gi,
      /\bsubscri\w+/gi,
      /\brevenue (model|stream|per)\b/gi,
      /\bmargin[s]?\b/gi,
      /\barr\b/gi,
      /\bmrr\b/gi,
      /\bper seat\b/gi,
      /\btake rate\b/gi,
      /\bcommission\b/gi,
      /\bfree ?mium\b/gi,
      /\$\d+\s?\/\s?(mo|month|user|seat)\b/gi,
    ],
    flag: "How you make money is never stated — investors will not ask, they'll pass.",
    strongNote: "Pricing mechanics are explicit.",
    weakNote: "State pricing, unit price, and who pays.",
  },
  {
    key: "traction",
    label: "Traction",
    weight: 14,
    signals: [
      /\btraction\b/gi,
      /\b(users|customers|companies) (use|using|signed|onboarded|paying)\b/gi,
      /\bgrowth\b/gi,
      /\bwaitlist\b/gi,
      /\bretention\b/gi,
      /\bpilot[s]?\b/gi,
      /\b\d+(\.\d+)?% ?(m[om]|growth|retention|increase)\b/gi,
      /\bmonth[- ]over[- ]month\b/gi,
      /\bpaying customers?\b/gi,
    ],
    flag: "No traction metrics shown — even early decks need signal (waitlist, pilots, LOIs).",
    strongNote: "Momentum is quantified.",
    weakNote: "Show a number moving up — any honest number.",
  },
  {
    key: "team",
    label: "Team",
    weight: 10,
    signals: [
      /\bteam\b/gi,
      /\b(founder|co-?founder)[s]?\b/gi,
      /\b(ceo|cto|coo|cpo)\b/gi,
      /\badvisor[s]?\b/gi,
      /\bex[- ](google|meta|stripe|amazon|apple|netflix|openai|airbnb|uber|shopify)\b/gi,
      /\bpreviously (at|built|led)\b/gi,
      /\bph\.?d\b/gi,
      /\boperator[s]?\b/gi,
    ],
    flag: "Team slide lacks credibility markers — why is THIS team the one to win?",
    strongNote: "Founder-market fit is argued, not assumed.",
    weakNote: "Add 'why us' — exits, domain years, unfair advantage.",
  },
  {
    key: "competition",
    label: "Competition",
    weight: 8,
    signals: [
      /\bcompet\w+/gi,
      /\balternative[s]?\b/gi,
      /\bincumbent[s]?\b/gi,
      /\bmoat\b/gi,
      /\bdifferentiat\w+/gi,
      /\bunlike (other|the|our)\b/gi,
      /\bcompared to\b/gi,
      /\bstatus quo\b/gi,
    ],
    flag: "Competition slide missing key players — 'we have no competitors' reads as naive.",
    strongNote: "Positioning vs. named rivals is clear.",
    weakNote: "Name 3–5 rivals and your wedge against each.",
  },
  {
    key: "financials",
    label: "Financials",
    weight: 8,
    signals: [
      /\bprojection[s]?\b/gi,
      /\bforecast[s]?\b/gi,
      /\bburn (rate)?\b/gi,
      /\brunway\b/gi,
      /\bunit economics\b/gi,
      /\bgross margin\b/gi,
      /\byear [1-3]\b/gi,
      /\bebitda\b/gi,
      /\bcac\b/gi,
      /\bltv\b/gi,
    ],
    flag: "No financial model — not even a bottoms-up 18-month projection.",
    strongNote: "Projections tie back to assumptions.",
    weakNote: "Add 18–24 month projections with assumptions.",
  },
  {
    key: "ask",
    label: "The Ask",
    weight: 10,
    signals: [
      /\braising\b/gi,
      /\b(pre-?seed|seed|series [abc]) (round)?\b/gi,
      /\buse of funds\b/gi,
      /\ballocation\b/gi,
      /\brunway (through|to|of)\b/gi,
      /\bvaluation\b/gi,
      /\basking for\b/gi,
      /\bclosing\b/gi,
      /\$\d[\d.,]*\s?(m|mm|million|k)\b/gi,
    ],
    flag: "No ask slide — amount, round type, and use of funds are all missing.",
    strongNote: "Ask is specific: amount, use, runway unlocked.",
    weakNote: "State the amount, the split, and the milestone it buys.",
  },
];

function countHits(text: string, signals: RegExp[]): number {
  let hits = 0;
  for (const re of signals) {
    const m = text.match(re);
    if (m) hits += m.length;
  }
  return hits;
}

function scoreFromHits(hits: number, hasNumbers: boolean): number {
  let s: number;
  if (hits === 0) s = 1;
  else if (hits <= 1) s = 3;
  else if (hits <= 3) s = 5;
  else if (hits <= 6) s = 7;
  else if (hits <= 10) s = 8;
  else s = 9;
  if (hasNumbers && s < 10) s += 1;
  return Math.min(10, s);
}

export function bandFor(score: number): string {
  if (score >= 85) return "Fundable polish";
  if (score >= 70) return "Promising — fix the gaps";
  if (score >= 50) return "Needs surgery";
  return "Back to the whiteboard";
}

export function analyzeText(text: string): AnalysisResult {
  const cleaned = text.replace(/\s+/g, " ").trim();
  const wordCount = cleaned ? cleaned.split(" ").length : 0;
  const hasNumbers = /\d/.test(cleaned);

  const sections: SectionScore[] = CRITERIA.map((c) => {
    const hits = countHits(cleaned, c.signals);
    const score = scoreFromHits(hits, hasNumbers);
    return {
      key: c.key,
      label: c.label,
      score,
      weight: c.weight,
      note: score >= 7 ? c.strongNote : c.weakNote,
    };
  });

  const overall = Math.round(
    sections.reduce((acc, s) => acc + s.score * s.weight, 0) / 10
  );

  const redFlags = sections
    .map((s, i) => ({ s, c: CRITERIA[i] }))
    .filter(({ s }) => s.score <= 3)
    .sort((a, b) => a.s.score - b.s.score)
    .map(({ c }) => c.flag);

  const best = [...sections].sort((a, b) => b.score - a.score)[0];
  const worst = [...sections].sort((a, b) => a.score - b.score)[0];

  const summary = `Overall ${overall}/100 — ${bandFor(overall)}. Strongest dimension: ${best.label} (${best.score}/10). Weakest: ${worst.label} (${worst.score}/10). ${
    redFlags.length > 0
      ? `${redFlags.length} red flag${redFlags.length > 1 ? "s" : ""} would surface in a partner meeting.`
      : "No hard red flags — remaining gaps are polish items."
  }`;

  return { score: overall, band: bandFor(overall), sections, redFlags, summary, wordCount };
}

export const CRITERIA_META = CRITERIA.map((c) => ({
  key: c.key,
  label: c.label,
  weight: c.weight,
}));
