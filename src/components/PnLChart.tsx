import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from 'recharts'
import { PnLByStock } from '@/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const TOOLTIP_STYLE = {
  backgroundColor: '#0d1b2e',
  border: '1px solid #1e3352',
  borderRadius: 8,
  fontSize: 12,
  color: '#c8daea',
  boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null
  const { symbol, total_unrealized_pnl_pct } = payload[0].payload
  const pos = total_unrealized_pnl_pct >= 0
  return (
    <div style={TOOLTIP_STYLE} className="px-3 py-2 space-y-0.5">
      <div className="font-semibold text-xs text-foreground">{symbol}</div>
      <div className={`text-sm font-bold tabular-nums ${pos ? 'text-green-400' : 'text-red-400'}`}>
        {pos ? '+' : ''}{total_unrealized_pnl_pct.toFixed(2)}%
      </div>
    </div>
  )
}

export default function PnLChart({ data }: { data: PnLByStock[] }) {
  const sorted = [...data].sort((a, b) => a.total_unrealized_pnl_pct - b.total_unrealized_pnl_pct)

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">P&amp;L by Stock</CardTitle>
      </CardHeader>
      <CardContent className="pr-2">
        <ResponsiveContainer width="100%" height={280}>
          <BarChart
            data={sorted}
            layout="vertical"
            margin={{ left: 4, right: 12, top: 4, bottom: 4 }}
            barCategoryGap="30%"
          >
            <XAxis
              type="number"
              tickFormatter={(v) => `${v > 0 ? '+' : ''}${v.toFixed(0)}%`}
              fontSize={10}
              tickLine={false}
              axisLine={false}
              tick={{ fill: '#4a6580' }}
              tickCount={5}
            />
            <YAxis
              type="category"
              dataKey="symbol"
              width={72}
              fontSize={11}
              tickLine={false}
              axisLine={false}
              tick={{ fill: '#8ba3b8', fontFamily: 'Satoshi, system-ui, sans-serif' }}
            />
            <ReferenceLine x={0} stroke="#1e3352" strokeWidth={1} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
            <Bar
              dataKey="total_unrealized_pnl_pct"
              radius={[0, 3, 3, 0]}
              maxBarSize={10}
              isAnimationActive
              animationBegin={60}
              animationDuration={500}
              animationEasing="ease-out"
            >
              {sorted.map((entry, i) => (
                <Cell
                  key={i}
                  fill={entry.total_unrealized_pnl_pct >= 0 ? '#22c55e' : '#ef4444'}
                  fillOpacity={0.75}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
