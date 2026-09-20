"use client";

import { motion } from "motion/react";
import { useState, type ReactNode } from "react";
import { IconArrow } from "@/components/icons";

export const inputClass =
  "w-full rounded-xl border border-paper/12 bg-ink-950/70 px-4 py-3.5 text-[15px] text-paper placeholder:text-paper-dim/40 transition-colors focus:border-copper-400/60 focus:outline-none focus:ring-2 focus:ring-copper-400/20";

export function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label className="mb-2 block font-mono text-[10px] font-semibold uppercase tracking-[0.24em] text-paper-dim">
        {label}
      </label>
      {children}
    </div>
  );
}

export function EyeToggle({
  shown,
  onToggle,
}: {
  shown: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={shown ? "Hide password" : "Show password"}
      className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-paper-dim transition hover:text-copper-300"
    >
      <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        {shown ? (
          <>
            <path d="M3 3l14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M8.6 5.1A8.6 8.6 0 0 1 10 5c4.5 0 7.3 3.4 8 5-.3.7-1 1.9-2.2 3M5.3 6.5C3.4 7.9 2.4 9.3 2 10c.7 1.6 3.5 5 8 5 1 0 2-.2 2.8-.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </>
        ) : (
          <>
            <path d="M2 10c.7-1.6 3.5-5 8-5s7.3 3.4 8 5c-.7 1.6-3.5 5-8 5s-7.3-3.4-8-5z" stroke="currentColor" strokeWidth="1.5" />
            <circle cx="10" cy="10" r="2.4" stroke="currentColor" strokeWidth="1.5" />
          </>
        )}
      </svg>
    </button>
  );
}

export function StrengthMeter({ password }: { password: string }) {
  const strength = (() => {
    let s = 0;
    if (password.length >= 8) s++;
    if (password.length >= 12) s++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) s++;
    if (/\d/.test(password) && /[^A-Za-z0-9]/.test(password)) s++;
    return Math.min(4, s);
  })();
  const label = ["Too short", "Weak", "Fair", "Good", "Strong"][strength];
  const tone = ["bg-flame-400", "bg-flame-400", "bg-copper-500", "bg-copper-300", "bg-moss-400"][strength];

  if (password.length === 0) return null;

  return (
    <div className="mt-3 flex items-center gap-3">
      <div className="flex flex-1 gap-1.5">
        {[1, 2, 3, 4].map((seg) => (
          <span
            key={seg}
            className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
              strength >= seg ? tone : "bg-paper/[0.09]"
            }`}
          />
        ))}
      </div>
      <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-paper-dim">{label}</span>
    </div>
  );
}

export function ErrorBanner({ error }: { error: string | null }) {
  if (!error) return null;
  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border border-flame-400/30 bg-flame-400/[0.08] px-4 py-3 text-[13px] leading-relaxed text-flame-300"
    >
      {error}
    </motion.div>
  );
}

export function SubmitButton({
  loading,
  success,
  idleLabel,
  loadingLabel,
}: {
  loading: boolean;
  success: boolean;
  idleLabel: string;
  loadingLabel: string;
}) {
  return (
    <button
      type="submit"
      disabled={loading || success}
      className="btn-shine group flex w-full items-center justify-center gap-3 rounded-full bg-copper-400 px-8 py-4 text-base font-bold text-ink-950 shadow-[0_0_46px_-12px_rgba(214,129,79,0.65)] transition-colors duration-300 hover:bg-copper-300 disabled:pointer-events-none disabled:opacity-70"
    >
      {success ? (
        "Welcome in"
      ) : loading ? (
        <>
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-ink-950/25 border-t-ink-950" />
          {loadingLabel}
        </>
      ) : (
        <>
          {idleLabel}
          <IconArrow size={17} className="transition-transform duration-300 group-hover:translate-x-1" />
        </>
      )}
    </button>
  );
}

export function GoogleButton({ onClick, disabled }: { onClick: () => void; disabled?: boolean }) {
  return (
    <>
      <div className="flex items-center gap-4" aria-hidden="true">
        <span className="h-px flex-1 bg-paper/[0.08]" />
        <span className="font-mono text-[9.5px] uppercase tracking-[0.24em] text-paper-dim/60">or</span>
        <span className="h-px flex-1 bg-paper/[0.08]" />
      </div>
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        className="flex w-full items-center justify-center gap-3 rounded-full border border-paper/15 bg-paper/[0.04] px-8 py-3.5 text-sm font-semibold text-paper transition hover:border-paper/30 hover:bg-paper/[0.07] disabled:pointer-events-none disabled:opacity-60"
      >
        <svg width="16" height="16" viewBox="0 0 18 18" aria-hidden="true">
          <path fill="#EA4335" d="M9 3.6c1.5 0 2.8.5 3.8 1.5l2.8-2.8C13.9.8 11.7 0 9 0 5.5 0 2.5 2 1 4.9l3.3 2.6C5.1 5.2 6.9 3.6 9 3.6z" />
          <path fill="#4285F4" d="M17.6 9.2c0-.7-.1-1.2-.2-1.8H9v3.5h4.9c-.2 1.1-.8 2-1.7 2.6l3.2 2.5c1.4-1.3 2.2-3.4 2.2-6.8z" />
          <path fill="#FBBC05" d="M4.3 10.5c-.2-.6-.3-1.2-.3-1.5s.1-.9.3-1.5L1 4.9C.4 6.1 0 7.5 0 9s.4 2.9 1 4.1l3.3-2.6z" />
          <path fill="#34A853" d="M9 18c2.7 0 4.9-.9 6.4-2.1l-3.2-2.5c-.9.6-2 .9-3.2.9-2.1 0-3.9-1.6-4.7-3.8L1 13.1C2.5 16 5.5 18 9 18z" />
        </svg>
        Continue with Google
      </button>
    </>
  );
}

export function usePasswordVisibility(): [boolean, () => void] {
  const [shown, setShown] = useState(false);
  return [shown, () => setShown((v) => !v)];
}
