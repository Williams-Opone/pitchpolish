import { NextResponse } from "next/server";
import { db } from "@/db";
import { reports } from "@/db/schema";
import { analyzeText } from "@/lib/analyzer";

export const runtime = "nodejs";
export const maxDuration = 60;

const MAX_BYTES = 10 * 1024 * 1024; // 10 MB
const MAX_CHARS = 60_000;

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const file = form.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No file uploaded." }, { status: 400 });
    }
    if (!/\.pdf$/i.test(file.name)) {
      return NextResponse.json(
        { error: "Only PDF decks are supported — export your deck as a text-based PDF." },
        { status: 400 }
      );
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json({ error: "Deck is over 10 MB. Trim it down and retry." }, { status: 400 });
    }

    const buf = Buffer.from(await file.arrayBuffer());
    if (buf.subarray(0, 4).toString("latin1") !== "%PDF") {
      return NextResponse.json({ error: "That file isn't a valid PDF." }, { status: 400 });
    }

    const pdfParse = (await import("pdf-parse/lib/pdf-parse.js")).default;
    let text = "";
    let pages = 0;
    try {
      const parsed = await pdfParse(buf);
      text = parsed.text ?? "";
      pages = parsed.numpages ?? 0;
    } catch {
      return NextResponse.json(
        { error: "We couldn't parse this PDF. Re-export it as a text-based PDF (not scanned images)." },
        { status: 422 }
      );
    }

    if (text.replace(/\s+/g, " ").trim().length < 80) {
      return NextResponse.json(
        { error: "No readable text found — this looks like a scanned/image-only PDF. Export with selectable text." },
        { status: 422 }
      );
    }

    const capped = text.slice(0, MAX_CHARS);
    const result = analyzeText(capped);
    const deckName = file.name.replace(/\.pdf$/i, "").replace(/[-_]+/g, " ").trim() || "Untitled deck";
    const excerpt = text.replace(/\s+/g, " ").trim().slice(0, 900);

    const rows = await db
      .insert(reports)
      .values({
        deckName,
        fileName: file.name,
        score: result.score,
        band: result.band,
        slideCount: pages,
        wordCount: result.wordCount,
        sections: result.sections,
        redFlags: result.redFlags,
        summary: result.summary,
        excerpt,
        isSample: false,
      })
      .returning({ id: reports.id });

    return NextResponse.json({ id: rows[0]?.id, score: result.score, band: result.band });
  } catch (err) {
    console.error("analyze failed:", err);
    return NextResponse.json({ error: "Analysis failed unexpectedly. Please try again." }, { status: 500 });
  }
}
