"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  LineChart,
  Wallet,
  Bell,
  Settings,
  Search,
  TrendingUp,
  Users,
  Brain,
  Zap,
  Menu,
  X,
  ChevronLeft,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  badge?: string;
  isNew?: boolean;
}

const mainNavItems: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Markets", href: "/markets", icon: TrendingUp },
  { label: "Screener", href: "/screener", icon: Search },
  { label: "AI Insights", href: "/insights", icon: Brain, isNew: true },
  { label: "Smart Money", href: "/smart-money", icon: Users },
];

const secondaryNavItems: NavItem[] = [
  { label: "Portfolio", href: "/portfolio", icon: Wallet },
  { label: "Alerts", href: "/alerts", icon: Bell, badge: "3" },
  { label: "Settings", href: "/settings", icon: Settings },
];

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);

  return (
    <>
      {/* Mobile menu button */}
      <button
        className="fixed top-4 left-4 z-50 md:hidden p-2 rounded-lg bg-[var(--surface-2)] border border-[var(--border-default)] text-[var(--text-primary)]"
        onClick={() => setMobileOpen(true)}
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        className={cn(
          "fixed top-0 left-0 z-50 h-screen flex flex-col",
          "bg-[var(--surface-2)]/95 backdrop-blur-xl",
          "border-r border-[var(--border-default)]",
          // Mobile: full width slide-in
          "w-72 md:w-auto",
          // Desktop: collapsible
          collapsed ? "md:w-[72px]" : "md:w-64",
          // Mobile visibility
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
          "transition-all duration-300 ease-out",
          className
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[var(--border-default)]">
          <Link href="/dashboard" className="flex items-center gap-3">
            {/* Logo */}
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--accent)] to-[var(--hot)] flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              {/* Glow effect */}
              <div className="absolute inset-0 rounded-xl bg-[var(--accent)] blur-xl opacity-30" />
            </div>

            <AnimatePresence>
              {!collapsed && (
                <motion.div
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  className="overflow-hidden"
                >
                  <span className="text-xl font-bold bg-gradient-to-r from-[var(--text-primary)] to-[var(--accent)] bg-clip-text text-transparent">
                    KalshiAI
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </Link>

          {/* Mobile close button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-[var(--surface-3)] text-[var(--text-tertiary)]"
            onClick={() => setMobileOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>

          {/* Desktop collapse button */}
          <button
            className="hidden md:flex p-2 rounded-lg hover:bg-[var(--surface-3)] text-[var(--text-tertiary)] transition-colors"
            onClick={() => setCollapsed(!collapsed)}
          >
            <motion.div
              animate={{ rotate: collapsed ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronLeft className="w-4 h-4" />
            </motion.div>
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto scrollbar-hide">
          {/* Main nav */}
          <div className="space-y-1">
            {mainNavItems.map((item) => (
              <NavLink
                key={item.href}
                item={item}
                isActive={pathname === item.href}
                collapsed={collapsed}
                onClick={() => setMobileOpen(false)}
              />
            ))}
          </div>

          {/* Divider */}
          <div className="my-4 border-t border-[var(--border-default)]" />

          {/* Secondary nav */}
          <div className="space-y-1">
            {secondaryNavItems.map((item) => (
              <NavLink
                key={item.href}
                item={item}
                isActive={pathname === item.href}
                collapsed={collapsed}
                onClick={() => setMobileOpen(false)}
              />
            ))}
          </div>
        </nav>

        {/* Pro upgrade card (when expanded) */}
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="p-3"
            >
              <div className="relative p-4 rounded-xl bg-gradient-to-br from-[var(--accent)]/20 to-[var(--hot)]/20 border border-[var(--accent)]/30 overflow-hidden">
                {/* Background pattern */}
                <div
                  className="absolute inset-0 opacity-10"
                  style={{
                    backgroundImage: `radial-gradient(circle at 2px 2px, var(--accent) 1px, transparent 0)`,
                    backgroundSize: "16px 16px",
                  }}
                />

                <div className="relative space-y-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[var(--accent)]" />
                    <span className="text-sm font-semibold text-[var(--text-primary)]">
                      Upgrade to Pro
                    </span>
                  </div>
                  <p className="text-xs text-[var(--text-secondary)]">
                    Unlock AI insights, smart money tracking & real-time alerts
                  </p>
                  <button className="w-full py-2 px-3 rounded-lg bg-[var(--accent)] text-white text-sm font-medium hover:bg-[var(--accent-hover)] transition-colors">
                    Start Free Trial
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* User section */}
        <div className="p-3 border-t border-[var(--border-default)]">
          <div className={cn(
            "flex items-center gap-3 p-2 rounded-lg",
            "hover:bg-[var(--surface-3)] transition-colors cursor-pointer"
          )}>
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[var(--up)] to-[var(--info)] flex items-center justify-center text-sm font-medium text-white">
              U
            </div>
            <AnimatePresence>
              {!collapsed && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex-1 min-w-0"
                >
                  <p className="text-sm font-medium text-[var(--text-primary)] truncate">
                    Connect Wallet
                  </p>
                  <p className="text-xs text-[var(--text-tertiary)]">
                    Free Plan
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.aside>
    </>
  );
}

function NavLink({
  item,
  isActive,
  collapsed,
  onClick,
}: {
  item: NavItem;
  isActive: boolean;
  collapsed: boolean;
  onClick?: () => void;
}) {
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      onClick={onClick}
      className={cn(
        "group relative flex items-center gap-3 px-3 py-2.5 rounded-lg",
        "transition-all duration-200",
        isActive
          ? "bg-[var(--accent)]/15 text-[var(--accent)]"
          : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-3)]"
      )}
    >
      {/* Active indicator */}
      {isActive && (
        <motion.div
          layoutId="activeIndicator"
          className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-full bg-[var(--accent)]"
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      )}

      <Icon className={cn("w-5 h-5 flex-shrink-0", isActive && "text-[var(--accent)]")} />

      <AnimatePresence>
        {!collapsed && (
          <motion.span
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: "auto" }}
            exit={{ opacity: 0, width: 0 }}
            className="text-sm font-medium flex-1 truncate"
          >
            {item.label}
          </motion.span>
        )}
      </AnimatePresence>

      {/* Badge */}
      {!collapsed && item.badge && (
        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-[var(--down)] text-white">
          {item.badge}
        </span>
      )}

      {/* New badge */}
      {!collapsed && item.isNew && (
        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-[var(--up)]/20 text-[var(--up)] border border-[var(--up)]/30">
          New
        </span>
      )}

      {/* Tooltip for collapsed state */}
      {collapsed && (
        <div className="absolute left-full ml-2 px-2 py-1 rounded-md bg-[var(--surface-3)] text-sm text-[var(--text-primary)] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50 border border-[var(--border-default)]">
          {item.label}
        </div>
      )}
    </Link>
  );
}

export default Sidebar;
