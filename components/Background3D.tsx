"use client";
import { useEffect, useState } from "react";

export default function Background3D() {
  const [pos, setPos] = useState({ x: 50, y: 50 });

  useEffect(() => {
    const move = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;
      setPos({ x, y });
    };
    window.addEventListener("mousemove", move, { passive: true });
    return () => window.removeEventListener("mousemove", move);
  }, []);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden" style={{ background: "#080c16" }}>
      {/* Deep ambient radial — shifts opposite to mouse for depth */}
      <div
        className="absolute w-[120vw] h-[120vw] -top-[20vw] -left-[20vw] rounded-full blur-[140px] opacity-60 will-change-transform"
        style={{
          background: "radial-gradient(circle, rgba(240,199,94,0.12) 0%, transparent 60%)",
          transform: `translate(${(50 - pos.x) * 0.3}px, ${(50 - pos.y) * 0.3}px)`,
          transition: "transform 0.5s ease-out",
        }}
      />
      {/* Second layer — warm gold, faster follow */}
      <div
        className="absolute w-[80vw] h-[80vw] top-[10vh] right-[-15vw] rounded-full blur-[100px] opacity-40 will-change-transform"
        style={{
          background: "radial-gradient(circle, rgba(240,199,94,0.18) 0%, transparent 60%)",
          transform: `translate(${(pos.x - 50) * 0.2}px, ${(pos.y - 50) * 0.2}px)`,
          transition: "transform 0.3s ease-out",
        }}
      />
      {/* Small bright hotspot near cursor */}
      <div
        className="absolute w-[400px] h-[400px] rounded-full blur-[80px] opacity-30 will-change-transform"
        style={{
          background: "radial-gradient(circle, rgba(255,232,150,0.25) 0%, transparent 60%)",
          left: `${pos.x * 0.7 + 15}%`,
          top: `${pos.y * 0.7 + 10}%`,
          transition: "left 0.15s ease-out, top 0.15s ease-out",
        }}
      />
      {/* Dark vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,transparent_0%,#080c16_90%)]" />
    </div>
  );
}