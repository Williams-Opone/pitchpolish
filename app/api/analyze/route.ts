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

const MAX_BYTES = 10 * 1024 * 1024; // 10 MB
const MAX_CHARS = 60_000;

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const file = form.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No file uploaded." }, { status: 400 });
    }
    if (/\.(pptx?|key|odp)$/i.test(file.name)) {
      return NextResponse.json(
        { error: "That's a slide editor file. In PowerPoint/Keynote/Google Slides: File → Export → PDF, then upload the PDF." },
        { status: 400 }
      );
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

    let text = "";
    let pages = 0;

    try {
      const pdf = await getDocumentProxy(new Uint8Array(buf));
      pages = pdf.numPages;
      const result = await extractText(pdf, { mergePages: true });
      text = Array.isArray(result.text) ? result.text.join("\n") : (result.text || "");
    } catch (parseErr) {
      const reason = parseErr instanceof Error ? parseErr.message : String(parseErr);
      console.error("analyze: pdf parse failed:", parseErr);
      return NextResponse.json(
        {
          error: `We couldn't open this PDF's structure (${reason.slice(0, 140)}). Re-export it from your slide app (File → Export → PDF) and retry.`,
        },
        { status: 422 }
      );
    }

    const words = (s: string) => s.replace(/\s+/g, " ").trim().split(" ").filter(Boolean).length;

    if (words(text) < 15) {
      return NextResponse.json(
        {
          error: "No selectable text found in this PDF. It appears to be an image-only scan or flattened slides. Please re-export as a standard text PDF.",
        },
        { status: 422 }
      );
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
      console.error("analyze: database unavailable, serving ephemeral report:", dbErr);
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
    console.error("analyze failed:", err);
    return NextResponse.json({ error: "Analysis failed unexpectedly. Please try again." }, { status: 500 });
  }
}