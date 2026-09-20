import { NextResponse } from "next/server";
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { db } from "@/db";
import { reports } from "@/db/schema";
import { analyzeDeckWithAI } from "@/lib/analyzer";
import { getCurrentOwner } from "@/lib/owner";
import { putTmpReport } from "@/lib/tmpReports";

export const runtime = "nodejs";
export const maxDuration = 120;

const MAX_BYTES = 10 * 1024 * 1024; // 10 MB
const MAX_CHARS = 60_000;

/**
 * Resolves and imports a server dependency at RUNTIME only. The bundler never
 * sees a static specifier, so a package that isn't installed yet can never
 * break the build — the route degrades gracefully instead.
 */
async function tryNodeImport(name: string, fsRelPath?: string): Promise<any | null> {
  try {
    // Runtime-only loading via createRequire: opaque to the bundler, so a
    // missing package can never break the build. Direct fs paths dodge
    // "exports" condition traps; Node 22 require()s ESM just fine.
    const { createRequire } = await import("node:module");
    const req = createRequire(path.join(process.cwd(), "package.json"));
    const file = fsRelPath
      ? path.join(process.cwd(), "node_modules", fsRelPath)
      : req.resolve(name);
    if (fsRelPath && !fs.existsSync(file)) return null;
    return req(file);
  } catch {
    return null;
  }
}

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
    if (/\.(docx?|txt|md|png|jpe?g)$/i.test(file.name)) {
      return NextResponse.json(
        { error: "We read pitch decks as PDFs. Export or print this file to PDF first, then upload." },
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

    const pdfRoot = path.join(process.cwd(), "node_modules", "pdfjs-dist");
    let text = "";
    let pages = 0;

    // Modern pdf.js (legacy build runs worker-free in Node)
    const pdfjs = await tryNodeImport("pdfjs-dist", "pdfjs-dist/legacy/build/pdf.mjs");
    if (!pdfjs) {
      return NextResponse.json(
        { error: "The server is missing the pdfjs-dist package. Run `npm install` in the project root, then retry." },
        { status: 500 }
      );
    }

    try {
      // Bundlers don't emit the worker chunk — point the fake-worker loader
      // at the real file on disk. file:// URLs keep this correct on Windows,
      // where bare C:\ paths break dynamic import() and URL parsing.
      pdfjs.GlobalWorkerOptions.workerSrc =
        pathToFileURL(path.join(pdfRoot, "legacy", "build", "pdf.worker.mjs")).href;
      const doc = await pdfjs
        .getDocument({
          data: new Uint8Array(buf),
          // Real-world exports (Canva, Slides, Figma) embed subsetted fonts
          // that need CMap + standard font data to decode glyph→text.
          // (pdf.js requires a trailing slash on factory URLs.)
          cMapUrl: pathToFileURL(path.join(pdfRoot, "cmaps")).href + "/",
          cMapPacked: true,
          standardFontDataUrl: pathToFileURL(path.join(pdfRoot, "standard_fonts")).href + "/",
        })
        .promise;
      pages = doc.numPages;
      for (let i = 1; i <= doc.numPages; i++) {
        const page = await doc.getPage(i);
        const content = await page.getTextContent();
        text +=
          content.items
            .map((it: { str?: string }) => ("str" in it ? it.str : ""))
            .join(" ") + "\n";
      }
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

    // Image-only / scanned deck? Run OCR before giving up, hard-capped so a
    // request can never hang on a 60-page scan.
    if (words(text) < 15 && buf.length < 20 * 1024 * 1024) {
      const OCR_BUDGET_MS = 50_000;
      try {
        const ocr = (async () => {
          const tess = await tryNodeImport("tesseract.js");
          if (!tess) {
            console.error(
              "analyze: tesseract.js not installed — OCR skipped. Run `npm install` to enable scanned-deck support."
            );
            return "";
          }
          const worker = await tess.createWorker("eng", 1, { logger: () => {} });
          try {
            const r = await worker.recognize(buf);
            return String(r?.data?.text ?? "");
          } finally {
            await worker.terminate().catch(() => {});
          }
        })();
        const raced = await Promise.race([
          ocr,
          new Promise((resolve) => setTimeout(() => resolve(""), OCR_BUDGET_MS)),
        ]);
        const ocrText = String(raced ?? "").trim();
        if (words(ocrText) > words(text)) text = ocrText;
      } catch (ocrErr) {
        const m = ocrErr instanceof Error ? ocrErr.message : String(ocrErr);
        if (/cannot find module|module not found|ERR_MODULE/i.test(m)) {
          console.error("analyze: tesseract.js not installed — OCR skipped. Run `npm install` to enable scanned-deck support.");
        } else {
          console.error("analyze: ocr fallback failed:", ocrErr);
        }
      }
    }

    if (words(text) < 15) {
      return NextResponse.json(
        {
          error:
            "No selectable text found, even after OCR. Usually: a low-res scan, a password-protected file, or slides flattened to images. Re-export from the source app as a standard PDF — or open the sample report to see the pipeline working.",
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
      // The database is a luxury, not a requirement: analysis always completes.
      // Without a DB the report is served from the ephemeral store for 1 hour.
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
