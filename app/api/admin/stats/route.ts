import { NextResponse } from "next/server";
import { count } from "drizzle-orm";
import { clerkClient } from "@clerk/nextjs/server";
import { db } from "@/db";
import { reports, users } from "@/db/schema";
import { clerkEnabled } from "@/lib/authMode";

export const runtime = "nodejs";

/**
 * Sign-up / report counters.
 * Protected: set ADMIN_TOKEN in your env, then call
 *   curl -H "Authorization: Bearer <ADMIN_TOKEN>" /api/admin/stats
 * With Clerk enabled, the user count comes from Clerk's cloud (the source of
 * truth for sign-ups); otherwise from the local users table.
 */
export async function GET(req: Request) {
  const token = process.env.ADMIN_TOKEN;
  if (!token) {
    return NextResponse.json(
      { error: "Stats disabled. Set ADMIN_TOKEN in your environment to enable." },
      { status: 404 }
    );
  }
  const header = req.headers.get("authorization") ?? "";
  if (header !== `Bearer ${token}`) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    const [reportRow] = await db.select({ n: count() }).from(reports);

    if (clerkEnabled) {
      const client = await clerkClient();
      const total = await client.users.getCount();
      return NextResponse.json({
        driver: "clerk",
        signedUpUsers: total,
        reports: reportRow?.n ?? 0,
        note: "Clerk holds the full user records — see Dashboard → User Management for details.",
      });
    }

    const [userRow] = await db.select({ n: count() }).from(users);
    return NextResponse.json({
      driver: "local",
      signedUpUsers: userRow?.n ?? 0,
      reports: reportRow?.n ?? 0,
    });
  } catch (err) {
    console.error("stats failed:", err);
    return NextResponse.json({ error: "Could not compute stats." }, { status: 500 });
  }
}
