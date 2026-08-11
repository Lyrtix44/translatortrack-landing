// components/landing/InvoicePreviewCard.tsx
export function InvoicePreviewCard() {
  return (
    <div className="w-[360px] h-[192px] bg-white rounded-xl border border-slate-200 shadow-[0_8px_25px_rgba(0,0,0,0.06)] ring-1 ring-white/50 overflow-hidden flex flex-col font-sans relative">

      {/* 1. Header: The "Magic" Status */}
      <div className="px-4 py-2.5 border-b border-border/40 flex items-center justify-between shrink-0 bg-paper/30">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold text-slate-mid/60 tracking-wider">02</span>
          <h4 className="text-[13px] font-semibold text-ink tracking-tight">Invoice Preview</h4>
        </div>
        <div className="flex items-center gap-1.5 bg-amber-light/60 px-2 py-0.5 rounded-full border border-amber/20">
          <svg className="w-3 h-3 text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <span className="text-[10px] text-amber-700 font-medium">Auto-calculated</span>
        </div>
      </div>

      {/* 2. The Line Items */}
      <div className="flex-1 px-4 py-2 flex flex-col justify-center space-y-1.5">
        <div className="flex justify-between text-[11px] text-slate-mid">
          <span>Base (4,500 words × $0.14)</span>
          <span className="font-medium text-ink">$630.00</span>
        </div>
        <div className="flex justify-between text-[11px] text-slate-mid bg-warning-light/50 px-2 py-0.5 rounded -mx-2 border-l-2 border-warning">
          <span className="flex items-center gap-1.5">
            <svg className="w-3 h-3 text-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Rush fee (multi-doc project)
          </span>
          <span className="font-medium text-warning">+ $100.00</span>
        </div>
        <div className="flex items-center gap-1 text-[9px] text-slate-mid/60 pt-0.5">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber animate-pulse"></span>
          Flat-rate minimum applied
        </div>
        <div className="h-px bg-border/70 my-1"></div>
      </div>

      {/* 3. The Total Block */}
      <div className="bg-paper-dark border-t border-border/60 px-4 py-2.5 flex items-center justify-between shrink-0">
        <div className="flex flex-col">
          <span className="text-[10px] font-semibold text-slate-mid uppercase tracking-wider">Invoice Total</span>
          <span className="text-[9px] text-slate-mid/70">No copy-paste errors</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-3xl font-display text-ink tracking-tight">$730.00</span>
          <div className="w-6 h-6 rounded-full bg-amber flex items-center justify-center text-ink shadow-sm">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
      </div>

    </div>
  )
}