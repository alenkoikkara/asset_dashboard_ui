import { KPIs } from '@/types'
import { Card, CardContent } from '@/components/ui/card'
import { cn, fmtINR, fmtPct } from '@/lib/utils'
import { TrendingUp, TrendingDown, DollarSign, BarChart2 } from 'lucide-react'

export default function KPICards({ kpis }: { kpis: KPIs }) {
  const totalPnlPos = kpis.total_pnl >= 0
  const dayPos = kpis.day_change_abs >= 0

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">

      {/* Total Invested */}
      <div className="anim-in" style={{ animationDelay: '0ms' }}>
        <Card className="relative overflow-hidden border-indigo-500/15 bg-gradient-to-br from-card to-indigo-950/30 h-full">
          <div className="absolute inset-0 pointer-events-none rounded-[inherit] ring-1 ring-inset ring-indigo-500/10" />
          <CardContent className="pt-5 pb-5 flex flex-col justify-between h-full">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-widest text-indigo-400/80">Invested</span>
              <DollarSign className="h-4 w-4 text-indigo-400/50" />
            </div>
            <div>
              <div className="text-2xl font-semibold tabular-nums tracking-tight">{fmtINR(kpis.total_invested)}</div>
              <div className="mt-1 text-xs text-muted-foreground/50 invisible">—</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Current Value */}
      <div className="anim-in" style={{ animationDelay: '60ms' }}>
        <Card className="relative overflow-hidden border-emerald-500/15 bg-gradient-to-br from-card to-emerald-950/30 h-full">
          <div className="absolute inset-0 pointer-events-none rounded-[inherit] ring-1 ring-inset ring-emerald-500/10" />
          <CardContent className="pt-5 pb-5 flex flex-col justify-between h-full">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-widest text-emerald-400/80">Current</span>
              <BarChart2 className="h-4 w-4 text-emerald-400/50" />
            </div>
            <div>
              <div className="text-2xl font-semibold tabular-nums tracking-tight">{fmtINR(kpis.total_current_value)}</div>
              <div className={cn('mt-1 text-xs font-medium', totalPnlPos ? 'text-emerald-400/70' : 'text-red-400/70')}>
                {totalPnlPos ? '▲' : '▼'} {fmtINR(Math.abs(kpis.total_pnl))} overall
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Total P&L */}
      <div className="anim-in" style={{ animationDelay: '120ms' }}>
        <Card className="h-full">
          <CardContent className="pt-5 pb-5 flex flex-col justify-between h-full">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Total P&L</span>
              {totalPnlPos
                ? <TrendingUp className="h-4 w-4 text-muted-foreground" />
                : <TrendingDown className="h-4 w-4 text-muted-foreground" />}
            </div>
            <div>
              <div className={cn('text-2xl font-semibold tabular-nums', totalPnlPos ? 'text-green-400' : 'text-red-400')}>
                {fmtINR(kpis.total_pnl)}
              </div>
              <div className={cn('mt-1 text-xs font-medium', totalPnlPos ? 'text-green-400/70' : 'text-red-400/70')}>
                {fmtPct(kpis.total_pnl_pct)}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Today's Change */}
      <div className="anim-in" style={{ animationDelay: '180ms' }}>
        <Card className="h-full">
          <CardContent className="pt-5 pb-5 flex flex-col justify-between h-full">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Today</span>
              {dayPos
                ? <TrendingUp className="h-4 w-4 text-muted-foreground" />
                : <TrendingDown className="h-4 w-4 text-muted-foreground" />}
            </div>
            <div>
              <div className={cn('text-2xl font-semibold tabular-nums', dayPos ? 'text-green-400' : 'text-red-400')}>
                {fmtINR(kpis.day_change_abs)}
              </div>
              <div className={cn('mt-1 text-xs font-medium', dayPos ? 'text-green-400/70' : 'text-red-400/70')}>
                {fmtPct(kpis.day_change_pct)}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

    </div>
  )
}
