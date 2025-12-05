/**
 * Kalshi API Types
 * Based on Kalshi Trade API v2 documentation
 */

// Market Types - Based on actual API response
export interface Market {
  // Core identifiers
  ticker: string;
  title: string;
  subtitle?: string;
  event_ticker: string;
  category?: string;

  // Market state
  status: "unopened" | "open" | "closed" | "settled" | "active";
  market_type: "binary";
  result?: string;

  // Pricing (in cents, 0-100)
  yes_ask: number;
  yes_bid: number;
  no_ask: number;
  no_bid: number;
  last_price: number;
  previous_price: number;

  // Pricing in dollars (string format)
  yes_ask_dollars?: string;
  yes_bid_dollars?: string;
  no_ask_dollars?: string;
  no_bid_dollars?: string;
  last_price_dollars?: string;
  previous_price_dollars?: string;

  // Volume and liquidity
  volume: number;
  volume_24h: number;
  open_interest: number;
  liquidity: number;
  liquidity_dollars?: string;

  // Notional value
  notional_value: number;
  notional_value_dollars?: string;

  // Timing
  open_time: string;
  close_time: string;
  expiration_time: string;
  expected_expiration_time?: string;
  latest_expiration_time?: string;
  created_time: string;

  // Rules and description
  rules_primary: string;
  rules_secondary?: string;
  yes_sub_title?: string;
  no_sub_title?: string;

  // Settlement
  settlement_timer_seconds?: number;
  can_close_early: boolean;
  early_close_condition?: string;
  expiration_value?: string;

  // Price structure
  tick_size: number;
  price_level_structure?: string;
  price_ranges?: PriceRange[];
  response_price_units?: string;
  risk_limit_cents?: number;

  // Computed fields (added by us for compatibility with UI)
  id?: string; // Alias for ticker
  question?: string; // Alias for title
  outcomes?: string[];
  outcomePrices?: string[];
  yesPrice?: number; // yes_ask as decimal (0-1)
  noPrice?: number; // no_ask as decimal (0-1)
  change24h?: number;
  endDate?: string; // Alias for close_time
}

export interface PriceRange {
  start: string;
  end: string;
  step: string;
}

export interface Event {
  event_ticker: string;
  title: string;
  category: string;
  mutually_exclusive: boolean;
  series_ticker?: string;
  markets?: Market[];
}

export interface Series {
  ticker: string;
  title: string;
  frequency: string;
  category: string;
}

// Order Book Types
export interface OrderBook {
  ticker: string;
  bids: OrderBookEntry[];
  asks?: OrderBookEntry[]; // Kalshi only returns bids
}

export interface OrderBookEntry {
  price: number;
  quantity: number;
}

// Trade Types
export interface Trade {
  trade_id: string;
  ticker: string;
  taker_side: "yes" | "no";
  count: number;
  yes_price: number;
  no_price: number;
  created_time: string;
}

// Candlestick/History Types
export interface Candlestick {
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  timestamp: string;
}

export interface CandlestickHistory {
  candlesticks: Candlestick[];
}

// API Response Types
export interface MarketsResponse {
  markets: Market[];
  cursor?: string;
}

export interface EventsResponse {
  events: Event[];
  cursor?: string;
}

export interface TradesResponse {
  trades: Trade[];
  cursor?: string;
}

// Filter Types
export interface MarketFilters {
  status?: "unopened" | "open" | "closed" | "settled";
  series_ticker?: string;
  event_ticker?: string;
  min_close_ts?: number;
  max_close_ts?: number;
  limit?: number;
  cursor?: string;
}

// AI Analysis Types (for our platform)
export interface AIAnalysis {
  marketId: string;
  aiProbability: number;
  marketProbability: number;
  edge: number;
  confidence: "low" | "medium" | "high";
  reasoning: string;
  sources: string[];
  updatedAt: string;
}

export interface SmartMoneySignal {
  marketId: string;
  action: "buy" | "sell";
  side: "yes" | "no";
  size: number;
  timestamp: string;
}

export interface NewsCorrelation {
  marketId: string;
  newsItem: {
    title: string;
    source: string;
    url: string;
    timestamp: string;
  };
  sentiment: "positive" | "negative" | "neutral";
  priceImpact: number;
  relevanceScore: number;
}
