import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from 'recharts'
import { PnLByStock } from '@/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function PnLChart({ data }: { data: PnLByStock[] }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">P&L by Stock</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart
            data={data}
            layout="vertical"
            margin={{ left: 16, right: 48, top: 4, bottom: 4 }}
          >
            <XAxis
              type="number"
              tickFormatter={(v) => `${v.toFixed(0)}%`}
              fontSize={11}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              type="category"
              dataKey="symbol"
              width={80}
              fontSize={11}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              formatter={(val: number) => [`${val.toFixed(2)}%`, 'P&L']}
              contentStyle={{ fontSize: 12 }}
            />
            <ReferenceLine x={0} stroke="hsl(240 5.9% 90%)" />
            <Bar dataKey="total_unrealized_pnl_pct" radius={[0, 3, 3, 0]} label={{ position: 'right', fontSize: 11, formatter: (v: number) => `${v.toFixed(1)}%` }}>
              {data.map((entry, i) => (
                <Cell key={i} fill={entry.total_unrealized_pnl_pct >= 0 ? '#22c55e' : '#ef4444'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
