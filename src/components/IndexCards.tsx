import { useEffect, useState } from 'react'
import { api } from '@/lib/api'

interface IndexData {
  key: string
  name: string
  hours: string
  extended: boolean
  note: string | null
  price: number | null
  change: number | null
  change_pct: number | null
  prev_close: number | null
}

function isOpen(extended: boolean): boolean {
  const now = new Date()
  const ist = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }))
  const day = ist.getDay() // 0=Sun, 6=Sat
  const t = ist.getHours() * 60 + ist.getMinutes()

  if (day === 0) return false // Sunday always closed

  if (!extended) {
    if (day === 6) return false
    return t >= 9 * 60 + 15 && t <= 15 * 60 + 30
  }

  // Gift Nifty: Mon–Fri 6 AM–11:30 PM IST (two sessions with a small gap)
  return t >= 6 * 60 && t <= 23 * 60 + 30
}

function fmt(n: number): string {
  return n.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function IndexCard({ d }: { d: IndexData }) {
  const open = isOpen(d.extended)
  const pos = d.change != null && d.change >= 0

  return (
    <div className="min-w-0 rounded-xl border border-border bg-card px-4 py-3 flex flex-col gap-1.5 transition-colors hover:border-border/80">
      {/* Header row */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground truncate">
            {d.name}
          </span>
          {d.extended && (
            <span className="shrink-0 text-[9px] font-semibold uppercase tracking-wide px-1.5 py-0.5 rounded-full border border-amber-500/30 text-amber-400 bg-amber-500/10">
              Extended
            </span>
          )}
        </div>
        <span className={`shrink-0 flex items-center gap-1 text-[10px] font-medium ${open ? 'text-green-400' : 'text-muted-foreground'}`}>
          <span className={`inline-block w-1.5 h-1.5 rounded-full ${open ? 'bg-green-400 animate-pulse' : 'bg-muted-foreground/50'}`} />
          {open ? 'Live' : 'Closed'}
        </span>
      </div>

      {/* Price */}
      {d.price != null ? (
        <>
          <div className="text-xl font-bold tabular-nums tracking-tight leading-none">
            {fmt(d.price)}
          </div>
          <div className={`flex items-center gap-2 text-sm font-medium tabular-nums ${pos ? 'text-green-400' : 'text-red-400'}`}>
            <span>{pos ? '+' : ''}{fmt(d.change!)}</span>
            <span className="text-xs opacity-80">({pos ? '+' : ''}{d.change_pct!.toFixed(2)}%)</span>
          </div>
        </>
      ) : (
        <div className="text-xl font-bold text-muted-foreground">—</div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between gap-2 mt-0.5">
        <span className="text-[10px] text-muted-foreground/60">{d.hours}</span>
        {d.note && (
          <span className="text-[9px] text-muted-foreground/50 italic truncate">{d.note}</span>
        )}
      </div>
    </div>
  )
}

export default function IndexCards() {
  const [indices, setIndices] = useState<IndexData[]>([])

  useEffect(() => {
    fetch(api('/api/indices'))
      .then((r) => r.json())
      .then(setIndices)
      .catch(() => {})
  }, [])

  if (!indices.length) return null

  return (
    <div className="flex gap-3">
      {indices.map((d, i) => (
        <div
          key={d.key}
          className="flex-1 anim-in"
          style={{ animationDelay: `${i * 70}ms` }}
        >
          <IndexCard d={d} />
        </div>
      ))}
    </div>
  )
}
