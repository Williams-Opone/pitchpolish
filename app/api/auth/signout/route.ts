import { NextResponse } from "next/server";
import { destroySession } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST() {
  try {
    await destroySession();
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("signout failed:", err);
    return NextResponse.json({ error: "Sign-out failed." }, { status: 500 });
  }
}
