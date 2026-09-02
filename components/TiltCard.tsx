"use client";
import { useState } from "react";

export default function TiltCard({ children }: { children: React.ReactNode }) {
  const [style, setStyle] = useState({ transform: "perspective(1000px) rotateX(0deg) rotateY(0deg)" });
  const [hover, setHover] = useState(false);

  return (
    <div
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const cx = rect.width / 2;
        const cy = rect.height / 2;
        const rx = ((y - cy) / cy) * -4;
        const ry = ((x - cx) / cx) * 4;
        setStyle({ transform: `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg) scale(1.02)` });
      }}
      onMouseLeave={() => {
        setStyle({ transform: "perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)" });
        setHover(false);
      }}
      onMouseEnter={() => setHover(true)}
      className="transition-transform duration-300 ease-out"
      style={{ transformStyle: "preserve-3d" }}
    >
      <div style={style} className="transition-transform duration-200 ease-out">
        {children}
      </div>
    </div>
  );
}