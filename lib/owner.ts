import { auth } from "@clerk/nextjs/server";
import { clerkEnabled } from "@/lib/authMode";
import { getSessionUser } from "@/lib/auth";

/**
 * Returns the signed-in user's owner key for whichever auth driver is live.
 * Clerk users are identified by Clerk's own user id (stored as a plain string —
 * Clerk keeps the actual user record in its managed cloud, not in our DB).
 */
export async function getCurrentOwner(): Promise<string | null> {
  if (clerkEnabled) {
    try {
      const { userId } = await auth();
      return userId ? `clerk:${userId}` : null;
    } catch {
      return null;
    }
  }
  try {
    const user = await getSessionUser();
    return user ? `local:${user.id}` : null;
  } catch {
    return null;
  }
}

/** Shared/sample/legacy rows (null owner) stay visible to everyone. */
export function canSee(rowOwner: string | null, me: string | null): boolean {
  if (rowOwner === null) return true;
  return rowOwner === me;
}
