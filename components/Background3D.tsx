"use client";

import { useEffect, useRef } from "react";

interface Mote {
  x: number;
  y: number;
  z: number; // 0..1 depth
  r: number;
  vx: number;
  vy: number;
  tw: number; // twinkle phase
}

/**
 * Ambient canvas field for the Obsidian & Copper theme:
 * warm drifting embers in three depth layers, volumetric copper glow,
 * and gentle pointer parallax. Static single frame under reduced motion.
 */
export default function Background3D() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0;
    let h = 0;
    let raf = 0;
    let running = true;
    const mouse = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5 };
    const motes: Mote[] = [];

    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const seed = () => {
      motes.length = 0;
      const count = Math.min(150, Math.floor((w * h) / 11000));
      for (let i = 0; i < count; i++) {
        const z = Math.random();
        motes.push({
          x: Math.random() * w,
          y: Math.random() * h,
          z,
          r: 0.6 + z * 1.7,
          vx: (Math.random() - 0.5) * 0.05,
          vy: -(0.02 + Math.random() * 0.06) * (0.4 + z),
          tw: Math.random() * Math.PI * 2,
        });
      }
    };

    const paintGlows = () => {
      const px = (mouse.x - 0.5) * 30;
      const py = (mouse.y - 0.5) * 30;

      let g = ctx.createRadialGradient(
        w * 0.8 + px, h * 0.14 + py, 0,
        w * 0.8 + px, h * 0.14 + py, Math.max(w, h) * 0.55
      );
      g.addColorStop(0, "rgba(214,129,79,0.12)");
      g.addColorStop(0.5, "rgba(214,129,79,0.04)");
      g.addColorStop(1, "rgba(214,129,79,0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);

      g = ctx.createRadialGradient(
        w * 0.12 - px, h * 0.85 - py, 0,
        w * 0.12 - px, h * 0.85 - py, Math.max(w, h) * 0.6
      );
      g.addColorStop(0, "rgba(43,29,16,0.6)");
      g.addColorStop(1, "rgba(43,29,16,0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);
    };

    const paint = (t: number) => {
      ctx.clearRect(0, 0, w, h);
      paintGlows();

      const ox = (mouse.x - 0.5) * 22;
      const oy = (mouse.y - 0.5) * 22;

      for (const m of motes) {
        if (!reduced) {
          m.x += m.vx + Math.sin(t * 0.00022 + m.tw) * 0.06;
          m.y += m.vy;
          if (m.y < -6) { m.y = h + 6; m.x = Math.random() * w; }
          if (m.x < -6) m.x = w + 6;
          if (m.x > w + 6) m.x = -6;
        }
        const twinkle = reduced ? 0.65 : 0.4 + 0.6 * (0.5 + 0.5 * Math.sin(t * 0.0012 + m.tw));
        const alpha = (0.1 + m.z * 0.38) * twinkle;
        const px = m.x + ox * m.z;
        const py = m.y + oy * m.z;
        ctx.beginPath();
        ctx.arc(px, py, m.r, 0, Math.PI * 2);
        ctx.fillStyle =
          m.z > 0.72
            ? `rgba(232,168,124,${alpha})`
            : `rgba(236,228,214,${alpha * 0.72})`;
        ctx.fill();
      }
    };

    const loop = (t: number) => {
      if (!running) return;
      mouse.x += (mouse.tx - mouse.x) * 0.04;
      mouse.y += (mouse.ty - mouse.y) * 0.04;
      paint(t);
      if (!reduced) raf = requestAnimationFrame(loop);
    };

    const onMove = (e: PointerEvent) => {
      mouse.tx = e.clientX / Math.max(1, w);
      mouse.ty = e.clientY / Math.max(1, h);
    };

    resize();
    seed();

    if (reduced) {
      paint(0);
    } else {
      raf = requestAnimationFrame(loop);
      window.addEventListener("pointermove", onMove, { passive: true });
    }

    const onResize = () => {
      resize();
      seed();
      if (reduced) paint(0);
    };
    const onVisibility = () => {
      running = document.visibilityState === "visible";
      if (running && !reduced) raf = requestAnimationFrame(loop);
    };
    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <div aria-hidden="true" className="fixed inset-0 z-0 pointer-events-none">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_120%_80%_at_50%_-10%,#1f1810_0%,#0c0a08_55%,#070504_100%)]" />
      <canvas ref={canvasRef} className="absolute inset-0" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_0%,rgba(7,5,4,0.4)_100%)]" />
    </div>
  );
}
