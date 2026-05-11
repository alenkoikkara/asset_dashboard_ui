import { useState, useEffect } from 'react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  ReferenceLine,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { api } from '@/lib/api'

type Period = '1m' | '1y' | 'all'

interface DataPoint {
  date: string
  portfolio: number
  nifty50: number
}

interface BenchmarkData {
  series: DataPoint[]
  summary: {
    portfolio_return: number
    nifty50_return: number
    start_date: string | null
    end_date: string | null
  }
}

const PERIODS: { key: Period; label: string }[] = [
  { key: '1m', label: '1M' },
  { key: '1y', label: '1Y' },
  { key: 'all', label: 'All' },
]

const TOOLTIP_STYLE = {
  backgroundColor: '#0b1628',
  border: '1px solid #1a2f52',
  borderRadius: 8,
  fontSize: 12,
  color: '#c8daea',
}

function ReturnCell({ value }: { value: number }) {
  const pos = value >= 0
  return (
    <td
      className={`px-4 py-2.5 text-right font-semibold tabular-nums text-sm ${pos ? 'text-green-400' : 'text-red-400'}`}
    >
      {pos ? '+' : ''}{value.toFixed(2)}%
    </td>
  )
}

export default function BenchmarkChart() {
  const [period, setPeriod] = useState<Period>('1y')
  const [data, setData] = useState<BenchmarkData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    setLoading(true)
    setError(false)
    fetch(api(`/api/benchmark?period=${period}`))
      .then((r) => {
        if (!r.ok) throw new Error()
        return r.json()
      })
      .then((d) => {
        setData(d)
        setLoading(false)
      })
      .catch(() => {
        setError(true)
        setLoading(false)
      })
  }, [period])

  const fmtDate = (d: string) => {
    const dt = new Date(d)
    if (period === '1m') return dt.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
    return dt.toLocaleDateString('en-IN', { month: 'short', year: '2-digit' })
  }

  const fmtTooltipVal = (v: number, name: string) => [
    `${v >= 0 ? '+' : ''}${v.toFixed(2)}%`,
    name === 'portfolio' ? 'Portfolio' : 'Nifty 50',
  ]

  const alpha =
    data ? data.summary.portfolio_return - data.summary.nifty50_return : 0

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Portfolio vs Nifty 50</CardTitle>
          <div className="flex gap-1 rounded-lg bg-muted p-0.5">
            {PERIODS.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setPeriod(key)}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                  period === key
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {loading && (
          <div className="h-64 flex items-center justify-center text-muted-foreground text-sm">
            Loading benchmark data…
          </div>
        )}

        {error && (
          <div className="h-64 flex flex-col items-center justify-center gap-2 text-center">
            <p className="text-sm text-muted-foreground">Benchmark data not available.</p>
            <p className="text-xs text-muted-foreground">
              Add <code className="bg-muted px-1.5 py-0.5 rounded text-foreground">/api/benchmark</code> to the backend.
            </p>
          </div>
        )}

        {!loading && !error && data && data.series.length > 0 && (
          <>
            {/* Chart */}
            <div style={{ opacity: loading ? 0 : 1, transition: 'opacity 0.25s ease' }}>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={data.series} margin={{ left: 0, right: 8, top: 8, bottom: 0 }}>
                <defs>
                  <linearGradient id="gradPortfolio" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#818cf8" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#818cf8" stopOpacity={0.02} />
                  </linearGradient>
                  <linearGradient id="gradNifty" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#fbbf24" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#fbbf24" stopOpacity={0.02} />
                  </linearGradient>
                </defs>

                <CartesianGrid strokeDasharray="3 3" stroke="#1a2f52" vertical={false} />
                <ReferenceLine y={0} stroke="#1a2f52" strokeWidth={1.5} />

                <XAxis
                  dataKey="date"
                  tickFormatter={fmtDate}
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: '#6b849e' }}
                  interval="preserveStartEnd"
                  minTickGap={40}
                />
                <YAxis
                  tickFormatter={(v) => `${v >= 0 ? '+' : ''}${v.toFixed(0)}%`}
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: '#6b849e' }}
                  width={54}
                />
                <Tooltip
                  contentStyle={TOOLTIP_STYLE}
                  formatter={fmtTooltipVal}
                  labelFormatter={fmtDate}
                  cursor={{ stroke: '#1a2f52', strokeWidth: 1 }}
                />

                <Area
                  type="monotone"
                  dataKey="nifty50"
                  stroke="#fbbf24"
                  strokeWidth={1.5}
                  fill="url(#gradNifty)"
                  dot={false}
                  activeDot={{ r: 4, fill: '#fbbf24' }}
                  isAnimationActive
                  animationBegin={0}
                  animationDuration={700}
                  animationEasing="ease-out"
                />
                <Area
                  type="monotone"
                  dataKey="portfolio"
                  stroke="#818cf8"
                  strokeWidth={2}
                  fill="url(#gradPortfolio)"
                  dot={false}
                  activeDot={{ r: 4, fill: '#818cf8' }}
                  isAnimationActive
                  animationBegin={100}
                  animationDuration={700}
                  animationEasing="ease-out"
                />
              </AreaChart>
            </ResponsiveContainer>
            </div>

            {/* Legend */}
            <div className="flex gap-4 justify-center text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <span className="inline-block w-3 h-0.5 bg-indigo-400 rounded" />
                Portfolio
              </span>
              <span className="flex items-center gap-1.5">
                <span className="inline-block w-3 h-0.5 bg-amber-400 rounded" />
                Nifty 50
              </span>
            </div>

            {/* Summary table */}
            <div className="rounded-lg border border-border overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/40">
                    <th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground" />
                    <th className="px-4 py-2.5 text-right text-xs font-medium text-muted-foreground">Portfolio</th>
                    <th className="px-4 py-2.5 text-right text-xs font-medium text-muted-foreground">Nifty 50</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  <tr>
                    <td className="px-4 py-2.5 text-xs text-muted-foreground">Return</td>
                    <ReturnCell value={data.summary.portfolio_return} />
                    <ReturnCell value={data.summary.nifty50_return} />
                  </tr>
                  <tr className="bg-muted/20">
                    <td className="px-4 py-2.5 text-xs text-muted-foreground">Alpha</td>
                    <td
                      colSpan={2}
                      className={`px-4 py-2.5 text-right font-semibold tabular-nums text-sm ${alpha >= 0 ? 'text-green-400' : 'text-red-400'}`}
                    >
                      {alpha >= 0 ? '+' : ''}{alpha.toFixed(2)}% vs benchmark
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </>
        )}

        {!loading && !error && data && data.series.length === 0 && (
          <div className="h-32 flex items-center justify-center text-muted-foreground text-sm">
            No data for this period.
          </div>
        )}
      </CardContent>
    </Card>
  )
}
