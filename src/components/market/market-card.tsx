"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  Clock,
  BarChart3,
  Zap,
  ChevronRight
} from "lucide-react";
import { cn, formatCompact, formatCountdown } from "@/lib/utils";
import type { Market } from "@/lib/kalshi/types";

interface MarketCardProps {
  market: Market;
  onClick?: () => void;
  className?: string;
  featured?: boolean;
}

// Animated number component for price changes
function AnimatedPrice({
  value,
  prefix = "$",
  className
}: {
  value: number;
  prefix?: string;
  className?: string;
}) {
  const [displayValue, setDisplayValue] = React.useState(value);
  const [direction, setDirection] = React.useState<"up" | "down" | null>(null);

  React.useEffect(() => {
    if (value !== displayValue) {
      setDirection(value > displayValue ? "up" : "down");
      setDisplayValue(value);

      const timer = setTimeout(() => setDirection(null), 600);
      return () => clearTimeout(timer);
    }
  }, [value, displayValue]);

  return (
    <span
      className={cn(
        "tabular-nums font-mono transition-colors duration-300",
        direction === "up" && "text-[var(--up)]",
        direction === "down" && "text-[var(--down)]",
        className
      )}
    >
      <AnimatePresence mode="popLayout">
        <motion.span
          key={value}
          initial={{ y: direction === "up" ? 10 : -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: direction === "up" ? -10 : 10, opacity: 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        >
          {prefix}{value.toFixed(2)}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

// Mini sparkline component
function MiniSparkline({
  data,
  color,
  className
}: {
  data: number[];
  color: string;
  className?: string;
}) {
  const width = 80;
  const height = 32;
  const padding = 2;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const points = data.map((value, index) => {
    const x = padding + (index / (data.length - 1)) * (width - padding * 2);
    const y = height - padding - ((value - min) / range) * (height - padding * 2);
    return `${x},${y}`;
  }).join(" ");

  // Create gradient area
  const areaPoints = `${padding},${height - padding} ${points} ${width - padding},${height - padding}`;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className={cn("overflow-visible", className)}
      style={{ width, height }}
    >
      <defs>
        <linearGradient id={`gradient-${color}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      <polygon
        points={areaPoints}
        fill={`url(#gradient-${color})`}
      />
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter="url(#glow)"
      />
    </svg>
  );
}

// Probability bar component
function ProbabilityBar({
  yesPercent,
  noPercent,
  animated = true
}: {
  yesPercent: number;
  noPercent: number;
  animated?: boolean;
}) {
  return (
    <div className="relative h-1.5 w-full rounded-full overflow-hidden bg-[var(--surface-1)]">
      <motion.div
        className="absolute left-0 top-0 h-full rounded-full bg-gradient-to-r from-[var(--up)] to-[var(--up)]/70"
        initial={animated ? { width: 0 } : false}
        animate={{ width: `${yesPercent}%` }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
      />
      <motion.div
        className="absolute right-0 top-0 h-full rounded-full bg-gradient-to-l from-[var(--down)] to-[var(--down)]/70"
        initial={animated ? { width: 0 } : false}
        animate={{ width: `${noPercent}%` }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
      />
    </div>
  );
}

export function MarketCard({
  market,
  onClick,
  className,
  featured = false
}: MarketCardProps) {
  const [isHovered, setIsHovered] = React.useState(false);

  // Parse prices
  const yesPrice = parseFloat(market.outcomePrices?.[0] || "0");
  const noPrice = parseFloat(market.outcomePrices?.[1] || "0");
  const yesPercent = yesPrice * 100;
  const noPercent = noPrice * 100;

  // Determine trend
  const change24h = market.change24h || 0;
  const isUp = change24h > 0;
  const isDown = change24h < 0;

  // Generate mock sparkline data (in production, this would be real price history)
  const sparklineData = React.useMemo(() => {
    const base = yesPrice;
    return Array.from({ length: 12 }, (_, i) =>
      base + (Math.random() - 0.5) * 0.1
    );
  }, [yesPrice]);

  return (
    <motion.div
      className={cn(
        "group relative rounded-xl overflow-hidden cursor-pointer",
        "border border-[var(--border-default)]",
        "bg-[var(--surface-2)]",
        "transition-all duration-300",
        featured && "md:col-span-2",
        className
      )}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={onClick}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      layout
    >
      {/* Animated gradient border on hover */}
      <motion.div
        className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `linear-gradient(135deg, var(--accent) 0%, transparent 50%, var(--up) 100%)`,
          padding: "1px",
          WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
        }}
      />

      {/* Background glow effect on hover */}
      <motion.div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 50% 50%, var(--accent)/10 0%, transparent 70%)`,
        }}
      />

      {/* Content */}
      <div className="relative p-4 md:p-5 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            {/* Hot badge for trending markets */}
            {market.volume_24h && market.volume_24h > 100000 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-flex items-center gap-1 px-2 py-0.5 mb-2 rounded-full text-xs font-medium bg-[var(--hot-muted)] text-[var(--hot)] border border-[var(--hot)]/20"
              >
                <Zap className="w-3 h-3" />
                <span>Hot</span>
              </motion.div>
            )}

            {/* Market question */}
            <h3 className="text-sm md:text-base font-semibold text-[var(--text-primary)] line-clamp-2 group-hover:text-white transition-colors">
              {market.question}
            </h3>
          </div>

          {/* Mini chart */}
          <div className="hidden sm:block flex-shrink-0">
            <MiniSparkline
              data={sparklineData}
              color={isUp ? "var(--up)" : isDown ? "var(--down)" : "var(--text-tertiary)"}
            />
          </div>
        </div>

        {/* Probability bar */}
        <ProbabilityBar yesPercent={yesPercent} noPercent={noPercent} />

        {/* Price buttons */}
        <div className="flex gap-2">
          <motion.button
            className={cn(
              "flex-1 py-2.5 md:py-3 px-3 rounded-lg font-medium text-sm",
              "bg-[var(--up-muted)] text-[var(--up)]",
              "border border-[var(--up)]/20",
              "hover:bg-[var(--up)]/20 hover:border-[var(--up)]/40",
              "transition-all duration-200",
              "flex items-center justify-center gap-2"
            )}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="text-xs text-[var(--up)]/70">Yes</span>
            <AnimatedPrice value={yesPrice} className="text-base md:text-lg font-bold" />
            <span className="text-xs text-[var(--up)]/70">{yesPercent.toFixed(0)}%</span>
          </motion.button>

          <motion.button
            className={cn(
              "flex-1 py-2.5 md:py-3 px-3 rounded-lg font-medium text-sm",
              "bg-[var(--down-muted)] text-[var(--down)]",
              "border border-[var(--down)]/20",
              "hover:bg-[var(--down)]/20 hover:border-[var(--down)]/40",
              "transition-all duration-200",
              "flex items-center justify-center gap-2"
            )}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="text-xs text-[var(--down)]/70">No</span>
            <AnimatedPrice value={noPrice} className="text-base md:text-lg font-bold" />
            <span className="text-xs text-[var(--down)]/70">{noPercent.toFixed(0)}%</span>
          </motion.button>
        </div>

        {/* Footer metadata */}
        <div className="flex items-center justify-between text-xs text-[var(--text-tertiary)]">
          <div className="flex items-center gap-3">
            {/* Volume */}
            <div className="flex items-center gap-1">
              <BarChart3 className="w-3.5 h-3.5" />
              <span>${formatCompact(market.volume_24h || 0)}</span>
            </div>

            {/* 24h change */}
            {change24h !== 0 && (
              <div className={cn(
                "flex items-center gap-0.5",
                isUp && "text-[var(--up)]",
                isDown && "text-[var(--down)]"
              )}>
                {isUp ? (
                  <TrendingUp className="w-3.5 h-3.5" />
                ) : (
                  <TrendingDown className="w-3.5 h-3.5" />
                )}
                <span>{isUp ? "+" : ""}{(change24h * 100).toFixed(1)}%</span>
              </div>
            )}
          </div>

          {/* Time remaining */}
          {market.endDate && (
            <div className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              <span>{formatCountdown(market.endDate)}</span>
            </div>
          )}

          {/* Arrow indicator on hover */}
          <motion.div
            className="hidden md:flex items-center text-[var(--accent)]"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : -10 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronRight className="w-4 h-4" />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

// Featured large market card variant
export function FeaturedMarketCard({
  market,
  onClick,
  className
}: MarketCardProps) {
  const yesPrice = parseFloat(market.outcomePrices?.[0] || "0");
  const noPrice = parseFloat(market.outcomePrices?.[1] || "0");

  // Generate mock sparkline data
  const sparklineData = React.useMemo(() => {
    const base = yesPrice;
    return Array.from({ length: 24 }, (_, i) =>
      base + (Math.random() - 0.5) * 0.15
    );
  }, [yesPrice]);

  const isUp = (market.change24h || 0) > 0;

  return (
    <motion.div
      className={cn(
        "relative rounded-2xl overflow-hidden cursor-pointer",
        "border border-[var(--border-default)]",
        "bg-gradient-to-br from-[var(--surface-2)] to-[var(--surface-3)]",
        "p-5 md:p-6",
        className
      )}
      onClick={onClick}
      whileHover={{ scale: 1.005 }}
      whileTap={{ scale: 0.995 }}
    >
      {/* Background pattern */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, var(--text-primary) 1px, transparent 0)`,
          backgroundSize: "24px 24px",
        }}
      />

      {/* Gradient orb */}
      <div
        className="absolute -top-20 -right-20 w-64 h-64 rounded-full opacity-20 blur-3xl"
        style={{
          background: `radial-gradient(circle, var(--accent) 0%, transparent 70%)`,
        }}
      />

      <div className="relative space-y-4">
        {/* Badge */}
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-[var(--accent)]/20 text-[var(--accent)] border border-[var(--accent)]/30">
          <Zap className="w-3 h-3" />
          <span>Featured Market</span>
        </div>

        {/* Title */}
        <h2 className="text-xl md:text-2xl font-bold text-white leading-tight">
          {market.question}
        </h2>

        {/* Large sparkline */}
        <div className="py-4">
          <svg viewBox="0 0 300 80" className="w-full h-20">
            <defs>
              <linearGradient id="featuredGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor={isUp ? "var(--up)" : "var(--down)"} stopOpacity="0.4" />
                <stop offset="100%" stopColor={isUp ? "var(--up)" : "var(--down)"} stopOpacity="0" />
              </linearGradient>
            </defs>
            {/* Area fill */}
            <polygon
              points={`0,80 ${sparklineData.map((v, i) =>
                `${(i / (sparklineData.length - 1)) * 300},${80 - v * 80}`
              ).join(" ")} 300,80`}
              fill="url(#featuredGradient)"
            />
            {/* Line */}
            <polyline
              points={sparklineData.map((v, i) =>
                `${(i / (sparklineData.length - 1)) * 300},${80 - v * 80}`
              ).join(" ")}
              fill="none"
              stroke={isUp ? "var(--up)" : "var(--down)"}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ filter: `drop-shadow(0 0 8px ${isUp ? "var(--glow-up)" : "var(--glow-down)"})` }}
            />
          </svg>
        </div>

        {/* Price display */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs text-[var(--text-tertiary)] uppercase tracking-wider">Yes Price</p>
            <p className="text-3xl md:text-4xl font-bold text-[var(--up)] tabular-nums font-mono">
              ${yesPrice.toFixed(2)}
            </p>
          </div>
          <div className="text-right space-y-1">
            <p className="text-xs text-[var(--text-tertiary)] uppercase tracking-wider">Volume</p>
            <p className="text-xl md:text-2xl font-semibold text-[var(--text-primary)]">
              ${formatCompact(market.volume_24h || 0)}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default MarketCard;
