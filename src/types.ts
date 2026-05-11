export interface KPIs {
  total_invested: number
  total_current_value: number
  total_pnl: number
  total_pnl_pct: number
  day_change_abs: number
  day_change_pct: number
}

export interface SectorAllocation {
  sector: string
  value: number
}

export interface PnLByStock {
  symbol: string
  total_unrealized_pnl_pct: number
}

export interface PortfolioData {
  kpis: KPIs
  last_updated: string
  sector_allocation: SectorAllocation[]
  pnl_by_stock: PnLByStock[]
}

export interface HoldingSummary {
  symbol: string
  asset_class: string | null
  sector: string | null
  total_invested: number
  total_current_value: number
  total_unrealized_pnl: number
  total_unrealized_pnl_pct: number
  brokers: string
}

export interface HoldingRow {
  symbol: string
  isin: string | null
  exchange: string | null
  broker: string
  asset_class: string | null
  quantity: number
  avg_cost: number
  invested_value: number
  current_price: number | null
  current_value: number
  unrealized_pnl: number
  unrealized_pnl_pct: number
  day_change_pct: number | null
  sector: string | null
  industry: string | null
  market_cap: number | null
  pe_ratio: number | null
  fifty_two_week_high: number | null
  fifty_two_week_low: number | null
  dividend_yield: number | null
  next_earnings_date: string | null
  next_dividend_date: string | null
  next_dividend_amount: number | null
  ai_commentary: string | null
  ai_sentiment: string | null
  last_updated: string
}

export interface HoldingDetail {
  brokers: HoldingRow[]
}
