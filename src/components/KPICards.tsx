import { KPIs } from '@/types'
import { Card, CardContent } from '@/components/ui/card'
import { cn, fmtINR, fmtPct } from '@/lib/utils'
import { TrendingUp, TrendingDown, DollarSign, BarChart2 } from 'lucide-react'

interface KPICardProps {
  label: string
  value: string
  delta?: string
  positive?: boolean
  Icon: React.ComponentType<{ className?: string }>
}

function KPICard({ label, value, delta, positive, Icon }: KPICardProps) {
  return (
    <Card>
      <CardContent className="pt-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</span>
          <Icon className="h-4 w-4 text-muted-foreground" />
        </div>
        <div className="text-2xl font-semibold tabular-nums">{value}</div>
        {delta !== undefined && (
          <div className={cn('mt-1 text-sm font-medium', positive ? 'text-green-600' : 'text-red-500')}>
            {delta}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default function KPICards({ kpis }: { kpis: KPIs }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <KPICard label="Total Invested" value={fmtINR(kpis.total_invested)} Icon={DollarSign} />
      <KPICard label="Current Value" value={fmtINR(kpis.total_current_value)} Icon={BarChart2} />
      <KPICard
        label="Total P&L"
        value={fmtINR(kpis.total_pnl)}
        delta={fmtPct(kpis.total_pnl_pct)}
        positive={kpis.total_pnl >= 0}
        Icon={kpis.total_pnl >= 0 ? TrendingUp : TrendingDown}
      />
      <KPICard
        label="Today's Change"
        value={fmtINR(kpis.day_change_abs)}
        delta={fmtPct(kpis.day_change_pct)}
        positive={kpis.day_change_abs >= 0}
        Icon={kpis.day_change_abs >= 0 ? TrendingUp : TrendingDown}
      />
    </div>
  )
}
