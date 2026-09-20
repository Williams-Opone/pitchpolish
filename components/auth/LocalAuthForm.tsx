"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { AnimatePresence, motion, useAnimationControls } from "motion/react";
import type { AuthMode } from "@/components/AuthScene";
import {
  ErrorBanner,
  EyeToggle,
  Field,
  StrengthMeter,
  SubmitButton,
  inputClass,
  usePasswordVisibility,
} from "./shared";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Built-in session driver used when Clerk keys aren't configured. */
export default function LocalAuthForm({ mode }: { mode: AuthMode }) {
  const router = useRouter();
  const isSignup = mode === "signup";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (loading || success) return;
    setError(null);

    if (isSignup && name.trim().length < 2) return fail("Tell us your name — at least 2 characters.");
    if (!EMAIL_RE.test(email.trim())) return fail("That email doesn't look right.");
    if (isSignup && password.length < 8) return fail("Password needs at least 8 characters.");
    if (!isSignup && password.length === 0) return fail("Enter your password.");

    setLoading(true);
    try {
      const res = await fetch(isSignup ? "/api/auth/signup" : "/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), email: email.trim(), password }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(data.error ?? "Something went wrong.");
      setSuccess(true);
      window.setTimeout(() => router.push("/dashboard"), 550);
    } catch (err) {
      fail(err instanceof Error ? err.message : "Something went wrong.");
    }
  };

  return (
    <motion.div animate={shake}>
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

      <form onSubmit={submit} className="space-y-5" noValidate>
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
    </motion.div>
  );
}
