import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { users } from "@/db/schema";
import {
  EMAIL_RE,
  createSession,
  hashPassword,
  normalizeEmail,
  setSessionCookie,
} from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => null)) as {
      name?: string;
      email?: string;
      password?: string;
    } | null;

    const name = (body?.name ?? "").trim();
    const email = normalizeEmail(body?.email ?? "");
    const password = body?.password ?? "";

    if (name.length < 2 || name.length > 60) {
      return NextResponse.json({ error: "Tell us your name — 2 to 60 characters." }, { status: 400 });
    }
    if (!EMAIL_RE.test(email)) {
      return NextResponse.json({ error: "That email doesn't look right." }, { status: 400 });
    }
    if (password.length < 8 || password.length > 128) {
      return NextResponse.json({ error: "Password needs at least 8 characters." }, { status: 400 });
    }

    const existing = await db.select({ id: users.id }).from(users).where(eq(users.email, email)).limit(1);
    if (existing.length > 0) {
      return NextResponse.json(
        { error: "An account with that email already exists. Sign in instead." },
        { status: 409 }
      );
    }

    const inserted = await db
      .insert(users)
      .values({ name, email, passwordHash: hashPassword(password) })
      .returning({ id: users.id });

    const user = inserted[0];
    const { token, expiresAt } = await createSession(user.id);
    await setSessionCookie(token, expiresAt);

    return NextResponse.json({ user: { name, email } });
  } catch (err) {
    console.error("signup failed:", err);
    return NextResponse.json({ error: "Couldn't create your account. Please try again." }, { status: 500 });
  }
}
