import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import { SectorAllocation } from '@/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { fmtINR } from '@/lib/utils'

const COLORS = ['#6366f1', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316']

interface SectorDatum extends SectorAllocation {
  pct: number
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null
  const d: SectorDatum = payload[0].payload
  return (
    <div
      style={{
        backgroundColor: '#0b1628',
        border: '1px solid #1e3352',
        borderRadius: 8,
        padding: '8px 12px',
        boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
      }}
    >
      <div style={{ color: '#8ba3b8', fontSize: 11, marginBottom: 4 }}>{d.sector}</div>
      <div style={{ color: '#e2eaf2', fontSize: 13, fontWeight: 600 }}>{fmtINR(d.value)}</div>
      <div style={{ color: '#8ba3b8', fontSize: 11, marginTop: 2 }}>{d.pct.toFixed(1)}% of portfolio</div>
    </div>
  )
}

export default function SectorChart({ data }: { data: SectorAllocation[] }) {
  const total = data.reduce((s, d) => s + d.value, 0)
  const enriched: SectorDatum[] = data.map((d) => ({
    ...d,
    pct: total > 0 ? (d.value / total) * 100 : 0,
  }))

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Sector Allocation</CardTitle>
      </CardHeader>
      <CardContent className="pb-3">
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={enriched}
              cx="50%"
              cy="50%"
              innerRadius={64}
              outerRadius={96}
              paddingAngle={3}
              dataKey="value"
              nameKey="sector"
              strokeWidth={0}
              isAnimationActive
              animationBegin={80}
              animationDuration={600}
              animationEasing="ease-out"
            >
              {enriched.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} fillOpacity={0.9} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>

        {/* Custom legend with percentages */}
        <div className="mt-3 space-y-1.5">
          {enriched.map((d, i) => (
            <div key={d.sector} className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <span
                  className="shrink-0 w-2 h-2 rounded-full"
                  style={{ backgroundColor: COLORS[i % COLORS.length] }}
                />
                <span className="text-xs text-muted-foreground truncate">{d.sector}</span>
              </div>
              <span className="text-xs tabular-nums text-foreground/70 shrink-0">
                {d.pct.toFixed(1)}%
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
