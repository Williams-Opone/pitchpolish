import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { reports } from "@/db/schema";
import { canSee, getCurrentOwner } from "@/lib/owner";
import { getTmpReport, isTmpId } from "@/lib/tmpReports";

export const runtime = "nodejs";

export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await ctx.params;
    if (isTmpId(id)) {
      const tmp = getTmpReport(id);
      if (!tmp) return NextResponse.json({ error: "Report not found." }, { status: 404 });
      return NextResponse.json({ report: tmp });
    }
    const num = Number(id);
    if (!Number.isInteger(num) || num <= 0) {
      return NextResponse.json({ error: "Invalid report id." }, { status: 400 });
    }

    const rows = await db.select().from(reports).where(eq(reports.id, num)).limit(1);
    if (rows.length === 0) {
      return NextResponse.json({ error: "Report not found." }, { status: 404 });
    }
    const me = await getCurrentOwner();
    if (!canSee(rows[0].owner, me)) {
      return NextResponse.json({ error: "Report not found." }, { status: 404 });
    }
    return NextResponse.json({ report: rows[0] });
  } catch (err) {
    console.error("report fetch failed:", err);
    return NextResponse.json({ error: "Could not load the report." }, { status: 500 });
  }
}
