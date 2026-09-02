"use client";
import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { UploadCloud, FileCheck, ArrowRight } from "lucide-react";

export default function UploadPage() {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    if (e.type === "dragleave") setDragActive(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation(); setDragActive(false);
    if (e.dataTransfer.files?.[0]) {
      const f = e.dataTransfer.files[0];
      if (f.type === "application/pdf" || f.name.endsWith(".txt")) { setFile(f); setError(""); }
      else setError("Only .pdf or .txt allowed.");
    }
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const f = e.target.files[0];
      if (f.type === "application/pdf" || f.name.endsWith(".txt")) { setFile(f); setError(""); }
      else setError("Only .pdf or .txt allowed.");
    }
  };

  const upload = async () => {
    if (!file) return;
    setLoading(true); setError("");
    const form = new FormData(); form.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: form });
    const json = await res.json();
    if (json.id) router.push(`/report/${json.id}`);
    else { setError(json.error || "Upload failed"); setLoading(false); }
  };

  return (
    <main className="min-h-screen bg-[#080c16] text-[#e8e8f0] font-[family-name:var(--font-sans)] selection:bg-amber-500/20">
      <div className="max-w-3xl mx-auto px-6 md:px-10 py-16 md:py-28">
        <div className="mb-12">
          <Link href="/dashboard" className="text-amber-300 hover:text-amber-100 text-sm font-medium">← Dashboard</Link>
          <h1 className="font-[family-name:var(--font-serif)] text-5xl md:text-7xl text-white tracking-tighter mt-4 leading-[0.9]">Upload your deck.</h1>
          <p className="text-slate-400 text-lg mt-4 max-w-md">Drag a PDF or click to select. We extract slides, score sections, and build your analysis.</p>
        </div>

        <div onDragEnter={handleDrag} onDragOver={handleDrag} onDragLeave={handleDrag} onDrop={handleDrop} className={`relative rounded-[2.5rem] border-2 border-dashed p-14 md:p-20 text-center transition-all duration-300 ${dragActive ? "border-amber-400 bg-amber-400/[0.05] shadow-[0_0_80px_-20px_rgba(240,199,94,0.3)] scale-[1.01]" : "border-white/15 bg-gradient-to-b from-white/[0.03] to-transparent hover:border-white/30"}`}>
          <input type="file" accept=".pdf,.txt" className="hidden" id="fileInput" onChange={handleFileInput} />
          <label htmlFor="fileInput" className="cursor-pointer block">
            <div className="w-20 h-20 mx-auto bg-amber-400/10 rounded-3xl flex items-center justify-center text-amber-300 mb-6 rotate-3 hover:rotate-6 transition">
              <UploadCloud size={40} strokeWidth={1} />
            </div>
            <h2 className="font-[family-name:var(--font-serif)] text-2xl md:text-3xl text-white mb-2">Drop your deck here</h2>
            <p className="text-slate-400 text-sm">PDF or .txt — max 20MB</p>
          </label>

          {file && (
            <div className="mt-8 inline-flex items-center gap-3 bg-white/[0.05] border border-white/10 rounded-full px-5 py-3">
              <FileCheck size={18} className="text-emerald-300" />
              <span className="text-sm font-medium text-white">{file.name}</span>
              <button onClick={() => setFile(null)} className="text-xs text-rose-300 hover:text-rose-200 ml-1">Remove</button>
            </div>
          )}
        </div>

        {error && <p className="text-rose-300 text-sm mt-4 text-center">{error}</p>}

        <div className="mt-8 flex justify-center">
          <button onClick={upload} disabled={!file || loading} className="inline-flex items-center gap-3 bg-amber-400 text-[#080c16] px-10 py-4 rounded-full font-bold text-lg hover:bg-amber-300 transition disabled:opacity-30 disabled:cursor-not-allowed shadow-[0_0_50px_-12px_rgba(240,199,94,0.3)]">
            {loading ? "Reading PDF..." : "Analyze Deck"}
            <ArrowRight size={20} />
          </button>
        </div>
      </div>
    </main>
  );
}