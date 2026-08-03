"use client"
import { useState, useEffect } from "react"

const LANGUAGE_PAIRS = [
  { label: "EN → FR (French)", rate: 0.12 },
  { label: "EN → DE (German)", rate: 0.14 },
  { label: "EN → ES (Spanish)", rate: 0.10 },
  { label: "EN → JA (Japanese)", rate: 0.18 },
  { label: "EN → ZH (Chinese)", rate: 0.16 },
  { label: "EN → PT (Portuguese)", rate: 0.10 },
  { label: "EN → IT (Italian)", rate: 0.11 },
  { label: "EN → AR (Arabic)", rate: 0.15 },
]

export function InvoiceCalculator() {
  const [wordCount, setWordCount] = useState(2500)
  const [rate, setRate] = useState(0.12)
  const [selectedPair, setSelectedPair] = useState(0)
  const [total, setTotal] = useState(0)
  const [manualMinutes, setManualMinutes] = useState(0)

  useEffect(() => {
    const calculated = wordCount * rate
    setTotal(calculated)
    // Manual time scales: base 5 min + 1 min per 1000 words (avg freelancer reality)
    const estimatedManualMin = Math.round(5 + wordCount / 1000)
    setManualMinutes(estimatedManualMin)
  }, [wordCount, rate])

  function handlePairChange(index: number) {
    setSelectedPair(index)
    setRate(LANGUAGE_PAIRS[index].rate)
  }

  return (
    <div className="bg-white border border-border rounded-2xl shadow-sm overflow-hidden w-full max-w-md">

      {/* Calculator header */}
      <div className="bg-ink px-5 py-3 flex items-center gap-2">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-400/60" />
          <div className="w-3 h-3 rounded-full bg-amber-400/60" />
          <div className="w-3 h-3 rounded-full bg-green-400/60" />
        </div>
        <span className="text-white/70 text-xs font-mono ml-2">invoice_calculator.tt</span>
      </div>

      <div className="p-5 space-y-4">

        {/* Language pair */}
        <div>
          <label className="block text-xs font-semibold text-slate-mid uppercase tracking-wider mb-1.5">
            Language Pair
          </label>
          <select
            value={selectedPair}
            onChange={(e) => handlePairChange(Number(e.target.value))}
            className="w-full border border-border rounded-lg px-3 py-2.5 text-ink text-sm focus:outline-none focus:border-ink bg-paper"
          >
            {LANGUAGE_PAIRS.map((pair, i) => (
              <option key={pair.label} value={i}>
                {pair.label}
              </option>
            ))}
          </select>
        </div>

        {/* Word count slider */}
        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label className="text-xs font-semibold text-slate-mid uppercase tracking-wider">
              Word Count
            </label>
            <span className="text-ink font-mono font-bold text-sm">
              {wordCount.toLocaleString()} words
            </span>
          </div>
          <input
            type="range"
            min={500}
            max={20000}
            step={100}
            value={wordCount}
            onChange={(e) => setWordCount(Number(e.target.value))}
            className="w-full accent-ink"
          />
          <div className="flex justify-between text-xs text-slate-mid mt-1">
            <span>500</span>
            <span>20,000</span>
          </div>
        </div>

        {/* Rate */}
        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label className="text-xs font-semibold text-slate-mid uppercase tracking-wider">
              Your Rate (per word)
            </label>
            <span className="text-ink font-mono font-bold text-sm">
              ${rate.toFixed(2)}
            </span>
          </div>
          <input
            type="range"
            min={0.05}
            max={0.35}
            step={0.01}
            value={rate}
            onChange={(e) => setRate(Number(e.target.value))}
            className="w-full accent-ink"
          />
          <div className="flex justify-between text-xs text-slate-mid mt-1">
            <span>$0.05</span>
            <span>$0.35</span>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-border" />

        {/* Result */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-mid">Invoice total</span>
            <span className="text-2xl font-display text-ink font-bold">
              ${total.toFixed(2)}
            </span>
          </div>

          {/* Before vs After */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-red-50 border border-red-100 rounded-lg p-3 text-center">
              <p className="text-red-400 text-xs font-semibold uppercase tracking-wider mb-1">
                Without TranslatorTrack
              </p>
              <p className="text-red-600 font-bold text-lg">~{manualMinutes} min</p>
              <p className="text-red-400 text-xs">manual calculation</p>
            </div>
            <div className="bg-green-50 border border-green-100 rounded-lg p-3 text-center">
              <p className="text-green-600 text-xs font-semibold uppercase tracking-wider mb-1">
                With TranslatorTrack
              </p>
              <p className="text-green-700 font-bold text-lg">&lt; 5 sec</p>
              <p className="text-green-600 text-xs">automatic</p>
            </div>
          </div>

          <p className="text-xs text-slate-mid text-center">
            At 20 invoices/month, that's{" "}
            <span className="text-ink font-semibold">
              {(manualMinutes * 20 / 60).toFixed(1)} hours
            </span>{" "}
            saved.
          </p>
        </div>

      </div>
    </div>
  )
}