// components/landing/SendInvoiceCard.tsx
export function SendInvoiceCard() {
  return (
    <div className="w-[360px] h-[192px] bg-white rounded-xl border border-slate-200 shadow-[0_8px_25px_rgba(0,0,0,0.06)] ring-1 ring-white/50 overflow-hidden flex flex-col font-sans relative">

      {/* 1. Header: Action Context */}
      <div className="px-4 py-2.5 border-b border-border/40 flex items-center justify-between shrink-0 bg-paper/30">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold text-slate-mid/60 tracking-wider">03</span>
          <h4 className="text-[13px] font-semibold text-ink tracking-tight">Send Invoice</h4>
        </div>
        <div className="flex items-center gap-1 bg-amber-light/60 px-2 py-0.5 rounded-full border border-amber/20">
          <span className="text-[10px] text-amber-700 font-medium">PDF ready</span>
        </div>
      </div>

      {/* 2. The "One Click" Action Zone */}
      <div className="flex-1 px-4 py-2 flex items-center gap-4">
        <div className="w-12 h-14 shrink-0 bg-paper-dark rounded-lg border border-border/60 flex flex-col items-center justify-center relative shadow-sm">
          <svg className="w-5 h-5 text-slate-mid/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span className="text-[8px] font-medium text-slate-mid absolute -bottom-1.5 bg-white px-1.5 rounded-full border border-border shadow-sm">PDF</span>
        </div>

        <div className="flex-1 flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <button className="flex-1 bg-amber hover:bg-amber-hover text-ink font-medium px-4 py-1.5 rounded-md text-[11px] shadow-sm flex items-center justify-center gap-1.5 transition-all">
              Send Invoice
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
            <div className="w-5 h-5 rounded-full bg-success flex items-center justify-center shrink-0">
              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          <span className="text-[9px] text-slate-mid/70 ml-1 flex items-center gap-1">
            <span>Sent to</span>
            <span className="text-ink font-medium">client@acme.com</span>
          </span>
        </div>
      </div>

      {/* 3. Payment Tracking Timeline */}
      <div className="px-4 pb-2.5 pt-1.5 border-t border-border/40 mt-auto bg-paper/20">
        <div className="relative flex items-center justify-between px-1">
          <div className="absolute top-1.5 left-0 right-0 h-[1px] bg-border"></div>
          <div className="absolute top-1.5 left-0 w-[48%] h-[1px] bg-success"></div>

          <div className="flex flex-col items-center z-10 bg-transparent">
            <div className="w-3 h-3 rounded-full border-2 border-slate-mid bg-white"></div>
            <span className="text-[8px] text-slate-mid mt-0.5">Draft</span>
          </div>

          <div className="flex flex-col items-center z-10 bg-transparent">
            <div className="w-3 h-3 rounded-full bg-success border-2 border-success ring-2 ring-success/20"></div>
            <span className="text-[8px] font-medium text-success mt-0.5">Sent</span>
          </div>

          <div className="flex flex-col items-center z-10 bg-transparent relative">
            <div className="w-3 h-3 rounded-full border-2 border-slate-mid bg-white"></div>
            <span className="text-[8px] text-slate-mid mt-0.5">Received</span>
            <div className="absolute -top-1 -right-2 flex items-center gap-0.5 text-warning text-[8px] font-semibold bg-warning-light px-1.5 py-0.5 rounded-full border border-warning/30 shadow-sm animate-pulse">
              <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              Overdue
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}