import { NextResponse } from "next/server";
import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { reports } from "@/db/schema";
import { analyzeTextHeuristically as analyzeText } from "@/lib/analyzer";
import { SAMPLE_DECK_NAME, SAMPLE_DECK_TEXT, SAMPLE_FILE_NAME, SAMPLE_SLIDE_COUNT } from "@/lib/sample";

export const runtime = "nodejs";

/** Returns the shared sample report, creating it on first use. */
export async function POST() {
  try {
    const existing = await db
      .select({ id: reports.id })
      .from(reports)
      .where(eq(reports.isSample, true))
      .orderBy(desc(reports.createdAt))
      .limit(1);

    if (existing.length > 0) {
      return NextResponse.json({ id: existing[0].id, cached: true });
    }

    const result = analyzeText(SAMPLE_DECK_TEXT);
    const excerpt = SAMPLE_DECK_TEXT.replace(/\s+/g, " ").trim().slice(0, 900);

    const rows = await db
      .insert(reports)
      .values({
        deckName: SAMPLE_DECK_NAME,
        fileName: SAMPLE_FILE_NAME,
        score: result.score,
        band: result.band,
        slideCount: SAMPLE_SLIDE_COUNT,
        wordCount: result.wordCount,
        sections: result.sections,
        redFlags: result.redFlags,
        summary: result.summary,
        excerpt,
        isSample: true,
      })
      .returning({ id: reports.id });

    return NextResponse.json({ id: rows[0]?.id, cached: false });
  } catch (err) {
    console.error("sample failed:", err);
    const msg = err instanceof Error ? err.message : "";
    const error = /does not exist/i.test(msg)
      ? "Database schema is out of date — run `npx drizzle-kit push`, then retry."
      : /authentication failed|ECONNRESET|ECONNREFUSED|connect/i.test(msg)
        ? "Database unreachable — check DATABASE_URL in your env, then retry."
        : "Could not load the sample report.";
    return NextResponse.json({ error }, { status: 500 });
  }
}
