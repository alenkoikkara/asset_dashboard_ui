import { useState } from 'react'
import { HoldingSummary, SectorAllocation } from '@/types'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { cn, fmtINR, fmtPct } from '@/lib/utils'
import HoldingDetail from '@/components/HoldingDetail'

interface Props {
  holdings: HoldingSummary[]
  sectors: SectorAllocation[]
  sector: string
  broker: string
  sort: string
  onSectorChange: (v: string) => void
  onBrokerChange: (v: string) => void
  onSortChange: (v: string) => void
}

export default function HoldingsList({
  holdings,
  sectors,
  sector,
  broker,
  sort,
  onSectorChange,
  onBrokerChange,
  onSortChange,
}: Props) {
  const [expanded, setExpanded] = useState<string | null>(null)

  const sectorOptions = ['All', ...sectors.map((s) => s.sector)]

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <h2 className="text-lg font-semibold">Holdings</h2>
        <div className="flex flex-wrap gap-2">
          <Select value={sector} onValueChange={onSectorChange}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Sector" />
            </SelectTrigger>
            <SelectContent>
              {sectorOptions.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={broker} onValueChange={onBrokerChange}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Broker" />
            </SelectTrigger>
            <SelectContent>
              {['All', 'Zerodha', 'Groww'].map((b) => (
                <SelectItem key={b} value={b}>
                  {b}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sort} onValueChange={onSortChange}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pnl_pct">P&L %</SelectItem>
              <SelectItem value="current_value">Current Value</SelectItem>
              <SelectItem value="pnl_abs">P&L ₹</SelectItem>
              <SelectItem value="symbol">Symbol</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        {holdings.length === 0 && (
          <p className="text-sm text-muted-foreground py-4">No holdings match the selected filters.</p>
        )}
        {holdings.map((h) => {
          const isOpen = expanded === h.symbol
          const pnlPositive = h.total_unrealized_pnl_pct >= 0

          return (
            <Card key={h.symbol} className="overflow-hidden">
              <div
                className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-muted/40 transition-colors"
                onClick={() => setExpanded(isOpen ? null : h.symbol)}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className="font-mono font-semibold text-sm shrink-0">{h.symbol}</span>
                  {h.brokers.split(',').map((b) => (
                    <Badge key={b} variant="secondary" className="text-xs capitalize shrink-0">
                      {b.trim()}
                    </Badge>
                  ))}
                  {h.sector && (
                    <span className="text-xs text-muted-foreground hidden md:block truncate">
                      {h.sector}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3 shrink-0 ml-2">
                  <span className="text-sm font-medium tabular-nums hidden sm:block">
                    {fmtINR(h.total_current_value)}
                  </span>
                  <Badge
                    className={cn(
                      'min-w-[72px] justify-center text-xs tabular-nums',
                      pnlPositive
                        ? 'bg-green-100 text-green-700 hover:bg-green-100'
                        : 'bg-red-100 text-red-700 hover:bg-red-100',
                    )}
                  >
                    {fmtPct(h.total_unrealized_pnl_pct)}
                  </Badge>
                  {isOpen ? (
                    <ChevronUp className="h-4 w-4 text-muted-foreground shrink-0" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
                  )}
                </div>
              </div>

              {isOpen && (
                <CardContent className="pt-0 px-4 pb-4 border-t">
                  <HoldingDetail symbol={h.symbol} summary={h} />
                </CardContent>
              )}
            </Card>
          )
        })}
      </div>
    </div>
  )
}
