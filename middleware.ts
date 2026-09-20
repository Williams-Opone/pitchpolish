import { clerkMiddleware } from "@clerk/nextjs/server";
import type { NextFetchEvent, NextRequest } from "next/server";

const clerk = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ? clerkMiddleware() : null;

export default async function middleware(
  req: NextRequest,
  evt: NextFetchEvent
): Promise<Response | void | null> {
  if (clerk) return clerk(req, evt);
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|png|svg|ico|woff2?)).*)",
    "/(api|trpc)(.*)",
  ],
};
