import { useState, useEffect } from 'react'
import { PortfolioData, HoldingSummary } from '@/types'
import KPICards from '@/components/KPICards'
import SectorChart from '@/components/SectorChart'
import PnLChart from '@/components/PnLChart'
import HoldingsList from '@/components/HoldingsList'
import { Separator } from '@/components/ui/separator'
import { api } from '@/lib/api'

export default function App() {
  const [portfolio, setPortfolio] = useState<PortfolioData | null>(null)
  const [holdings, setHoldings] = useState<HoldingSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [sector, setSector] = useState('All')
  const [broker, setBroker] = useState('All')
  const [sort, setSort] = useState('pnl_pct')

  useEffect(() => {
    fetch(api('/api/portfolio'))
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`)
        return r.json()
      })
      .then((data) => {
        setPortfolio(data)
        setLoading(false)
      })
      .catch((e) => {
        setError(e.message)
        setLoading(false)
      })
  }, [])

  useEffect(() => {
    const params = new URLSearchParams()
    if (sector !== 'All') params.set('sector', sector)
    if (broker !== 'All') params.set('broker', broker.toLowerCase())
    params.set('sort', sort)
    fetch(api(`/api/holdings?${params}`))
      .then((r) => r.json())
      .then(setHoldings)
      .catch(() => {})
  }, [sector, broker, sort])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-muted-foreground text-sm">
        Loading portfolio…
      </div>
    )
  }

  if (error || !portfolio) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center space-y-2">
          <p className="text-sm font-medium">Could not connect to the API server.</p>
          <p className="text-xs text-muted-foreground">
            Start the backend: <code className="bg-muted px-1 rounded">uvicorn api.main:app --reload</code>
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Asset Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Last updated: {portfolio.last_updated}
          </p>
        </div>

        {/* KPI cards */}
        <KPICards kpis={portfolio.kpis} />

        <Separator />

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SectorChart data={portfolio.sector_allocation} />
          <PnLChart data={portfolio.pnl_by_stock} />
        </div>

        <Separator />

        {/* Holdings list */}
        <HoldingsList
          holdings={holdings}
          sectors={portfolio.sector_allocation}
          sector={sector}
          broker={broker}
          sort={sort}
          onSectorChange={setSector}
          onBrokerChange={setBroker}
          onSortChange={setSort}
        />
      </div>
    </div>
  )
}
