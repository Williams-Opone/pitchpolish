"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";

export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const fn = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", fn);
    return () => mq.removeEventListener("change", fn);
  }, []);
  return reduced;
}

function useInView<T extends HTMLElement>(threshold = 0.2) {
  const ref = useRef<T>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!("IntersectionObserver" in window)) {
      setSeen(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setSeen(true);
            io.disconnect();
          }
        }
      },
      { threshold, rootMargin: "0px 0px -8% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return { ref, seen };
}

/* ---------------- Scroll reveal ---------------- */

export function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const { ref, seen } = useInView<HTMLDivElement>(0.12);
  return (
    <div
      ref={ref}
      className={`rv ${seen ? "rv-in" : ""} ${className}`}
      style={{ transitionDelay: `${delay}ms` } as CSSProperties}
    >
      {children}
    </div>
  );
}

/* ---------------- Count-up number ---------------- */

export function CountUp({
  to,
  duration = 1400,
  decimals = 0,
  prefix = "",
  suffix = "",
  className = "",
}: {
  to: number;
  duration?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}) {
  const { ref, seen } = useInView<HTMLSpanElement>(0.4);
  const [val, setVal] = useState(0);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (!seen) return;
    if (reduced) {
      setVal(to);
      return;
    }
    let raf = 0;
    const t0 = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(to * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [seen, to, duration, reduced]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {val.toFixed(decimals)}
      {suffix}
    </span>
  );
}

/* ---------------- Scramble decode text ---------------- */

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$%#/\\<>*";

export function Scramble({ text, className = "" }: { text: string; className?: string }) {
  const { ref, seen } = useInView<HTMLSpanElement>(0.5);
  const [out, setOut] = useState(text);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (!seen) return;
    if (reduced) {
      setOut(text);
      return;
    }
    let frame = 0;
    const total = Math.max(18, text.length * 2);
    const id = window.setInterval(() => {
      frame++;
      const solved = Math.floor((frame / total) * text.length);
      let s = "";
      for (let i = 0; i < text.length; i++) {
        const ch = text[i];
        if (ch === " " || i < solved) s += ch;
        else s += GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
      }
      setOut(s);
      if (solved >= text.length) {
        setOut(text);
        window.clearInterval(id);
      }
    }, 34);
    return () => window.clearInterval(id);
  }, [seen, text, reduced]);

  return (
    <span ref={ref} className={className} aria-label={text}>
      {out}
    </span>
  );
}

/* ---------------- Animated score ring ---------------- */

export function ScoreRing({
  value,
  size = 168,
  stroke = 6,
  animate = true,
}: {
  value: number;
  size?: number;
  stroke?: number;
  animate?: boolean;
}) {
  const { ref, seen } = useInView<HTMLDivElement>(0.4);
  const reduced = useReducedMotion();
  const r = 42;
  const C = 2 * Math.PI * r;
  const shown = animate && seen && !reduced;
  const offset = shown ? C - (C * value) / 100 : animate && !seen ? C : C - (C * value) / 100;

  return (
    <div ref={ref} className="relative" style={{ width: size, height: size }}>
      <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r={r} fill="none" stroke="rgba(244,242,234,0.09)" strokeWidth={stroke} />
        <circle
          cx="50"
          cy="50"
          r={r}
          fill="none"
          stroke="url(#ringCopper)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={C}
          strokeDashoffset={offset}
          style={{ transition: shown ? "stroke-dashoffset 1.6s cubic-bezier(0.22,1,0.36,1)" : "none" }}
        />
        <defs>
          <linearGradient id="ringCopper" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f4cdab" />
            <stop offset="55%" stopColor="#d6814f" />
            <stop offset="100%" stopColor="#8c4526" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display leading-none text-paper" style={{ fontSize: size * 0.3 }}>
          <CountUp to={value} duration={1600} />
        </span>
        <span className="mt-1 font-mono text-[9px] uppercase tracking-[0.3em] text-paper-dim">
          score
        </span>
      </div>
    </div>
  );
}

/* ---------------- Marquee ---------------- */

export function Marquee({ items }: { items: string[] }) {
  const row = (key: string, hidden = false) => (
    <div key={key} aria-hidden={hidden} className="flex shrink-0 items-center">
      {items.map((it, i) => (
        <span key={i} className="flex items-center">
          <span className="whitespace-nowrap px-7 font-mono text-[11px] uppercase tracking-[0.28em] text-paper-dim">
            {it}
          </span>
          <svg width="7" height="7" viewBox="0 0 8 8" className="text-copper-500/70" aria-hidden="true">
            <path d="M4 0 8 4 4 8 0 4Z" fill="currentColor" />
          </svg>
        </span>
      ))}
    </div>
  );

  return (
    <div className="marquee-mask overflow-hidden">
      <div className="marquee-track flex w-max animate-marquee">
        {row("a")}
        {row("b", true)}
      </div>
    </div>
  );
}
