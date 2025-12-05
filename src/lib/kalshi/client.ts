/**
 * Kalshi API Client
 * Connects to Kalshi Trade API v2
 */

import type {
  Market,
  Event,
  OrderBook,
  Trade,
  MarketFilters,
  MarketsResponse,
  EventsResponse,
  TradesResponse,
} from "./types";

// Use proxy in production to avoid CORS issues
const IS_BROWSER = typeof window !== "undefined";
const USE_PROXY = IS_BROWSER;
const KALSHI_API_URL = USE_PROXY
  ? "/api/kalshi"
  : "https://api.elections.kalshi.com/trade-api/v2";

class KalshiAPIError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: string
  ) {
    super(message);
    this.name = "KalshiAPIError";
  }
}

interface RequestOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: unknown;
  headers?: Record<string, string>;
  cache?: RequestCache;
  next?: { revalidate?: number; tags?: string[] };
}

async function request<T>(
  baseUrl: string,
  path: string,
  options: RequestOptions = {}
): Promise<T> {
  const url = `${baseUrl}${path}`;
  const { method = "GET", body, headers = {}, cache, next } = options;

  const config: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    cache,
    next,
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(url, config);

    if (!response.ok) {
      throw new KalshiAPIError(
        `API request failed: ${response.statusText}`,
        response.status
      );
    }

    const data = await response.json();
    return data as T;
  } catch (error) {
    if (error instanceof KalshiAPIError) {
      throw error;
    }
    throw new KalshiAPIError(
      `Network error: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}

/**
 * Kalshi Markets API
 */
export const marketsApi = {
  /**
   * Get all markets with optional filters
   */
  async getMarkets(filters?: MarketFilters): Promise<Market[]> {
    const params = new URLSearchParams();

    if (filters?.status) params.set("status", filters.status);
    if (filters?.series_ticker) params.set("series_ticker", filters.series_ticker);
    if (filters?.event_ticker) params.set("event_ticker", filters.event_ticker);
    if (filters?.limit) params.set("limit", String(filters.limit));
    if (filters?.cursor) params.set("cursor", filters.cursor);

    const query = params.toString();
    const path = `/markets${query ? `?${query}` : ""}`;

    const response = await request<MarketsResponse>(KALSHI_API_URL, path, {
      cache: "no-store",
    });

    return response.markets || [];
  },

  /**
   * Get a single market by ticker
   */
  async getMarket(ticker: string): Promise<Market> {
    const response = await request<{ market: Market }>(
      KALSHI_API_URL,
      `/markets/${ticker}`,
      { cache: "no-store" }
    );
    return response.market;
  },

  /**
   * Get order book for a market
   */
  async getOrderBook(ticker: string): Promise<OrderBook> {
    const response = await request<{ orderbook: OrderBook }>(
      KALSHI_API_URL,
      `/markets/${ticker}/orderbook`,
      { cache: "no-store" }
    );
    return response.orderbook;
  },

  /**
   * Get trades for a market
   */
  async getTrades(ticker: string, limit?: number): Promise<Trade[]> {
    const params = new URLSearchParams();
    if (limit) params.set("limit", String(limit));

    const query = params.toString();
    const path = `/markets/${ticker}/trades${query ? `?${query}` : ""}`;

    const response = await request<TradesResponse>(KALSHI_API_URL, path, {
      cache: "no-store",
    });

    return response.trades || [];
  },
};

/**
 * Kalshi Events API
 */
export const eventsApi = {
  /**
   * Get all events
   */
  async getEvents(limit?: number): Promise<Event[]> {
    const params = new URLSearchParams();
    if (limit) params.set("limit", String(limit));

    const query = params.toString();
    const path = `/events${query ? `?${query}` : ""}`;

    const response = await request<EventsResponse>(KALSHI_API_URL, path, {
      cache: "no-store",
    });

    return response.events || [];
  },

  /**
   * Get a single event by ticker
   */
  async getEvent(eventTicker: string): Promise<Event> {
    const response = await request<{ event: Event }>(
      KALSHI_API_URL,
      `/events/${eventTicker}`,
      { cache: "no-store" }
    );
    return response.event;
  },
};

/**
 * Normalize market data for UI compatibility
 * Converts Kalshi format to our standardized format
 */
function normalizeMarket(market: Market): Market {
  // Kalshi prices are in cents (0-100), convert to decimal (0-1)
  const yesPrice = market.yes_ask / 100;
  const noPrice = market.no_ask / 100;

  // Calculate 24h change if we have previous price
  const change24h =
    market.previous_price > 0
      ? (market.last_price - market.previous_price) / market.previous_price
      : 0;

  return {
    ...market,
    // Add compatibility aliases
    id: market.ticker,
    question: market.title,
    outcomes: ["Yes", "No"],
    outcomePrices: [yesPrice.toFixed(2), noPrice.toFixed(2)],
    yesPrice,
    noPrice,
    change24h,
    endDate: market.close_time,
    // Use volume_24h directly
    volume_24h: market.volume_24h ?? 0,
  };
}

/**
 * Filter for valid, active markets
 */
function isValidActiveMarket(market: Market): boolean {
  // Must be active/open status
  if (market.status !== "active" && market.status !== "open") return false;
  // Must have some activity
  if ((market.volume_24h ?? 0) === 0 && (market.liquidity ?? 0) === 0) return false;
  return true;
}

/**
 * Combined Kalshi client with helper methods
 */
export const kalshi = {
  markets: marketsApi,
  events: eventsApi,

  /**
   * Get market with enriched price data
   */
  async getEnrichedMarket(ticker: string): Promise<Market> {
    const market = await marketsApi.getMarket(ticker);
    return normalizeMarket(market);
  },

  /**
   * Get trending markets (highest 24h volume)
   */
  async getTrendingMarkets(limit: number = 10): Promise<Market[]> {
    const markets = await marketsApi.getMarkets({ status: "open", limit: 200 });

    return markets
      .map(normalizeMarket)
      .filter(isValidActiveMarket)
      .sort((a, b) => (b.volume_24h ?? 0) - (a.volume_24h ?? 0))
      .slice(0, limit);
  },

  /**
   * Get markets ending soon
   */
  async getEndingSoonMarkets(limit: number = 10): Promise<Market[]> {
    const markets = await marketsApi.getMarkets({ status: "open", limit: 200 });
    const now = new Date();

    return markets
      .map(normalizeMarket)
      .filter(isValidActiveMarket)
      .filter((m) => m.close_time && new Date(m.close_time) > now)
      .sort(
        (a, b) =>
          new Date(a.close_time).getTime() - new Date(b.close_time).getTime()
      )
      .slice(0, limit);
  },

  /**
   * Get hot markets (high volume + liquidity)
   */
  async getHotMarkets(limit: number = 10): Promise<Market[]> {
    const markets = await marketsApi.getMarkets({ status: "open", limit: 200 });

    // Score based on volume, liquidity, and open interest
    const scored = markets
      .map(normalizeMarket)
      .filter(isValidActiveMarket)
      .map((market) => {
        const volumeScore = Math.log10((market.volume_24h ?? 0) + 1);
        const liquidityScore = Math.log10((market.liquidity ?? 0) + 1);
        const openInterestScore = Math.log10((market.open_interest ?? 0) + 1);
        const score =
          volumeScore * 0.5 + liquidityScore * 0.3 + openInterestScore * 0.2;

        return { market, score };
      });

    return scored
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map((s) => s.market);
  },
};

export { KalshiAPIError };
export default kalshi;
