import { BrokerAllocation } from '@/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn, fmtINR, fmtPct } from '@/lib/utils'

export default function BrokerCard({ data }: { data: BrokerAllocation[] | undefined }) {
  if (!data?.length) return null

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">By Broker</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {data.map((b) => (
          <div key={b.broker} className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium capitalize">{b.broker}</span>
              <span className={cn('text-sm font-semibold', b.pnl >= 0 ? 'text-green-600' : 'text-red-500')}>
                {b.pnl >= 0 ? '+' : ''}{fmtINR(b.pnl)}{' '}
                <span className="text-xs font-normal">({fmtPct(b.pnl_pct)})</span>
              </span>
            </div>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Invested: {fmtINR(b.invested)}</span>
              <span>Current: {fmtINR(b.current_value)}</span>
            </div>
            <div className="h-1.5 rounded-full bg-muted overflow-hidden">
              <div
                className={cn('h-full rounded-full', b.pnl >= 0 ? 'bg-green-500' : 'bg-red-500')}
                style={{ width: `${Math.min(100, (b.current_value / b.invested) * 100)}%` }}
              />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
