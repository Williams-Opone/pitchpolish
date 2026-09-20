"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useUser } from "@clerk/nextjs";
import Background3D from "@/components/Background3D";
import { ShineBorder } from "@/components/premium";
import { clerkEnabled } from "@/lib/authMode";
import ClerkAuthForm from "@/components/auth/ClerkAuthForm";
import LocalAuthForm from "@/components/auth/LocalAuthForm";

export type AuthMode = "signin" | "signup";

const QUOTES = [
  {
    q: "It flagged the missing TAM before my lead investor did. We closed at the number we asked for.",
    name: "Sara Lindqvist",
    role: "Founder, Havn",
  },
  {
    q: "The score hurt. That's the point. Three partner meetings the week after we fixed the red flags.",
    name: "Marcus Chen",
    role: "CEO, Parcelo",
  },
  {
    q: "I've paid consultants $15k for less. The coach answers like someone who actually read my deck.",
    name: "Adaeze Obi",
    role: "Co-founder, Brightline Health",
  },
];

/** Already authenticated? Bounce to the dashboard (either driver). */
function SignedInRedirect() {
  const router = useRouter();

  if (clerkEnabled) {
    return <ClerkSignedInRedirect />;
  }
  return <LocalSignedInRedirect router={router} />;
}

function ClerkSignedInRedirect() {
  const router = useRouter();
  const { isLoaded, isSignedIn } = useUser();
  useEffect(() => {
    if (isLoaded && isSignedIn) router.replace("/dashboard");
  }, [isLoaded, isSignedIn, router]);
  return null;
}

function LocalSignedInRedirect({ router }: { router: ReturnType<typeof useRouter> }) {
  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => (r.ok ? router.replace("/dashboard") : null))
      .catch(() => {});
  }, [router]);
  return null;
}

export default function AuthScene({ mode }: { mode: AuthMode }) {
  const router = useRouter();
  const [quoteIdx, setQuoteIdx] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => setQuoteIdx((i) => (i + 1) % QUOTES.length), 6000);
    return () => window.clearInterval(id);
  }, []);

  const switchMode = (next: AuthMode) => {
    router.replace(next === "signup" ? "/sign-up" : "/sign-in");
  };

  return (
    <div className="relative min-h-screen">
      <Background3D />
      <div className="grain pointer-events-none fixed inset-0 z-[9999] opacity-[0.045]" aria-hidden="true" />
      <SignedInRedirect />

      <div className="relative z-10 mx-auto grid min-h-screen max-w-[1500px] lg:grid-cols-[1.05fr_1fr]">
        {/* ===================== LEFT — brand panel ===================== */}
        <div className="relative hidden flex-col justify-between overflow-hidden border-r border-paper/[0.06] p-12 lg:flex xl:p-16">
          <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-br from-ink-800/60 via-transparent to-ink-950/60" />

          <div className="relative">
            <Link href="/" className="font-display text-3xl tracking-tight text-paper">
              Pitch<span className="italic text-copper-300">Polish</span>
              <span className="text-copper-400">.</span>
            </Link>
          </div>

          <div className="relative max-w-xl">
            <div className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-copper-400/25 bg-copper-400/[0.06] px-4 py-2">
              <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-copper-400" />
              <span className="font-mono text-[10.5px] font-semibold uppercase tracking-[0.24em] text-copper-300">
                Member access
              </span>
            </div>

            <h1 className="font-display text-6xl leading-[0.94] tracking-tight text-paper xl:text-7xl">
              The verdict,
              <br />
              <em className="copper-shimmer">before the meeting.</em>
            </h1>
            <p className="mt-6 max-w-md text-lg font-light leading-relaxed text-paper-dim">
              Score your deck against nine investor dimensions, fix the red flags, and walk in
              already funded in your head.
            </p>

            {/* rotating proof */}
            <div className="mt-12 min-h-[132px]">
              <AnimatePresence mode="wait">
                <motion.figure
                  key={quoteIdx}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="rounded-2xl border border-paper/[0.08] bg-ink-850/70 p-6 backdrop-blur-sm"
                >
                  <blockquote className="text-[15px] leading-relaxed text-paper/90">
                    “{QUOTES[quoteIdx].q}”
                  </blockquote>
                  <figcaption className="mt-4 flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full border border-copper-400/30 bg-copper-400/10 font-display text-sm text-copper-300">
                      {QUOTES[quoteIdx].name[0]}
                    </span>
                    <span>
                      <span className="block font-display text-[15px] text-paper">{QUOTES[quoteIdx].name}</span>
                      <span className="block font-mono text-[9.5px] uppercase tracking-[0.2em] text-paper-dim">
                        {QUOTES[quoteIdx].role}
                      </span>
                    </span>
                  </figcaption>
                </motion.figure>
              </AnimatePresence>
              <div className="mt-4 flex gap-1.5">
                {QUOTES.map((_, i) => (
                  <span
                    key={i}
                    className={`h-1 rounded-full transition-all duration-500 ${
                      i === quoteIdx ? "w-8 bg-copper-400" : "w-3 bg-paper/15"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="relative flex items-center gap-10 font-mono text-[10px] uppercase tracking-[0.24em] text-paper-dim/60">
            <span>1,284 decks scored</span>
            <span>9 dimensions</span>
            <span>48s average run</span>
          </div>
        </div>

        {/* ===================== RIGHT — the form ===================== */}
        <div className="flex flex-col items-center justify-center px-6 py-12 md:px-10">
          <div className="mb-10 lg:hidden">
            <Link href="/" className="font-display text-3xl tracking-tight text-paper">
              Pitch<span className="italic text-copper-300">Polish</span>
              <span className="text-copper-400">.</span>
            </Link>
          </div>

          <motion.div
            className="w-full max-w-[460px]"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <ShineBorder radius="2rem" duration={5.5}>
              <div className="relative overflow-hidden rounded-[2rem] border border-paper/[0.08] bg-ink-850/90 p-8 shadow-2xl backdrop-blur-xl md:p-10">
                <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(214,129,79,0.1),transparent_55%)]" />

                <div className="relative">
                  {/* mode tabs */}
                  <div className="mb-9 grid grid-cols-2 rounded-full border border-paper/10 bg-ink-950/70 p-1">
                    {(
                      [
                        ["signin", "Sign in"],
                        ["signup", "Create account"],
                      ] as [AuthMode, string][]
                    ).map(([m, label]) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => switchMode(m)}
                        className={`relative rounded-full py-2.5 text-sm font-bold transition-colors duration-300 ${
                          mode === m ? "text-ink-950" : "text-paper-dim hover:text-paper"
                        }`}
                      >
                        {mode === m && (
                          <motion.span
                            layoutId="auth-tab"
                            className="absolute inset-0 rounded-full bg-copper-400"
                            transition={{ type: "spring", stiffness: 320, damping: 30 }}
                          />
                        )}
                        <span className="relative z-10">{label}</span>
                      </button>
                    ))}
                  </div>

                  {clerkEnabled ? <ClerkAuthForm mode={mode} /> : <LocalAuthForm mode={mode} />}

                  <p className="mt-7 text-center text-sm text-paper-dim">
                    {mode === "signup" ? (
                      <>
                        Already scoring with us?{" "}
                        <button
                          onClick={() => switchMode("signin")}
                          className="font-semibold text-copper-300 underline decoration-copper-400/40 underline-offset-4 transition hover:text-copper-200"
                        >
                          Sign in
                        </button>
                      </>
                    ) : (
                      <>
                        First time here?{" "}
                        <button
                          onClick={() => switchMode("signup")}
                          className="font-semibold text-copper-300 underline decoration-copper-400/40 underline-offset-4 transition hover:text-copper-200"
                        >
                          Create an account
                        </button>
                      </>
                    )}
                  </p>

                  <p className="mt-4 text-center text-xs text-paper-dim/60">
                    By continuing you agree to our{" "}
                    <Link
                      href="/terms"
                      className="underline decoration-paper-dim/30 underline-offset-2 transition hover:text-paper hover:decoration-copper-400"
                    >
                      Terms
                    </Link>{" "}
                    and{" "}
                    <Link
                      href="/privacy"
                      className="underline decoration-paper-dim/30 underline-offset-2 transition hover:text-paper hover:decoration-copper-400"
                    >
                      Privacy Policy
                    </Link>
                    .
                  </p>
                </div>
              </div>
            </ShineBorder>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
