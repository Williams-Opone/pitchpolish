// components/UpgradeButton.tsx
"use client";
export default function UpgradeButton() {
  return (
    <button onClick={async () => {
      const r = await fetch("/api/checkout", { method: "POST" });
      const d = await r.json();
      if (d.url) window.location.href = d.url;
    }} className="bg-[#0B1120] border border-amber-400/40 text-amber-400 font-bold px-5 py-3 rounded-full hover:bg-amber-400/10 transition text-sm">
      Upgrade $19/mo
    </button>
  );
}