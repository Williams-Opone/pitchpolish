// Dev-only helper: builds a strictly valid one-page text PDF with pdf-lib,
// for testing /api/analyze deterministically across environments.
const { PDFDocument, StandardFonts, rgb } = require("pdf-lib");
const fs = require("fs");

const LINES = [
  "Problem: Small clinics struggle with scheduling chaos and lose revenue every week.",
  "Solution: Our platform automates the workflow and replaces spreadsheets.",
  "Market: TAM of $12 billion, SAM $3 billion, SOM $200 million.",
  "Business model: subscription pricing at $99 per seat per month, 80% gross margin.",
  "Traction: 400 paying customers, MRR growth 12% month-over-month, 92% retention.",
  "Team: founders previously at Stripe and Google.",
  "Competition: unlike incumbents our moat is data.",
  "Financials: 18 month projection, burn and runway detailed.",
  "Ask: raising a $2M seed round, use of funds 60/25/15.",
];

async function main() {
  const doc = await PDFDocument.create();
  const page = doc.addPage([612, 792]);
  const font = await doc.embedFont(StandardFonts.Helvetica);
  let y = 740;
  for (const line of LINES) {
    page.drawText(line, { x: 54, y, size: 11, font, color: rgb(0.1, 0.1, 0.1) });
    y -= 20;
  }
  const bytes = await doc.save();
  fs.writeFileSync("/tmp/test-deck.pdf", Buffer.from(bytes));
  console.log("wrote /tmp/test-deck.pdf", bytes.length, "bytes");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
