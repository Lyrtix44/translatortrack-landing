// components/landing/ProjectCreationCard.tsx
export function ProjectCreationCard() {
  return (
    <div className="w-[360px] h-[192px] bg-white rounded-xl border border-border shadow-sm relative overflow-hidden flex flex-col font-sans">

      {/* 1. Header: Speed & Context */}
      <div className="flex items-center justify-between px-4 pt-3 pb-1">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold text-slate-mid/60 tracking-wider">01</span>
          <h4 className="text-[13px] font-semibold text-ink tracking-tight">Create Project</h4>
        </div>
        <div className="flex items-center gap-1.5 bg-success-light px-2 py-0.5 rounded-full border border-success/20">
          <svg className="w-3 h-3 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-[10px] font-semibold text-success">30s</span>
        </div>
      </div>

      {/* 2. The Form Mockup */}
      <div className="flex-1 px-4 py-2 grid grid-cols-[1.2fr_1fr] gap-x-3 gap-y-1.5">
        
        {/* Row 1: Client (Auto-filled) */}
        <div className="col-span-2 flex items-center gap-2 bg-paper-dark/50 rounded px-2.5 py-1.5 border border-border/50">
          <span className="text-[9px] uppercase text-slate-mid tracking-wider font-medium">Client</span>
          <span className="text-[12px] font-medium text-ink truncate flex-1">Acme Translations</span>
          <span className="bg-amber-light/60 px-1.5 py-0.5 rounded text-[9px] text-amber-700 font-medium">Matched</span>
        </div>

        {/* Row 2: Language Pair */}
        <div className="flex items-center gap-1.5 bg-paper-dark/30 rounded px-2.5 py-1.5 border-l-2 border-amber">
          <span className="text-[9px] uppercase text-slate-mid tracking-wider font-medium">Pair</span>
          <span className="text-[12px] font-medium text-ink">EN → ES</span>
        </div>

        {/* Row 2b: Rate */}
        <div className="flex items-center gap-1.5 bg-paper-dark/30 rounded px-2.5 py-1.5 border-l-2 border-success">
          <span className="text-[9px] uppercase text-slate-mid tracking-wider font-medium">Rate</span>
          <span className="text-[12px] font-medium text-ink">$0.14/word</span>
          <svg className="w-3 h-3 text-success ml-auto" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        </div>

        {/* Row 3a: Word Count */}
        <div className="flex items-center gap-1.5 bg-white rounded px-2.5 py-1.5 border border-border/60">
          <span className="text-[9px] uppercase text-slate-mid tracking-wider font-medium">Words</span>
          <span className="text-[12px] font-medium text-ink">4,500</span>
        </div>

        {/* Row 3b: Deadline */}
        <div className="flex items-center gap-1.5 bg-white rounded px-2.5 py-1.5 border border-border/60">
          <span className="text-[9px] uppercase text-slate-mid tracking-wider font-medium">Due</span>
          <span className="text-[12px] font-medium text-ink">Oct 15</span>
        </div>

      </div>

      {/* 3. The Action Bar (Bottom) */}
      <div className="px-4 pb-3 pt-1 border-t border-border/40 mt-auto flex items-center justify-between">
        <div className="flex items-center gap-1 text-[9px] text-slate-mid/60">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber animate-pulse"></span>
          Parsed from email
        </div>
        <button className="flex items-center gap-1.5 bg-amber hover:bg-amber-hover text-ink font-medium px-4 py-1.5 rounded-md text-[11px] shadow-sm transition-all">
          Create Project
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </button>
      </div>

    </div>
  )
}