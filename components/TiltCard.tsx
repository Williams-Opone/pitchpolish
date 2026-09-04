"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Pointer-tracked 3D tilt with a travelling specular glare.
 * Disabled for touch pointers and prefers-reduced-motion users.
 */
export default function TiltCard({ children, className = "" }: { children: ReactNode; className?: string }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const glareRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = wrapRef.current;
    const glare = glareRef.current;
    if (!el || !glare) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    if (reduced || coarse) return;

    let raf = 0;
    const cur = { rx: 0, ry: 0, gx: 50, gy: 50, o: 0 };
    const tgt = { rx: 0, ry: 0, gx: 50, gy: 50, o: 0 };

    const apply = () => {
      cur.rx += (tgt.rx - cur.rx) * 0.12;
      cur.ry += (tgt.ry - cur.ry) * 0.12;
      cur.gx += (tgt.gx - cur.gx) * 0.16;
      cur.gy += (tgt.gy - cur.gy) * 0.16;
      cur.o += (tgt.o - cur.o) * 0.1;
      el.style.transform = `perspective(1100px) rotateX(${cur.rx.toFixed(2)}deg) rotateY(${cur.ry.toFixed(2)}deg)`;
      glare.style.background = `radial-gradient(circle at ${cur.gx}% ${cur.gy}%, rgba(244,205,171,0.16), rgba(244,205,171,0.045) 34%, transparent 62%)`;
      glare.style.opacity = cur.o.toFixed(2);
      raf = requestAnimationFrame(apply);
    };

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      tgt.ry = (px - 0.5) * 9;
      tgt.rx = (0.5 - py) * 8;
      tgt.gx = px * 100;
      tgt.gy = py * 100;
      tgt.o = 1;
    };
    const onLeave = () => {
      tgt.rx = 0;
      tgt.ry = 0;
      tgt.o = 0;
    };

    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    raf = requestAnimationFrame(apply);

    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      el.style.transform = "";
    };
  }, []);

  return (
    <div ref={wrapRef} className={`relative transition-transform duration-300 will-change-transform ${className}`}>
      {children}
      <div
        ref={glareRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300"
      />
    </div>
  );
}
