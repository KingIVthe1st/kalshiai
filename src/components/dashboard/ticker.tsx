"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface TickerItem {
  id: string;
  title: string;
  price: number;
  change: number;
}

interface GlobalTickerProps {
  items?: TickerItem[];
  className?: string;
}

// Mock data for demo
const mockTickerItems: TickerItem[] = [
  { id: "1", title: "Trump wins 2024", price: 0.52, change: 0.03 },
  { id: "2", title: "BTC > $100k by EOY", price: 0.28, change: -0.02 },
  { id: "3", title: "Fed cuts rates Jan", price: 0.67, change: 0.08 },
  { id: "4", title: "ETH flips BTC", price: 0.04, change: 0.01 },
  { id: "5", title: "AI passes Turing test", price: 0.45, change: -0.05 },
  { id: "6", title: "SpaceX Mars landing", price: 0.12, change: 0.02 },
  { id: "7", title: "Nvidia > $200", price: 0.71, change: 0.04 },
  { id: "8", title: "Ukraine peace deal", price: 0.23, change: -0.01 },
];

function TickerItemDisplay({ item }: { item: TickerItem }) {
  const isUp = item.change > 0;
  const isDown = item.change < 0;

  return (
    <div className="flex items-center gap-3 px-4 py-2 whitespace-nowrap">
      <span className="text-sm text-[var(--text-secondary)] truncate max-w-[200px]">
        {item.title}
      </span>
      <span className="text-sm font-mono font-medium text-[var(--text-primary)]">
        ${item.price.toFixed(2)}
      </span>
      <span
        className={cn(
          "flex items-center gap-0.5 text-xs font-medium",
          isUp && "text-[var(--up)]",
          isDown && "text-[var(--down)]",
          !isUp && !isDown && "text-[var(--text-tertiary)]"
        )}
      >
        {isUp && <TrendingUp className="w-3 h-3" />}
        {isDown && <TrendingDown className="w-3 h-3" />}
        {isUp ? "+" : ""}
        {(item.change * 100).toFixed(1)}%
      </span>
    </div>
  );
}

export function GlobalTicker({ items = mockTickerItems, className }: GlobalTickerProps) {
  // Duplicate items for seamless loop
  const duplicatedItems = [...items, ...items];

  return (
    <div
      className={cn(
        "relative overflow-hidden",
        "bg-[var(--surface-2)]/80 backdrop-blur-sm",
        "border-b border-[var(--border-default)]",
        className
      )}
    >
      {/* Fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-[var(--surface-2)] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-[var(--surface-2)] to-transparent z-10 pointer-events-none" />

      {/* Scrolling content */}
      <motion.div
        className="flex"
        animate={{
          x: ["0%", "-50%"],
        }}
        transition={{
          x: {
            duration: 30,
            repeat: Infinity,
            ease: "linear",
          },
        }}
      >
        {duplicatedItems.map((item, index) => (
          <TickerItemDisplay key={`${item.id}-${index}`} item={item} />
        ))}
      </motion.div>
    </div>
  );
}

export default GlobalTicker;
