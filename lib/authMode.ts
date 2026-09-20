/**
 * Auth runs on Clerk when keys are configured (your production project);
 * otherwise the built-in local session driver takes over so the app stays
 * fully functional in keyless environments.
 */
export const clerkEnabled = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);
