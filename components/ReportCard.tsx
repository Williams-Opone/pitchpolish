"use client";
export default function ReportCard({ result }: { result: any }) {
  const score = result?.overall_score ?? 0;
  return (
    <div className="bg-gradient-to-br from-white/[0.06] to-transparent border border-white/10 rounded-3xl p-8 md:p-10">
      <div className="flex items-center gap-8 mb-8">
        <div className="w-36 h-36 relative flex items-center justify-center">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="8" />
            <circle cx="50" cy="50" r="42" fill="none" stroke="#F0C75E" strokeWidth="8" strokeLinecap="round"
              strokeDasharray={264} strokeDashoffset={264 - (264 * Math.min(score, 100) / 100)} />
          </svg>
          <div className="absolute text-center">
            <span className="block text-6xl font-serif text-white leading-none">{score}</span>
            <span className="text-xs text-slate-400 uppercase tracking-widest">Score</span>
          </div>
        </div>
        <div>
          <h2 className="font-serif text-3xl text-white mb-2">Report Card</h2>
          <p className="text-slate-300 text-sm max-w-md">{result?.summary || "AI analysis complete."}</p>
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-3">
        {Object.entries(result?.sections || {}).map(([key, val]: [string, any]) => (
          <div key={key} className="bg-white/[0.03] border border-white/10 rounded-xl p-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-medium text-white capitalize text-sm">{key.replace(/_/g, " ")}</h3>
              <span className={`text-xs font-bold px-2 py-0.5 rounded ${val.score >= 7 ? "bg-emerald-500/20 text-emerald-300" : val.score >= 4 ? "bg-amber-400/20 text-amber-300" : "bg-rose-500/20 text-rose-300"}`}>{val.score}/10</span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">{val.critique}</p>
          </div>
        ))}
      </div>
      {result?.red_flags?.length > 0 && (
        <div className="mt-6 bg-rose-900/20 border border-rose-500/30 rounded-2xl p-6">
          <h3 className="font-serif text-xl text-rose-300 mb-3">Critical Red Flags</h3>
          <ul className="text-sm text-rose-200 space-y-1">{result.red_flags.map((f: string, i: number) => <li key={i}>✕ {f}</li>)}</ul>
        </div>
      )}
    </div>
  );
}