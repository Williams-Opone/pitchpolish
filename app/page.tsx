"use client";

import Link from "next/link";
import { ArrowRight, Zap, FileText, ShieldCheck, Menu, X, Sparkles } from "lucide-react";
import { useState } from "react";
import { UserButton } from "@clerk/nextjs";
import Background3D from "@/components/Background3D";
import TiltCard from "@/components/TiltCard";

export default function Home() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <Background3D />
      <main className="relative z-10 min-h-screen bg-[#080c16] text-[#e8e8f0] font-[family-name:var(--font-sans)] overflow-x-hidden selection:bg-amber-500/20">
        {/* Noise texture */}
        <div className="fixed inset-0 pointer-events-none z-[9999] opacity-[0.035]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")", backgroundSize: "200px" }} aria-hidden="true" />

        {/* Nav */}
        <nav className="sticky top-0 z-50 backdrop-blur-xl bg-[#080c16]/70 border-b border-white/[0.06]">
          <div className="max-w-7xl mx-auto px-6 md:px-10 py-5 flex items-center justify-between">
            <Link href="/" className="font-[family-name:var(--font-serif)] text-2xl md:text-3xl text-white tracking-tight z-10">
              Pitch<span className="text-amber-400">Polish</span>.
            </Link>
            <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
              <Link href="/upload" className="hover:text-amber-300 transition">Upload</Link>
              <Link href="/dashboard" className="hover:text-amber-300 transition">Dashboard</Link>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/sign-in" className="hidden md:inline-block bg-white text-[#080c16] px-5 py-2.5 rounded-full font-semibold text-sm hover:bg-amber-50 transition shadow-lg shadow-white/10">
                Get Started
              </Link>
              <div className="flex items-center">
                <UserButton  appearance={{ elements: { avatarBox: "w-9 h-9", userButtonTrigger: "focus:outline-none" } }} />
              </div>
              <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden text-white p-2" aria-label="Menu">
                {mobileOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
          {mobileOpen && (
            <div className="md:hidden bg-[#080c16]/98 border-b border-white/10 px-6 py-8 flex flex-col gap-6 text-xl font-[family-name:var(--font-serif)] z-40 backdrop-blur-2xl">
              <Link href="/upload" onClick={() => setMobileOpen(false)} className="text-white hover:text-amber-400">Upload</Link>
              <Link href="/dashboard" onClick={() => setMobileOpen(false)} className="text-white hover:text-amber-400">Dashboard</Link>
              <Link href="/sign-in" onClick={() => setMobileOpen(false)} className="bg-amber-400 text-[#080c16] px-6 py-3 rounded-full font-bold text-center">Sign In</Link>
            </div>
          )}
        </nav>

        {/* Hero — Asymmetric with Tilt Card */}
        <section className="relative z-10 max-w-7xl mx-auto px-6 md:px-10 pt-16 md:pt-28 pb-16 md:pb-24">
          <div className="grid lg:grid-cols-2 gap-14 lg:gap-24 items-start">
            <div className="order-2 lg:order-1 animate-fade-up">
              <div className="inline-flex items-center gap-2 bg-white/[0.06] border border-white/[0.08] rounded-full px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-amber-300 mb-8">
                <Zap size={12} strokeWidth={2.5} /> AI VC Consulting — For Founders
              </div>
              <h1 className="font-[family-name:var(--font-serif)] text-6xl md:text-7xl lg:text-[6.5rem] leading-[0.85] tracking-tighter text-white mb-8">
                Not a pitch.<br />
                <span className="italic text-amber-300 animate-shimmer">A score.</span>
              </h1>
              <p className="text-xl md:text-2xl text-slate-400 leading-relaxed max-w-xl mb-10 font-light">
                Upload your deck. The AI reads every slide, scores it against investor benchmarks, and tells you exactly what to fix — with numbers from your deck.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/upload" className="group inline-flex items-center gap-3 bg-amber-400 text-[#080c16] px-8 py-4 rounded-full font-bold text-lg hover:bg-amber-300 transition shadow-[0_0_60px_-12px_rgba(240,199,94,0.35)] hover:-translate-y-1 duration-300">
                  Analyze Your Deck <ArrowRight size={20} className="group-hover:translate-x-1 transition" />
                </Link>
                <Link href="/dashboard" className="inline-flex items-center gap-3 bg-white/[0.05] border border-white/10 text-white px-8 py-4 rounded-full font-medium text-lg hover:bg-white/[0.1] hover:-translate-y-1 transition backdrop-blur-sm">
                  View Reports
                </Link>
              </div>
            </div>

            <div className="order-1 lg:order-2 animate-fade-up" style={{ animationDelay: "0.2s" }}>
              <TiltCard>
                <div className="bg-gradient-to-br from-[#111b2e] to-[#0d1320] border border-white/[0.1] rounded-[2.5rem] p-8 md:p-10 shadow-2xl relative overflow-hidden">
                  <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-8">
                      <div>
                        <h3 className="font-[family-name:var(--font-serif)] text-3xl md:text-4xl text-white mb-1 tracking-tight">Report Card</h3>
                        <p className="text-xs text-slate-500 uppercase tracking-[0.2em]">AI Score / Section Breakdown</p>
                      </div>
                      <div className="text-right">
                        <div className="text-6xl md:text-7xl font-[family-name:var(--font-serif)] text-amber-400 leading-none tracking-tighter">72</div>
                        <div className="text-xs font-medium text-slate-500">/ 100</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-center mb-8">
                      <div className="relative w-36 h-36 md:w-44 md:h-44">
                        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                          <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="6" />
                          <circle cx="50" cy="50" r="42" fill="none" stroke="#F0C75E" strokeWidth="6" strokeLinecap="round" strokeDasharray={264} strokeDashoffset={264 - (264 * 72 / 100)} />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className="text-5xl md:text-6xl font-[family-name:var(--font-serif)] text-white">72</span>
                          <span className="text-[10px] text-slate-400 uppercase tracking-[0.2em]">Score</span>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {[
                        { label: "Problem", score: 9, status: "strong" },
                        { label: "Market Size", score: 2, status: "critical" },
                        { label: "Competition", score: 2, status: "critical" },
                        { label: "Solution", score: 7, status: "good" },
                        { label: "Team", score: 8, status: "strong" },
                        { label: "Financials", score: 4, status: "weak" },
                      ].map((s) => (
                        <div key={s.label} className="bg-[#0a0f1a] border border-white/[0.06] rounded-xl p-3 hover:border-amber-400/20 transition">
                          <div className="flex justify-between items-center mb-1.5">
                            <span className="text-xs font-medium text-slate-300">{s.label}</span>
                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${s.status === "strong" ? "text-emerald-300 bg-emerald-500/10" : s.status === "critical" ? "text-rose-300 bg-rose-500/10" : "text-amber-300 bg-amber-400/10"}`}>{s.score}/10</span>
                          </div>
                          <p className="text-[10px] text-slate-500 leading-snug">{s.status === "critical" ? "MISSING DATA" : s.status === "strong" ? "Strong" : "Needs depth"}</p>
                        </div>
                      ))}
                    </div>
                    <div className="mt-6 pt-6 border-t border-white/[0.08]">
                      <h4 className="text-rose-300 font-medium text-sm mb-3 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-rose-400 rounded-full animate-pulse" /> Critical Red Flags
                      </h4>
                      <ul className="text-xs text-rose-200/80 space-y-1.5">
                        <li>• Market size has no TAM/SAM/SOM — investors reject</li>
                        <li>• Competition slide missing key players</li>
                        <li>• No traction metrics shown</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </TiltCard>
            </div>
          </div>
        </section>

        {/* Features — Luxury Glass */}
        <section className="relative z-10 max-w-7xl mx-auto px-6 md:px-10 pb-24">
          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {[
              { title: "Extract", desc: "Your PDF becomes structured slide text. Every page preserved. No manual copying.", tag: "Server-side parsing" },
              { title: "Analyze", desc: "AI scores 0–100 with section-level critique. Red flags highlighted in crimson.", tag: "Brutal specificity" },
              { title: "Coach", desc: "Ask anything. The AI pulls from your deck text — not generic ChatGPT templates.", tag: "Context-aware" },
            ].map((f) => (
              <div key={f.title} className="group relative bg-gradient-to-b from-[#0f1120] to-[#080c16] border border-white/[0.08] hover:border-amber-400/40 rounded-[2rem] p-10 md:p-12 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_30px_60px_-15px_rgba(240,199,94,0.12)] overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/10 rounded-full blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" style={{ transform: "translate(30%, -30%)" }} />
                <div className="w-14 h-14 bg-gradient-to-br from-amber-400/15 to-amber-400/5 rounded-2xl flex items-center justify-center text-amber-300 mb-8 group-hover:scale-110 transition-transform duration-300 shadow-[inset_0_0_20px_rgba(240,199,94,0.15)]">
                  <FileText size={28} strokeWidth={1.2} />
                </div>
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-300/80">{f.tag}</span>
                  <span className="w-8 h-px bg-white/20" />
                </div>
                <h3 className="font-[family-name:var(--font-serif)] text-3xl md:text-4xl text-white mb-4 tracking-tight">{f.title}</h3>
                <p className="text-slate-400 leading-relaxed text-[15px]">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Timeline */}
        <section className="relative z-10 max-w-6xl mx-auto px-6 md:px-10 pb-32">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-start">
            <div className="lg:col-span-4">
              <h2 className="font-[family-name:var(--font-serif)] text-6xl md:text-8xl text-white leading-[0.85] tracking-tighter mb-6">
                How it<br/>works.
              </h2>
              <p className="text-slate-400 text-xl font-light leading-relaxed">No forms. No consultants. Just upload, score, fix.</p>
            </div>
            <div className="lg:col-span-7 lg:col-start-6 space-y-0">
              {[
                { n: "01", label: "Upload", desc: "Drag your PDF deck. We extract every slide server-side — no manual copying.", detail: "PDF parsing runs on the server. Your file never touches the browser unencrypted." },
                { n: "02", label: "Score", desc: "AI scores each section 0–100 with brutal specificity — not vague optimism.", detail: "Problem, solution, market size, business model, traction, team, competition, financials, ask." },
                { n: "03", label: "Fix", desc: "Chat with AI that remembers your actual deck text, not generic advice.", detail: "Ask 'How do I fix market size?' — it answers with your missing TAM numbers." },
              ].map((step, i) => (
                <div key={step.n} className="group relative pl-12 md:pl-16 pb-16 last:pb-0">
                  {i !== 2 && <div className="absolute left-[23px] md:left-[31px] top-10 bottom-0 w-px bg-gradient-to-b from-amber-400/40 to-transparent" />}
                  <div className="absolute left-0 top-0 w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br from-amber-400/20 to-amber-400/5 border border-amber-400/20 flex items-center justify-center">
                    <span className="font-[family-name:var(--font-serif)] text-2xl md:text-3xl text-amber-300">{step.n}</span>
                  </div>
                  <div>
                    <h3 className="font-[family-name:var(--font-serif)] text-3xl md:text-4xl text-white mb-3 group-hover:text-amber-300 transition-colors">{step.label}</h3>
                    <p className="text-slate-300 text-lg leading-relaxed mb-2">{step.desc}</p>
                    <p className="text-sm text-slate-500 leading-relaxed">{step.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Banner */}
        <section className="relative z-10 max-w-5xl mx-auto px-6 md:px-10 pb-28">
          <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-amber-400/95 via-amber-300/85 to-amber-500/95 p-12 md:p-16 text-center shadow-[0_0_80px_-20px_rgba(240,199,94,0.25)]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.2),_transparent_70%)]" />
            <h2 className="relative font-[family-name:var(--font-serif)] text-5xl md:text-7xl text-[#080c16] tracking-tighter mb-4">$19/month.</h2>
            <p className="relative text-[#080c16]/80 text-xl font-medium mb-6 max-w-xl mx-auto">Unlimited analyses. Full AI chat. Executive summaries. Cancel anytime.</p>
            <div className="relative flex flex-wrap justify-center gap-3 mb-10">
              {["1 Free Analysis", "Unlimited Decks", "AI Context Chat", "PDF Summaries"].map((t) => (
                <span key={t} className="bg-[#080c16]/10 px-4 py-2 rounded-full text-sm font-bold text-[#080c16]">{t}</span>
              ))}
            </div>
            <Link href="/upload" className="relative inline-flex items-center gap-3 bg-[#080c16] text-amber-300 px-10 py-4 rounded-full font-bold text-xl hover:bg-[#0a0f1e] transition shadow-2xl">
              Start Free Analysis <ArrowRight size={22} />
            </Link>
          </div>
        </section>

        <footer className="relative z-10 border-t border-white/[0.06] max-w-7xl mx-auto px-6 md:px-10 py-12 flex flex-col md:flex-row justify-between items-end gap-6">
          <div>
            <Link href="/" className="font-[family-name:var(--font-serif)] text-2xl text-white tracking-tight">PitchPolish.</Link>
            <p className="text-xs text-slate-500 mt-2 tracking-wide">AI Pitch Review for Startup Founders.</p>
          </div>
          <div className="flex gap-8 text-sm text-slate-400 font-medium">
            <Link href="/upload" className="hover:text-white transition">Upload</Link>
            <Link href="/dashboard" className="hover:text-white transition">Dashboard</Link>
            <a href="#" className="hover:text-white transition">Terms</a>
          </div>
        </footer>
      </main>
    </>
  );
}