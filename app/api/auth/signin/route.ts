import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { users } from "@/db/schema";
import { createSession, normalizeEmail, setSessionCookie, verifyPassword } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => null)) as {
      email?: string;
      password?: string;
    } | null;

    const email = normalizeEmail(body?.email ?? "");
    const password = body?.password ?? "";

    if (!email || !password) {
      return NextResponse.json({ error: "Enter your email and password." }, { status: 400 });
    }

    const rows = await db
      .select({ id: users.id, name: users.name, email: users.email, passwordHash: users.passwordHash })
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    const user = rows[0];
    if (!user || !verifyPassword(password, user.passwordHash)) {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }

    const { token, expiresAt } = await createSession(user.id);
    await setSessionCookie(token, expiresAt);

    return NextResponse.json({ user: { name: user.name, email: user.email } });
  } catch (err) {
    console.error("signin failed:", err);
    return NextResponse.json({ error: "Sign-in failed unexpectedly. Please try again." }, { status: 500 });
  }
}
