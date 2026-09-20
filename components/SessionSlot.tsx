"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useClerk, useUser } from "@clerk/nextjs";
import UserChip from "@/components/UserChip";
import { clerkEnabled } from "@/lib/authMode";

interface LocalUser {
  name: string;
  email: string;
}

/**
 * Renders session state in the nav for whichever auth driver is active:
 * Clerk when keys are configured, the built-in session driver otherwise.
 *
 * variant "full"   — chip + sign-out (interior pages)
 * variant "compact" — avatar / sign-in link (landing nav)
 * variant "menu"   — text link (mobile menu)
 */
export default function SessionSlot({ variant = "full" }: { variant?: "full" | "compact" | "menu" }) {
  return clerkEnabled ? <ClerkSlot variant={variant} /> : <LocalSlot variant={variant} />;
}

/* ------------------------------- clerk ------------------------------- */

function ClerkSlot({ variant }: { variant: "full" | "compact" | "menu" }) {
  const { isLoaded, isSignedIn, user } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();

  if (!isLoaded) {
    return variant === "compact" ? (
      <span aria-hidden="true" className="hidden h-9 w-9 animate-pulse rounded-full bg-paper/[0.05] md:block" />
    ) : variant === "menu" ? null : (
      <span aria-hidden="true" className="hidden h-10 w-[104px] animate-pulse rounded-full bg-paper/[0.05] sm:block" />
    );
  }

  const name = user?.fullName ?? user?.firstName ?? "Member";
  const email = user?.primaryEmailAddress?.emailAddress ?? user?.emailAddresses?.[0]?.emailAddress ?? "";

  if (!isSignedIn) {
    if (variant === "menu") {
      return <Link href="/sign-in" className="text-paper transition hover:text-copper-300">Sign in</Link>;
    }
    if (variant === "compact") {
      return (
        <Link
          href="/sign-in"
          className="navlink hidden text-[13px] font-semibold tracking-wide text-paper-dim transition-colors hover:text-paper lg:block"
        >
          Sign in
        </Link>
      );
    }
    return (
      <Link
        href="/sign-in"
        className="hidden rounded-full border border-paper/15 px-4 py-2.5 text-[13px] font-semibold text-paper transition hover:border-copper-400/50 sm:block"
      >
        Sign in
      </Link>
    );
  }

  if (variant === "menu") {
    return <Link href="/dashboard" className="text-paper transition hover:text-copper-300">Your account</Link>;
  }

  if (variant === "compact") {
    return (
      <Link
        href="/dashboard"
        title={email}
        className="hidden h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-copper-400/40 bg-copper-400/15 font-display text-base text-copper-200 transition hover:bg-copper-400/25 md:flex"
      >
        {user?.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={user.imageUrl} alt={name} className="h-full w-full object-cover" />
        ) : (
          (name[0] ?? "?").toUpperCase()
        )}
      </Link>
    );
  }

  return (
    <UserChip
      name={name}
      email={email}
      onSignOut={async () => {
        await signOut();
        router.push("/");
      }}
    />
  );
}

/* ------------------------------- local ------------------------------- */

function LocalSlot({ variant }: { variant: "full" | "compact" | "menu" }) {
  const [user, setUser] = useState<LocalUser | null>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d?.user) setUser(d.user);
        setChecked(true);
      })
      .catch(() => setChecked(true));
  }, []);

  if (!checked) {
    return variant === "compact" ? (
      <span aria-hidden="true" className="hidden h-9 w-9 animate-pulse rounded-full bg-paper/[0.05] md:block" />
    ) : variant === "menu" ? null : (
      <span aria-hidden="true" className="hidden h-10 w-[104px] animate-pulse rounded-full bg-paper/[0.05] sm:block" />
    );
  }

  if (!user) {
    if (variant === "menu") {
      return <Link href="/sign-in" className="text-paper transition hover:text-copper-300">Sign in</Link>;
    }
    if (variant === "compact") {
      return (
        <Link
          href="/sign-in"
          className="navlink hidden text-[13px] font-semibold tracking-wide text-paper-dim transition-colors hover:text-paper lg:block"
        >
          Sign in
        </Link>
      );
    }
    return (
      <Link
        href="/sign-in"
        className="hidden rounded-full border border-paper/15 px-4 py-2.5 text-[13px] font-semibold text-paper transition hover:border-copper-400/50 sm:block"
      >
        Sign in
      </Link>
    );
  }

  if (variant === "menu") {
    return <Link href="/dashboard" className="text-paper transition hover:text-copper-300">Your account</Link>;
  }

  if (variant === "compact") {
    return (
      <Link
        href="/dashboard"
        title={user.email}
        className="hidden h-9 w-9 items-center justify-center rounded-full border border-copper-400/40 bg-copper-400/15 font-display text-base text-copper-200 transition hover:bg-copper-400/25 md:flex"
      >
        {(user.name[0] ?? "?").toUpperCase()}
      </Link>
    );
  }

  return <UserChip name={user.name} email={user.email} />;
}
