import { useEffect, useState } from 'react'
import { HoldingDetail as HoldingDetailType, HoldingSummary } from '@/types'
import { cn, fmtINR, fmtPct } from '@/lib/utils'
import { api } from '@/lib/api'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

const SENTIMENT_STYLE: Record<string, string> = {
  bullish: 'bg-green-500/20 text-green-400 hover:bg-green-500/20',
  bearish: 'bg-red-500/20 text-red-400 hover:bg-red-500/20',
  neutral: 'bg-muted text-muted-foreground hover:bg-muted',
}

interface Props {
  symbol: string
  summary: HoldingSummary
}

export default function HoldingDetail({ symbol, summary }: Props) {
  const [detail, setDetail] = useState<HoldingDetailType | null>(null)

  useEffect(() => {
    fetch(api(`/api/holdings/${symbol}`))
      .then((r) => r.json())
      .then(setDetail)
  }, [symbol])

  if (!detail) {
    return <div className="py-4 text-sm text-muted-foreground">Loading...</div>
  }

  const first = detail.brokers[0]
  const pnlPositive = summary.total_unrealized_pnl >= 0
  const aiRow = detail.brokers.find((b) => b.ai_commentary)

  return (
    <div className="mt-3 space-y-4">
      {/* Summary metrics */}
      <div className="grid grid-cols-3 gap-4">
        <div>
          <div className="text-xs text-muted-foreground">Invested</div>
          <div className="font-semibold tabular-nums">{fmtINR(summary.total_invested)}</div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground">Current Value</div>
          <div className="font-semibold tabular-nums">{fmtINR(summary.total_current_value)}</div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground">P&L</div>
          <div className={cn('font-semibold tabular-nums', pnlPositive ? 'text-green-400' : 'text-red-400')}>
            {fmtINR(summary.total_unrealized_pnl)} ({fmtPct(summary.total_unrealized_pnl_pct)})
          </div>
        </div>
      </div>

      {/* Broker breakdown — only when held across multiple brokers */}
      {detail.brokers.length > 1 && (
        <>
          <Separator />
          <div>
            <div className="mb-2 text-xs font-medium text-muted-foreground">Broker Breakdown</div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Broker</TableHead>
                  <TableHead className="text-right">Qty</TableHead>
                  <TableHead className="text-right">Avg Cost</TableHead>
                  <TableHead className="text-right">Invested</TableHead>
                  <TableHead className="text-right">Current</TableHead>
                  <TableHead className="text-right">P&L</TableHead>
                  <TableHead className="text-right">P&L %</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {detail.brokers.map((b) => (
                  <TableRow key={b.broker}>
                    <TableCell className="capitalize">{b.broker}</TableCell>
                    <TableCell className="text-right tabular-nums">{b.quantity}</TableCell>
                    <TableCell className="text-right tabular-nums">₹{b.avg_cost.toFixed(2)}</TableCell>
                    <TableCell className="text-right tabular-nums">{fmtINR(b.invested_value)}</TableCell>
                    <TableCell className="text-right tabular-nums">{fmtINR(b.current_value)}</TableCell>
                    <TableCell
                      className={cn(
                        'text-right tabular-nums',
                        b.unrealized_pnl >= 0 ? 'text-green-400' : 'text-red-400',
                      )}
                    >
                      {fmtINR(b.unrealized_pnl)}
                    </TableCell>
                    <TableCell
                      className={cn(
                        'text-right tabular-nums',
                        b.unrealized_pnl_pct >= 0 ? 'text-green-400' : 'text-red-400',
                      )}
                    >
                      {fmtPct(b.unrealized_pnl_pct)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </>
      )}

      {/* Fundamentals */}
      <Separator />
      <div className="grid grid-cols-5 gap-3">
        {first.current_price != null && (
          <div>
            <div className="text-xs text-muted-foreground">Price</div>
            <div className="text-sm font-medium tabular-nums">{fmtINR(first.current_price)}</div>
          </div>
        )}
        {first.pe_ratio != null && (
          <div>
            <div className="text-xs text-muted-foreground">P/E</div>
            <div className="text-sm font-medium">{first.pe_ratio.toFixed(1)}x</div>
          </div>
        )}
        {first.fifty_two_week_high != null && (
          <div>
            <div className="text-xs text-muted-foreground">52W High</div>
            <div className="text-sm font-medium tabular-nums">{fmtINR(first.fifty_two_week_high)}</div>
          </div>
        )}
        {first.fifty_two_week_low != null && (
          <div>
            <div className="text-xs text-muted-foreground">52W Low</div>
            <div className="text-sm font-medium tabular-nums">{fmtINR(first.fifty_two_week_low)}</div>
          </div>
        )}
        {first.dividend_yield != null && first.dividend_yield > 0 && (
          <div>
            <div className="text-xs text-muted-foreground">Div Yield</div>
            <div className="text-sm font-medium">{first.dividend_yield.toFixed(2)}%</div>
          </div>
        )}
      </div>

      {/* Day change */}
      {first.day_change_pct != null && (
        <div
          className={cn(
            'text-sm font-medium',
            first.day_change_pct >= 0 ? 'text-green-400' : 'text-red-400',
          )}
        >
          Day change: {fmtPct(first.day_change_pct)}
        </div>
      )}

      {/* AI commentary */}
      {aiRow && (
        <>
          <Separator />
          <div className="space-y-2">
            {aiRow.ai_sentiment && (
              <Badge
                className={cn(
                  'text-xs uppercase border-0',
                  SENTIMENT_STYLE[aiRow.ai_sentiment] ?? 'bg-muted text-muted-foreground',
                )}
              >
                {aiRow.ai_sentiment}
              </Badge>
            )}
            {aiRow.ai_commentary && (
              <p className="text-sm text-muted-foreground">{aiRow.ai_commentary}</p>
            )}
          </div>
        </>
      )}

      {/* Upcoming dates */}
      {(first.next_earnings_date ||
        (first.next_dividend_date && first.next_dividend_amount)) && (
        <>
          <Separator />
          <div className="rounded-md bg-accent px-3 py-2 text-sm space-y-1">
            {first.next_earnings_date && (
              <div>
                Earnings: <strong>{first.next_earnings_date}</strong>
              </div>
            )}
            {first.next_dividend_date && first.next_dividend_amount && (
              <div>
                Dividend: <strong>{first.next_dividend_date}</strong> — ₹
                {first.next_dividend_amount}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
