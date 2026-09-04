"use client";

/**
 * Premium component kit — hand-ported in the spirit of the free component
 * collections at motion.dev, Aceternity UI, KokonutUI and Bklit UI.
 * Built on `motion/react`, Tailwind 4, zero runtime dependencies.
 */

import {
  MotionConfig,
  motion,
  useInView,
  useMotionValue,
  useSpring,
} from "motion/react";
import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";

export function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}

function useReducedMotionLocal(): boolean {
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

/* ------------------------------------------------------------------ */
/* Aceternity-style Spotlight Card — mouse-tracked fill + border glow  */
/* ------------------------------------------------------------------ */

export function SpotlightCard({
  children,
  className = "",
  radius = "1.8rem",
}: {
  children: ReactNode;
  className?: string;
  radius?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--sx", `${e.clientX - r.left}px`);
    el.style.setProperty("--sy", `${e.clientY - r.top}px`);
    el.style.setProperty("--so", "1");
  };
  const onLeave = () => ref.current?.style.setProperty("--so", "0");

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={`relative overflow-hidden ${className}`}
      style={{ borderRadius: radius }}
    >
      {/* interior spotlight */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 opacity-0 transition-opacity duration-500"
        style={{
          opacity: "var(--so, 0)" as unknown as number,
          background:
            "radial-gradient(560px circle at var(--sx, 50%) var(--sy, 50%), rgba(232,168,124,0.11), transparent 65%)",
        }}
      />
      {/* border glow ring */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 opacity-0 transition-opacity duration-500"
        style={{
          opacity: "var(--so, 0)" as unknown as number,
          borderRadius: radius,
          padding: 1,
          background:
            "radial-gradient(360px circle at var(--sx, 50%) var(--sy, 50%), rgba(232,168,124,0.6), transparent 70%)",
          WebkitMask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
          WebkitMaskComposite: "xor",
          mask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
          maskComposite: "exclude",
        }}
      />
      <div className="relative z-10 h-full">{children}</div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Aceternity-style Text Generate Effect — blur-in word stagger        */
/* ------------------------------------------------------------------ */

export function TextGenerateEffect({
  text,
  className = "",
  delay = 0,
  stagger = 0.028,
}: {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
}) {
  const ref = useRef<HTMLParagraphElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const words = text.split(" ");

  return (
    <p ref={ref} className={className}>
      {words.map((w, i) => (
        <motion.span
          key={i}
          className="inline-block will-change-transform"
          initial={{ opacity: 0, filter: "blur(8px)", y: 8 }}
          animate={inView ? { opacity: 1, filter: "blur(0px)", y: 0 } : undefined}
          transition={{
            duration: 0.55,
            ease: [0.22, 1, 0.36, 1],
            delay: delay + i * stagger,
          }}
        >
          {w}
          {i < words.length - 1 ? "\u00A0" : ""}
        </motion.span>
      ))}
    </p>
  );
}

/* ------------------------------------------------------------------ */
/* KokonutUI-style Shine Border — rotating conic-gradient ring         */
/* ------------------------------------------------------------------ */

export function ShineBorder({
  children,
  className = "",
  radius = "1.8rem",
  duration = 5,
  borderWidth = 1.5,
}: {
  children: ReactNode;
  className?: string;
  radius?: string;
  duration?: number;
  borderWidth?: number;
}) {
  return (
    <div className={`relative ${className}`}>
      <div
        aria-hidden="true"
        className="shine-ring absolute inset-0"
        style={
          {
            borderRadius: radius,
            padding: borderWidth,
            "--shine-duration": `${duration}s`,
          } as CSSProperties
        }
      />
      <div className="relative" style={{ borderRadius: radius }}>
        {children}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Magnetic wrapper — spring physics toward the pointer                */
/* ------------------------------------------------------------------ */

export function Magnetic({
  children,
  className = "",
  strength = 0.3,
}: {
  children: ReactNode;
  className?: string;
  strength?: number;
}) {
  const reduced = useReducedMotionLocal();
  const [coarse, setCoarse] = useState(false);
  useEffect(() => {
    setCoarse(window.matchMedia("(pointer: coarse)").matches);
  }, []);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 170, damping: 14, mass: 0.2 });
  const sy = useSpring(y, { stiffness: 170, damping: 14, mass: 0.2 });

  if (reduced || coarse) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={`inline-block ${className}`}
      style={{ x: sx, y: sy }}
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        x.set((e.clientX - (r.left + r.width / 2)) * strength);
        y.set((e.clientY - (r.top + r.height / 2)) * strength);
      }}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* Lamp divider — Aceternity-inspired beam that blooms into view       */
/* ------------------------------------------------------------------ */

export function LampDivider({ className = "" }: { className?: string }) {
  return (
    <div className={`relative flex items-center justify-center ${className}`} aria-hidden="true">
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
        className="h-px w-full origin-center bg-gradient-to-r from-transparent via-copper-400/50 to-transparent"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.3 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.9, delay: 0.3 }}
        className="absolute h-28 w-56 rounded-full bg-copper-400/15 blur-3xl"
      />
      <motion.div
        initial={{ opacity: 0, scaleX: 0.2 }}
        whileInView={{ opacity: 1, scaleX: 1 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="absolute h-[3px] w-24 rounded-full bg-copper-300/80 blur-[2px]"
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Bklit-style Radar chart — animated SVG polygon on a 0–10 scale      */
/* ------------------------------------------------------------------ */

export interface RadarDatum {
  label: string;
  value: number; // 0–10
}

function radarPoints(data: RadarDatum[], radius: number): string {
  const n = data.length;
  return data
    .map((d, i) => {
      const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
      const r = (Math.max(0, Math.min(10, d.value)) / 10) * radius;
      const x = 50 + r * Math.cos(angle);
      const y = 50 + r * Math.sin(angle);
      return `${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(" ");
}

function ringPoints(n: number, radius: number): string {
  return Array.from({ length: n }, (_, i) => {
    const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
    return `${(50 + radius * Math.cos(angle)).toFixed(2)},${(50 + radius * Math.sin(angle)).toFixed(2)}`;
  }).join(" ");
}

export function RadarChart({
  data,
  size = 320,
  className = "",
}: {
  data: RadarDatum[];
  size?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const n = data.length;
  const R = 36;

  return (
    <div ref={ref} className={className} style={{ width: size, height: size }}>
      <svg viewBox="0 0 100 100" className="h-full w-full" role="img" aria-label="Radar chart of section scores">
        {/* grid rings */}
        {[0.25, 0.5, 0.75, 1].map((t, i) => (
          <motion.polygon
            key={t}
            points={ringPoints(n, R * t)}
            fill="none"
            stroke="rgba(242,237,227,0.09)"
            strokeWidth="0.35"
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : undefined}
            transition={{ delay: 0.1 + i * 0.08, duration: 0.5 }}
          />
        ))}
        {/* axes */}
        {data.map((_, i) => {
          const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
          return (
            <motion.line
              key={i}
              x1="50"
              y1="50"
              x2={(50 + R * Math.cos(angle)).toFixed(2)}
              y2={(50 + R * Math.sin(angle)).toFixed(2)}
              stroke="rgba(242,237,227,0.07)"
              strokeWidth="0.35"
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : undefined}
              transition={{ delay: 0.2, duration: 0.5 }}
            />
          );
        })}
        {/* value polygon */}
        <motion.g
          style={{ transformOrigin: "50px 50px" }}
          initial={{ scale: 0.12, opacity: 0 }}
          animate={inView ? { scale: 1, opacity: 1 } : undefined}
          transition={{ type: "spring", stiffness: 70, damping: 16, delay: 0.3 }}
        >
          <polygon
            points={radarPoints(data, R)}
            fill="rgba(214,129,79,0.16)"
            stroke="#d6814f"
            strokeWidth="0.7"
            strokeLinejoin="round"
          />
          {data.map((d, i) => {
            const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
            const r = (Math.max(0, Math.min(10, d.value)) / 10) * R;
            return (
              <circle
                key={d.label}
                cx={(50 + r * Math.cos(angle)).toFixed(2)}
                cy={(50 + r * Math.sin(angle)).toFixed(2)}
                r="1.1"
                fill="#f4cdab"
              />
            );
          })}
        </motion.g>
        {/* axis labels */}
        {data.map((d, i) => {
          const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
          const lx = 50 + (R + 6.5) * Math.cos(angle);
          const ly = 50 + (R + 6.5) * Math.sin(angle);
          return (
            <motion.text
              key={d.label}
              x={lx.toFixed(2)}
              y={ly.toFixed(2)}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="rgba(166,157,140,0.95)"
              style={{ fontSize: "3.1px", letterSpacing: "0.08em", textTransform: "uppercase", fontFamily: "var(--font-mono)" }}
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : undefined}
              transition={{ delay: 0.55 + i * 0.04, duration: 0.4 }}
            >
              {d.label.split(" ")[0]}
            </motion.text>
          );
        })}
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Bklit-style Legend row with progress fill                           */
/* ------------------------------------------------------------------ */

export function LegendBar({
  label,
  value,
  delay = 0,
}: {
  label: string;
  value: number; // 0–10
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const pct = Math.max(0, Math.min(10, value)) * 10;
  const tone = value >= 8 ? "bg-moss-400" : value <= 3 ? "bg-flame-400" : "bg-copper-400";

  return (
    <div ref={ref}>
      <div className="mb-1.5 flex items-baseline justify-between">
        <span className="text-[12.5px] font-semibold text-paper/85">{label}</span>
        <span className="font-mono text-[10.5px] tabular-nums text-paper-dim">{value}/10</span>
      </div>
      <div className="h-[5px] overflow-hidden rounded-full bg-paper/[0.07]">
        <motion.div
          className={`h-full rounded-full ${tone}`}
          initial={{ width: "0%" }}
          animate={inView ? { width: `${pct}%` } : undefined}
          transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
    </div>
  );
}
