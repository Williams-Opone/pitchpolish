"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { AnimatePresence, motion, useAnimationControls } from "motion/react";
import { useSignIn, useSignUp } from "@clerk/nextjs";
import type { AuthMode } from "@/components/AuthScene";
import {
  ErrorBanner,
  EyeToggle,
  Field,
  GoogleButton,
  StrengthMeter,
  SubmitButton,
  inputClass,
  usePasswordVisibility,
} from "./shared";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

type ClerkErr = { message?: string; longMessage?: string; errors?: { longMessage?: string; message?: string }[] } | null;

function message(e: unknown): string {
  const err = (e ?? {}) as ClerkErr & { errors?: { longMessage?: string; message?: string }[] };
  return (
    err?.longMessage ??
    err?.errors?.[0]?.longMessage ??
    err?.errors?.[0]?.message ??
    err?.message ??
    "Something went wrong."
  );
}

function mapOAuthError(e: unknown): string {
  const raw = message(e);
  if (/enabled|configured|connection|oauth|provider/i.test(raw)) {
    return `${raw} — Finish wiring Google: Clerk Dashboard → Configure → Social connections → enable Google, then add your Google OAuth client (see project notes).`;
  }
  return raw;
}

export default function ClerkAuthForm({ mode }: { mode: AuthMode }) {
  const router = useRouter();
  const isSignup = mode === "signup";
  const { signIn } = useSignIn();
  const { signUp } = useSignUp();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState<"form" | "code">("form");
  const [showPw, togglePw] = usePasswordVisibility();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const shake = useAnimationControls();

  const fail = (msg: string) => {
    setError(msg);
    setLoading(false);
    shake.start({ x: [0, -12, 12, -8, 8, 0], transition: { duration: 0.45 } });
  };

  const navigate = ({ session, decorateUrl }: { session?: { currentTask?: unknown } | null; decorateUrl: (p: string) => string }) => {
    if (session?.currentTask) return; // session tasks handled elsewhere by Clerk
    const url = decorateUrl("/dashboard");
    if (url.startsWith("http")) window.location.href = url;
    else router.push(url);
  };

  const submitForm = async (e: FormEvent) => {
    e.preventDefault();
    if (loading || success) return;
    setError(null);

    if (isSignup && name.trim().length < 2) return fail("Tell us your name — at least 2 characters.");
    if (!EMAIL_RE.test(email.trim())) return fail("That email doesn't look right.");
    if (isSignup && password.length < 8) return fail("Password needs at least 8 characters.");
    if (!isSignup && password.length === 0) return fail("Enter your password.");

    setLoading(true);
    try {
      if (isSignup) {
        const [firstName, ...rest] = name.trim().split(/\s+/);
        const created = await signUp.password({
          emailAddress: email.trim(),
          password,
          firstName,
          lastName: rest.join(" ") || undefined,
        });
        if (created.error) return fail(message(created.error));

        const sent = await signUp.verifications.sendEmailCode();
        if (sent.error) return fail(message(sent.error));
        setStep("code");
        setLoading(false);
      } else {
        const res = await signIn.password({ emailAddress: email.trim(), password });
        if (res.error) return fail(message(res.error));

        if (signIn.status === "complete") {
          setSuccess(true);
          await signIn.finalize({ navigate });
        } else if (signIn.status === "needs_second_factor" || signIn.status === "needs_client_trust") {
          const sent = await signIn.emailCode.sendCode();
          if (sent.error) return fail(message(sent.error));
          setStep("code");
          setLoading(false);
        } else {
          fail("We couldn't complete that sign-in. Try again or use Google.");
        }
      }
    } catch (e) {
      fail(message(e));
    }
  };

  const submitCode = async (e: FormEvent) => {
    e.preventDefault();
    if (loading || success) return;
    setError(null);
    if (!/^\d{6}$/.test(code.trim())) return fail("Enter the 6-digit code from your inbox.");
    setLoading(true);
    try {
      if (isSignup) {
        const res = await signUp.verifications.verifyEmailCode({ code: code.trim() });
        if (res.error) return fail(message(res.error));
        if (signUp.status === "complete") {
          setSuccess(true);
          await signUp.finalize({ navigate });
        } else {
          fail("Verification didn't complete — request a new code and retry.");
        }
      } else {
        const res = await signIn.emailCode.verifyCode({ code: code.trim() });
        if (res.error) return fail(message(res.error));
        if (signIn.status === "complete") {
          setSuccess(true);
          await signIn.finalize({ navigate });
        } else {
          fail("Verification didn't complete — request a new code and retry.");
        }
      }
    } catch (e) {
      fail(message(e));
    }
  };

  const resend = async () => {
    if (loading || success) return;
    setError(null);
    setLoading(true);
    try {
      const r = isSignup
        ? await signUp.verifications.sendEmailCode()
        : await signIn.emailCode.sendCode();
      if (r.error) return fail(message(r.error));
      setCode("");
      setLoading(false);
    } catch (e) {
      fail(message(e));
    }
  };

  const google = async () => {
    setError(null);
    setLoading(true);
    const params = {
      strategy: "oauth_google" as const,
      redirectUrl: `${window.location.origin}/dashboard`,
      redirectCallbackUrl: `${window.location.origin}/sso-callback`,
    };
    try {
      // Sign-up and sign-in are separate Clerk resources — hit the right one
      // so first-timers create an account and returnees get a session.
      const res = isSignup ? await signUp.sso(params) : await signIn.sso(params);
      if (res.error) fail(mapOAuthError(res.error));
    } catch (e) {
      fail(mapOAuthError(e));
    }
  };

  return (
    <motion.div animate={shake}>
      {step === "form" ? (
        <>
          <div className="mb-8">
            <h2 className="font-display text-4xl tracking-tight text-paper">
              {isSignup ? "Start scoring." : "Welcome back."}
            </h2>
            <p className="mt-2 text-[15px] text-paper-dim">
              {isSignup
                ? "One free analysis. No card, no call, no mercy."
                : "Your decks and verdicts are where you left them."}
            </p>
          </div>

          <form onSubmit={submitForm} className="space-y-5" noValidate>
            <AnimatePresence initial={false}>
              {isSignup && (
                <motion.div
                  key="name"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <Field label="Full name">
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Ada Lovelace"
                      autoComplete="name"
                      className={inputClass}
                    />
                  </Field>
                </motion.div>
              )}
            </AnimatePresence>

            <Field label="Email">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="founder@yourco.com"
                autoComplete="email"
                className={inputClass}
              />
            </Field>

            <Field label="Password">
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={isSignup ? "8+ characters" : "Your password"}
                  autoComplete={isSignup ? "new-password" : "current-password"}
                  className={`${inputClass} pr-12`}
                />
                <EyeToggle shown={showPw} onToggle={togglePw} />
              </div>
              {isSignup && <StrengthMeter password={password} />}
            </Field>

            <ErrorBanner error={error} />

            <SubmitButton
              loading={loading}
              success={success}
              idleLabel={isSignup ? "Create my account" : "Sign in"}
              loadingLabel={isSignup ? "Creating account…" : "Signing in…"}
            />
          </form>

          <div className="mt-6">
            <GoogleButton onClick={google} disabled={loading || success} />
          </div>
        </>
      ) : (
        <>
          <div className="mb-8">
            <h2 className="font-display text-4xl tracking-tight text-paper">Check your inbox.</h2>
            <p className="mt-2 text-[15px] leading-relaxed text-paper-dim">
              We sent a 6-digit code to <span className="text-copper-300">{email.trim()}</span>.
              Enter it to {isSignup ? "activate your account" : "finish signing in"}.
            </p>
          </div>

          <form onSubmit={submitCode} className="space-y-5" noValidate>
            <Field label="Verification code">
              <input
                inputMode="numeric"
                maxLength={6}
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                placeholder="••••••"
                autoComplete="one-time-code"
                className={`${inputClass} text-center font-mono text-2xl tracking-[0.5em]`}
              />
            </Field>

            <ErrorBanner error={error} />

            <SubmitButton
              loading={loading}
              success={success}
              idleLabel="Verify & enter"
              loadingLabel="Verifying…"
            />
          </form>

          <div className="mt-6 flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={resend}
              disabled={loading || success}
              className="text-sm font-semibold text-copper-300 underline decoration-copper-400/40 underline-offset-4 transition hover:text-copper-200 disabled:opacity-50"
            >
              I need a new code
            </button>
            <span className="font-mono text-[9.5px] uppercase tracking-[0.16em] text-paper-dim/60">
              codes last 10 min
            </span>
          </div>
          <button
            type="button"
            onClick={() => {
              setStep("form");
              setCode("");
              setError(null);
            }}
            className="mt-4 w-full text-center text-sm font-semibold text-paper-dim transition hover:text-copper-300"
          >
            ← Back to {isSignup ? "sign up" : "sign in"}
          </button>
        </>
      )}
    </motion.div>
  );
}
