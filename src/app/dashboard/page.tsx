"use client";

import * as React from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  Zap,
  Brain,
  Users,
  AlertTriangle,
  RefreshCw,
  Filter,
  LayoutGrid,
  List,
  Sparkles,
  Activity,
  DollarSign,
  BarChart3,
  ArrowUpRight,
  Eye,
  WifiOff,
} from "lucide-react";
import { DashboardLayout } from "@/components/dashboard";
import { MarketCard, FeaturedMarketCard } from "@/components/market";
import { Button, Skeleton, Badge } from "@/components/ui";
import { cn, formatCompact } from "@/lib/utils";
import { kalshi } from "@/lib/kalshi/client";
import type { Market } from "@/lib/kalshi/types";

// Stat card component
function StatCard({
  icon: Icon,
  label,
  value,
  change,
  changeLabel,
  gradient,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  change?: number;
  changeLabel?: string;
  gradient: string;
}) {
  const isUp = change && change > 0;
  const isDown = change && change < 0;

  return (
    <motion.div
      className="relative rounded-xl p-4 md:p-5 bg-[var(--surface-2)] border border-[var(--border-default)] overflow-hidden group"
      whileHover={{ scale: 1.02, y: -2 }}
      transition={{ duration: 0.2 }}
    >
      {/* Gradient background */}
      <div
        className={cn(
          "absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500",
          gradient
        )}
      />

      <div className="relative space-y-3">
        <div className="flex items-center justify-between">
          <div className="w-10 h-10 rounded-lg bg-[var(--surface-3)] flex items-center justify-center">
            <Icon className="w-5 h-5 text-[var(--accent)]" />
          </div>
          {change !== undefined && (
            <div
              className={cn(
                "flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full",
                isUp && "bg-[var(--up-muted)] text-[var(--up)]",
                isDown && "bg-[var(--down-muted)] text-[var(--down)]",
                !isUp && !isDown && "bg-[var(--surface-3)] text-[var(--text-tertiary)]"
              )}
            >
              {isUp && <TrendingUp className="w-3 h-3" />}
              {isDown && <TrendingDown className="w-3 h-3" />}
              <span>
                {isUp ? "+" : ""}
                {change.toFixed(1)}%
              </span>
            </div>
          )}
        </div>

        <div>
          <p className="text-2xl md:text-3xl font-bold text-[var(--text-primary)] tabular-nums">
            {value}
          </p>
          <p className="text-xs text-[var(--text-tertiary)] mt-1">{label}</p>
        </div>
      </div>
    </motion.div>
  );
}

// AI Insight card component
function AIInsightCard({
  title,
  description,
  confidence,
  market,
  type,
}: {
  title: string;
  description: string;
  confidence: number;
  market: string;
  type: "bullish" | "bearish" | "neutral";
}) {
  return (
    <motion.div
      className="p-4 rounded-xl bg-[var(--surface-2)] border border-[var(--border-default)] space-y-3"
      whileHover={{ scale: 1.01 }}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[var(--accent)]/20 flex items-center justify-center">
            <Brain className="w-4 h-4 text-[var(--accent)]" />
          </div>
          <div>
            <p className="text-sm font-medium text-[var(--text-primary)]">{title}</p>
            <p className="text-xs text-[var(--text-tertiary)]">{market}</p>
          </div>
        </div>
        <Badge
          variant={type === "bullish" ? "success" : type === "bearish" ? "destructive" : "secondary"}
          size="sm"
        >
          {type === "bullish" ? "Bullish" : type === "bearish" ? "Bearish" : "Neutral"}
        </Badge>
      </div>

      <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{description}</p>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 text-xs text-[var(--text-tertiary)]">
          <Sparkles className="w-3 h-3 text-[var(--accent)]" />
          <span>AI Confidence: {confidence}%</span>
        </div>
        <Button variant="ghost" size="sm" className="text-xs h-7 px-2">
          View Details
          <ArrowUpRight className="w-3 h-3" />
        </Button>
      </div>
    </motion.div>
  );
}

// Whale activity component
function WhaleActivity({
  wallet,
  action,
  market,
  amount,
  time,
}: {
  wallet: string;
  action: "buy" | "sell";
  market: string;
  amount: number;
  time: string;
}) {
  return (
    <motion.div
      className="flex items-center gap-3 p-3 rounded-lg bg-[var(--surface-2)] border border-[var(--border-default)]"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      whileHover={{ x: 4 }}
    >
      <div
        className={cn(
          "w-10 h-10 rounded-lg flex items-center justify-center",
          action === "buy" ? "bg-[var(--up-muted)]" : "bg-[var(--down-muted)]"
        )}
      >
        <Users
          className={cn(
            "w-5 h-5",
            action === "buy" ? "text-[var(--up)]" : "text-[var(--down)]"
          )}
        />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-[var(--text-primary)] truncate">
            {wallet}
          </span>
          <Badge variant={action === "buy" ? "success" : "destructive"} size="sm">
            {action === "buy" ? "BUY" : "SELL"}
          </Badge>
        </div>
        <p className="text-xs text-[var(--text-tertiary)] truncate">{market}</p>
      </div>

      <div className="text-right">
        <p className="text-sm font-semibold text-[var(--text-primary)] tabular-nums">
          ${formatCompact(amount)}
        </p>
        <p className="text-xs text-[var(--text-muted)]">{time}</p>
      </div>
    </motion.div>
  );
}

// View toggle component
function ViewToggle({
  view,
  setView,
}: {
  view: "grid" | "list";
  setView: (view: "grid" | "list") => void;
}) {
  return (
    <div className="flex items-center gap-1 p-1 rounded-lg bg-[var(--surface-2)] border border-[var(--border-default)]">
      <button
        onClick={() => setView("grid")}
        className={cn(
          "p-2 rounded-md transition-all",
          view === "grid"
            ? "bg-[var(--accent)] text-white"
            : "text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]"
        )}
      >
        <LayoutGrid className="w-4 h-4" />
      </button>
      <button
        onClick={() => setView("list")}
        className={cn(
          "p-2 rounded-md transition-all",
          view === "list"
            ? "bg-[var(--accent)] text-white"
            : "text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]"
        )}
      >
        <List className="w-4 h-4" />
      </button>
    </div>
  );
}

export default function DashboardPage() {
  const queryClient = useQueryClient();
  const [view, setView] = React.useState<"grid" | "list">("grid");

  // Fetch hot markets from Kalshi API
  const {
    data: hotMarketsData,
    isLoading: isLoadingHot,
    error: hotError,
    refetch: refetchHot,
    isFetching: isFetchingHot,
  } = useQuery({
    queryKey: ["kalshi", "hot-markets"],
    queryFn: () => kalshi.getHotMarkets(8),
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 60 * 1000, // Auto-refresh every 60 seconds
  });

  // Fetch trending markets from Kalshi API
  const {
    data: trendingMarketsData,
    isLoading: isLoadingTrending,
    error: trendingError,
    refetch: refetchTrending,
    isFetching: isFetchingTrending,
  } = useQuery({
    queryKey: ["kalshi", "trending-markets"],
    queryFn: () => kalshi.getTrendingMarkets(6),
    staleTime: 30 * 1000,
    refetchInterval: 60 * 1000,
  });

  const isLoading = isLoadingHot || isLoadingTrending;
  const isRefreshing = isFetchingHot || isFetchingTrending;
  const hasError = hotError || trendingError;

  const handleRefresh = async () => {
    await Promise.all([refetchHot(), refetchTrending()]);
  };

  // Get featured market (first hot market - highest score)
  const featuredMarket = hotMarketsData?.[0] ?? null;
  const hotMarkets = hotMarketsData?.slice(1, 5) ?? [];
  const trendingMarkets = trendingMarketsData ?? [];

  // Calculate total volume from markets
  const totalVolume24h = React.useMemo(() => {
    const allMarkets = [...(hotMarketsData ?? []), ...(trendingMarketsData ?? [])];
    const uniqueMarkets = allMarkets.filter((m, i, arr) =>
      arr.findIndex(x => x.ticker === m.ticker) === i
    );
    return uniqueMarkets.reduce((sum, m) => sum + (m.volume_24h || 0), 0);
  }, [hotMarketsData, trendingMarketsData]);

  const activeMarketsCount = (hotMarketsData?.length ?? 0) + (trendingMarketsData?.length ?? 0);

  return (
    <DashboardLayout>
      <div className="space-y-6 md:space-y-8">
        {/* Page header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-[var(--text-primary)]">
              Dashboard
            </h1>
            <p className="text-sm text-[var(--text-secondary)] mt-1">
              AI-powered market intelligence at your fingertips
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              <RefreshCw
                className={cn("w-4 h-4", isRefreshing && "animate-spin")}
              />
              <span className="hidden sm:inline">Refresh</span>
            </Button>
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4" />
              <span className="hidden sm:inline">Filters</span>
            </Button>
            <ViewToggle view={view} setView={setView} />
          </div>
        </div>

        {/* Error state */}
        {hasError && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-xl bg-[var(--down-muted)] border border-[var(--down)]/30 flex items-center gap-3"
          >
            <WifiOff className="w-5 h-5 text-[var(--down)]" />
            <div className="flex-1">
              <p className="text-sm font-medium text-[var(--text-primary)]">
                Unable to connect to Kalshi API
              </p>
              <p className="text-xs text-[var(--text-secondary)]">
                Live data unavailable. Showing cached data if available.
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={handleRefresh}>
              Retry
            </Button>
          </motion.div>
        )}

        {/* Stats row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {isLoading ? (
            <>
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-32 rounded-xl" />
              ))}
            </>
          ) : (
            <>
              <StatCard
                icon={DollarSign}
                label="Total Volume (24h)"
                value={`$${formatCompact(totalVolume24h)}`}
                gradient="bg-gradient-to-br from-[var(--up)] to-transparent"
              />
              <StatCard
                icon={Activity}
                label="Markets Loaded"
                value={String(activeMarketsCount)}
                gradient="bg-gradient-to-br from-[var(--accent)] to-transparent"
              />
              <StatCard
                icon={Eye}
                label="Markets Watched"
                value="0"
                gradient="bg-gradient-to-br from-[var(--hot)] to-transparent"
              />
              <StatCard
                icon={AlertTriangle}
                label="AI Alerts"
                value="0"
                gradient="bg-gradient-to-br from-[var(--warning)] to-transparent"
              />
            </>
          )}
        </div>

        {/* Main content grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Featured + Hot Markets (2/3) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Featured Market */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-[var(--text-primary)] flex items-center gap-2">
                  <Zap className="w-5 h-5 text-[var(--accent)]" />
                  Featured Market
                </h2>
              </div>

              {isLoading ? (
                <Skeleton className="h-72 rounded-2xl" />
              ) : featuredMarket ? (
                <FeaturedMarketCard market={featuredMarket} />
              ) : null}
            </div>

            {/* Hot Markets */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-[var(--text-primary)] flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-[var(--up)]" />
                  Hot Markets
                </h2>
                <Button variant="ghost" size="sm">
                  View All
                  <ArrowUpRight className="w-4 h-4" />
                </Button>
              </div>

              {isLoading ? (
                <div className="grid sm:grid-cols-2 gap-4">
                  {[...Array(4)].map((_, i) => (
                    <Skeleton key={i} className="h-48 rounded-xl" />
                  ))}
                </div>
              ) : (
                <motion.div
                  className={cn(
                    view === "grid"
                      ? "grid sm:grid-cols-2 gap-4"
                      : "space-y-3"
                  )}
                  layout
                >
                  <AnimatePresence mode="popLayout">
                    {hotMarkets.map((market) => (
                      <MarketCard key={market.ticker} market={market} />
                    ))}
                  </AnimatePresence>
                </motion.div>
              )}
            </div>

            {/* Trending Markets */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-[var(--text-primary)] flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-[var(--hot)]" />
                  Trending Now
                </h2>
              </div>

              {isLoading ? (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[...Array(3)].map((_, i) => (
                    <Skeleton key={i} className="h-48 rounded-xl" />
                  ))}
                </div>
              ) : (
                <motion.div
                  className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4"
                  layout
                >
                  <AnimatePresence mode="popLayout">
                    {trendingMarkets.map((market) => (
                      <MarketCard key={market.ticker} market={market} />
                    ))}
                  </AnimatePresence>
                </motion.div>
              )}
            </div>
          </div>

          {/* Sidebar widgets (1/3) */}
          <div className="space-y-6">
            {/* AI Insights */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-[var(--text-primary)] flex items-center gap-2">
                  <Brain className="w-5 h-5 text-[var(--accent)]" />
                  AI Insights
                </h2>
                <Badge variant="default" size="sm" className="animate-pulse">
                  Live
                </Badge>
              </div>

              {isLoading ? (
                <div className="space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <Skeleton key={i} className="h-32 rounded-xl" />
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  <AIInsightCard
                    title="Mispriced Opportunity"
                    description="AI analysis suggests BTC $100k market is underpriced. Current sentiment indicators and on-chain metrics show 15% edge potential."
                    confidence={87}
                    market="Bitcoin $100k by 2024"
                    type="bullish"
                  />
                  <AIInsightCard
                    title="Resolution Risk"
                    description="Oracle ambiguity detected. Resolution criteria may lead to dispute. Consider reducing exposure."
                    confidence={72}
                    market="Apple Foldable 2025"
                    type="bearish"
                  />
                  <AIInsightCard
                    title="Smart Money Moving"
                    description="3 wallets with >80% win rate just entered positions. Volume spike of 340% in last hour."
                    confidence={91}
                    market="Fed Rate Cut Dec"
                    type="bullish"
                  />
                </div>
              )}
            </div>

            {/* Whale Activity */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-[var(--text-primary)] flex items-center gap-2">
                  <Users className="w-5 h-5 text-[var(--up)]" />
                  Whale Activity
                </h2>
                <Button variant="ghost" size="sm">
                  View All
                </Button>
              </div>

              {isLoading ? (
                <div className="space-y-3">
                  {[...Array(4)].map((_, i) => (
                    <Skeleton key={i} className="h-16 rounded-lg" />
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  <WhaleActivity
                    wallet="0x8f23...c4d2"
                    action="buy"
                    market="Trump 2024"
                    amount={125000}
                    time="2m ago"
                  />
                  <WhaleActivity
                    wallet="0xab12...9e8f"
                    action="sell"
                    market="BTC $100k"
                    amount={89000}
                    time="5m ago"
                  />
                  <WhaleActivity
                    wallet="0x3c45...a7b1"
                    action="buy"
                    market="Fed Rate Cut"
                    amount={250000}
                    time="12m ago"
                  />
                  <WhaleActivity
                    wallet="0xd6e7...2f3c"
                    action="buy"
                    market="Starship Orbit"
                    amount={67000}
                    time="18m ago"
                  />
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="p-4 rounded-xl bg-gradient-to-br from-[var(--surface-2)] to-[var(--surface-3)] border border-[var(--border-default)]">
              <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-3">
                Quick Actions
              </h3>
              <div className="space-y-2">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Brain className="w-4 h-4 text-[var(--accent)]" />
                  Run AI Analysis
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <AlertTriangle className="w-4 h-4 text-[var(--warning)]" />
                  Set Price Alert
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Users className="w-4 h-4 text-[var(--up)]" />
                  Track Wallet
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
