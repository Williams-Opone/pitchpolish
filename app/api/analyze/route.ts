import { NextResponse } from "next/server";
import { getDocumentProxy, extractText } from "unpdf";
import { db } from "@/db";
import { reports } from "@/db/schema";
import { analyzeDeckWithAI } from "@/lib/analyzer";
import { getCurrentOwner } from "@/lib/owner";
import { putTmpReport } from "@/lib/tmpReports";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 120;

const MAX_BYTES = 10 * 1024 * 1024;
const MAX_CHARS = 60_000;

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const file = form.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No file uploaded." }, { status: 400 });
    }
    if (!/\.pdf$/i.test(file.name)) {
      return NextResponse.json({ error: "Only PDF decks are supported." }, { status: 400 });
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json({ error: "Deck is over 10 MB." }, { status: 400 });
    }

    const buf = Buffer.from(await file.arrayBuffer());
    if (buf.subarray(0, 4).toString("latin1") !== "%PDF") {
      return NextResponse.json({ error: "Invalid PDF file." }, { status: 400 });
    }

    let text = "";
    let pages = 0;

    try {
      const pdf = await getDocumentProxy(new Uint8Array(buf));
      pages = pdf.numPages;
      const result = await extractText(pdf, { mergePages: true });
      text = Array.isArray(result.text) ? result.text.join("\n") : (result.text || "");
    } catch (parseErr) {
      console.error("PDF parse failed:", parseErr);
      return NextResponse.json({ error: "Could not parse PDF text structure." }, { status: 422 });
    }

    const words = text.replace(/\s+/g, " ").trim().split(" ").filter(Boolean).length;
    if (words < 15) {
      return NextResponse.json({ error: "No selectable text found. Deck may be scanned or flattened images." }, { status: 422 });
    }

    const capped = text.slice(0, MAX_CHARS);
    const result = await analyzeDeckWithAI(capped);
    const deckName = file.name.replace(/\.pdf$/i, "").replace(/[-_]+/g, " ").trim() || "Untitled deck";
    const excerpt = text.replace(/\s+/g, " ").trim().slice(0, 900);

    let rows: { id: number }[];
    try {
      rows = await db
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
          owner: await getCurrentOwner(),
        })
        .returning({ id: reports.id });
    } catch (dbErr) {
      console.error("Database insert failed, serving ephemeral report:", dbErr);
      const tmpId = putTmpReport({
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
        owner: null,
      });

      return NextResponse.json({
        id: tmpId,
        score: result.score,
        band: result.band,
        ephemeral: true,
      });
    }

    return NextResponse.json({ id: rows[0]?.id, score: result.score, band: result.band });
  } catch (err) {
    console.error("Analysis route error:", err);
    return NextResponse.json({ error: "Analysis failed unexpectedly." }, { status: 500 });
  }
}